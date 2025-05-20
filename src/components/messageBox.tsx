"use client"

import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useRecoilState, useSetRecoilState } from "recoil"
import { loaderState, meetingReceiverId } from "../recoil/atoms"
import { UserMessage } from "../routes/utilInterface/UserMessageInterface"
import { MessageInterface } from "../routes/utilInterface/MessagesInterface"
import { TransactionInterface } from "../routes/utilInterface/TransactionInterface"
import { BackButtonIcon } from "./backButton"
import { VideoCallIcon } from "./videoCallIcon"
import { SendButtonIcon } from "./sendButton"
import Loader from "./loader"

const API_URL = import.meta.env.VITE_API_URL

export function MessageBox() {
  const token = localStorage.getItem("token") || ""
  const userId = Number(localStorage.getItem("userId") || "0")
  const navigate = useNavigate()
  const setMeetingRecId = useSetRecoilState(meetingReceiverId)
  const [isLoading, setIsLoading] = useRecoilState(loaderState)

  // users & chat state
  const [userProfiles, setUserProfiles] = useState<UserMessage[]>([])
  const [selectedUser, setSelectedUser] = useState<UserMessage | null>(null)
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [txDetails, setTxDetails] = useState<TransactionInterface | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  // fetch users
  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const { data } = await axios.get(`${API_URL}/messages/users`, { headers: { token } })
      setUserProfiles(data.userDetails)
      setIsLoading(false)
    })()
  }, [])

  // handle incoming tx to auto-complete
  useEffect(() => {
    if (!txDetails) return
    ;(async () => {
      await axios.post(`${API_URL}/transaction/complete`, {
        id: txDetails.id,
        senderId: txDetails.senderId,
        recieverId: txDetails.recieverId,
        amount: txDetails.recieverAmount,
      }, { headers: { token } })
      // delete original request
      const url = txDetails.type === "TEACH_REQUEST"
        ? `${API_URL}/teachRequest`
        : `${API_URL}/tradeRequest`
      await axios.delete(url, {
        headers: { token },
        data: { [`${txDetails.type.toLowerCase()}` + "Id"]: txDetails.requestId }
      })
    })()
  }, [txDetails])

  // start a meeting (and navigate)
  async function startMeeting() {
    if (!selectedUser) return
    setIsLoading(true)
    const res = await axios.post(`${API_URL}/transaction/pending`,
      { user2Id: selectedUser.id },
      { headers: { token } }
    )
    if (res.status === 200) {
      setTxDetails(res.data.transaction)
      setMeetingRecId(selectedUser.id)
      navigate("/video")
    }
    setIsLoading(false)
  }

  // open chat & setup websocket
  async function openChat(user: UserMessage) {
    setSelectedUser(user)
    setMeetingRecId(user.id)
    setIsLoading(true)
    const { data } = await axios.post(`${API_URL}/messages/fetchMessages`,
      { receiverId: user.id }, { headers: { token } }
    )
    setMessages(data.allMessages)
    setIsLoading(false)

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      const ws = new WebSocket("ws://localhost:8080")
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "Register", senderId: userId }))
      }
      ws.onmessage = (ev) => {
        const msg: MessageInterface = JSON.parse(ev.data)
        setMessages((m) => [...m, msg])
      }
      ws.onclose = () => setSocket(null)
      setSocket(ws)
    }
  }

  // send a message
  function sendMessage() {
    if (!socket || !selectedUser || !inputRef.current?.value.trim()) return
    const content = inputRef.current.value.trim()
    const payload = { type: "Message", senderId: userId, receiverId: selectedUser.id, message: content }
    socket.send(JSON.stringify(payload))
    setMessages((m) => [...m, { senderId: userId, receiverId: selectedUser.id, content }])
    inputRef.current.value = ""
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[400px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden z-50">
      {isLoading && <Loader />}

      {/* Header */}
      <div className="flex items-center justify-center relative bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3">
        {selectedUser && (
          <button
            className="absolute left-3"
            onClick={() => setSelectedUser(null)}
          >
            <BackButtonIcon className="w-5 h-5 text-white" />
          </button>
        )}
        <h2 className="text-lg font-semibold">
          {selectedUser ? selectedUser.username : "Messages"}
        </h2>
        {selectedUser && (
          <button
            className="absolute right-3"
            onClick={startMeeting}
          >
            <VideoCallIcon className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Body */}
      {selectedUser ? (
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  m.senderId === userId ? "ml-auto bg-purple-500 text-white" : "mr-auto bg-gray-200 text-gray-800"
                }`}
              >
                {m.type === "MEETING" ? (
                  <Link
                    to={`/video/join/${m.meetingId}`}
                    className="underline"
                  >
                    {m.content}
                  </Link>
                ) : (
                  m.content
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center p-3 border-t">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-full focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition"
            >
              <SendButtonIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
          {userProfiles.map((u) => (
            <button
              key={u.id}
              onClick={() => openChat(u)}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <img
                src={u.profilePicture}
                alt={u.username}
                className="w-8 h-8 rounded-full mr-3"
              />
              <span className="text-gray-800">{u.username}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
