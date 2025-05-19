
import axios from "axios";
import { useEffect } from "react";
import { Bell } from "lucide-react";
import { useRecoilState } from "recoil";

import { NotificationCard } from "../components/notificationCard";
import { allNotificationsArray, loaderState } from "../recoil/atoms";
import type { TeachNotification, TradeNotification } from "./utilInterface/NotificationInterface";

const API_URL = import.meta.env.VITE_API_URL;

export function Notifications() {
  const [allNotifications, setAllNotifications] =
    useRecoilState<(TeachNotification | TradeNotification)[]>(allNotificationsArray);
  const [, setIsLoading] = useRecoilState(loaderState);

  async function fetchAllRequests() {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No auth token found in localStorage.");
        return;
      }

      const [teachResponse, tradeResponse] = await Promise.all([
        axios.get(`${API_URL}/teachRequest/get`, { headers: { token } }),
        axios.get(`${API_URL}/tradeRequest`, { headers: { token } }),
      ]);

      setAllNotifications([
        ...teachResponse.data.teachRequests,
        ...tradeResponse.data.tradeRequests,
      ]);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const pendingNotifications = allNotifications?.filter(
    (item) => item.status === "PENDING"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-16 px-4 font-['DM_sans']">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Bell className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        </div>

        {/* Notification Box */}
        <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6">
          {pendingNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Bell className="w-10 h-10 text-purple-400" />
              </div>
              <p className="text-xl text-gray-500">No notifications yet...</p>
              <p className="text-gray-400 mt-2">
                When you receive requests or updates, they'll appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingNotifications.map((item, index) => (
                <div
                  key={index}
                  className="transition-all hover:shadow-md rounded-lg overflow-hidden border border-gray-100"
                >
                  <NotificationCard {...item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
