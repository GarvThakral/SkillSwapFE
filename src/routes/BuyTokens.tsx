import { useRef, useState } from "react";
import { Button } from "../components/buttons";
import { CreditCardIcon } from "../components/creditCardIcon";
import { MoneyIcon } from "../components/moneyIcon";
import { ExchangeIcon } from "../components/exchangeIcon";

export function BuyTokens() {
    const [amount, setAmount] = useState(250);
    const selectRef = useRef<HTMLSelectElement>(null);
    const tokenRef = useRef<HTMLInputElement>(null);
    function loadScript(src:any) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    async function displayRazorpay() {
        if (!amount || parseInt(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            alert("Razorpay failed to load!");
            return;
        }

        // Send amount to backend to create an order
        const response = await fetch("http://localhost:3000/payment/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
        });

        const data = await response.json();

        if (!data || !data.id) {
            alert("Failed to create order");
            return;
        }

        const options = {
            key: "rzp_test_ru5HdNikLfjmlt", // Use test/live key accordingly
            amount: data.amount, // Amount from backend (should already be in paisa)
            currency: "INR",
            name: "SkillSwap",
            description: "Token Purchase",
            image: "https://example.com/logo.png",
            order_id: data.id, // Order ID from backend
            handler: async function (response:any) {
                // Send response to backend for verification
                const userId = localStorage.getItem('userId')
                const verifyRes = await fetch("http://localhost:3000/payment/verify-payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,  // Pass userId for storing transaction history
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    }),
                });

                const verifyData = await verifyRes.json();

                if (verifyData.success) {
                    alert("Payment Successful!");
                    // Add logic to update user's token balance
                } else {
                    alert("Payment Verification Failed!");
                }
            },
            prefill: {
                name: "User Name",
                email: "user@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#3399cc",
            },
        };
        // @ts-ignore
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    return (
        <div className="h-screen flex justify-center items-center flex-col">
            {/* <span>How many tokens do you want to buy?</span>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="border p-2 m-2"
            />
            <Button text="Purchase" style="Secondary" onclick={displayRazorpay} /> */}
            <div className = {`w-[35%] h-[70%] grid grid-cols-4 rounded-lg font-['DM_sans'] border-2 drop-shadow-lg bg-gray-200 p-2`}>
                <div className = {'col-span-2  flex flex-col items-center bordeer-r-2 border-2 border-gray-400 border-r-0 rounded-l-xl'}>
                    <div className = {'flex flex-col items-center justify-center h-[60%] border-b-2 border-gray-400 w-full space-y-9'}>
                        <div className = {'text-2xl font-extrabold '}>
                            Purchase Tokens
                        </div>
                        <div className = {'flex flex-col items-center '}>
                            <label className = {'text-lg font-semibold'}>Select a package</label>
                            <select 
                                className = {'bg-transparent border-b-2 text-center outline-none border-gray-400 '} 
                                ref = {selectRef} 
                                onChange={()=>{
                                    if(selectRef.current.value == ""){
                                        setAmount((tokenRef.current.value)*5);
                                    }else if(selectRef.current.value == "Standard"){
                                        setAmount(1000);
                                    }else if(selectRef.current.value == "Enthusiast"){
                                        setAmount(2000);
                                    }else if(selectRef.current.value == "Learner"){
                                        setAmount(3000);
                                    }else if(selectRef.current.value == "The almighty"){
                                        setAmount(4000);
                                    }
                                }}>
                                <option value = "">
                                    Select
                                </option>
                                <option value = "Standard">
                                    Standard
                                </option>
                                <option value = "Enthusiast">
                                    Enthusiast
                                </option>
                                <option value = "Learner">
                                    Learner
                                </option>
                                <option value = "The almighty">
                                    The almighty
                                </option>
                            </select>
                        </div>
                        <div className = {'flex flex-col items-center'}>
                            <label className = {'text-lg font-semibold'}>
                                Add custom tokens
                            </label>
                            <input
                                ref = {tokenRef}
                                type = 'number'
                                className = {'border-b-3 bg-transparent w-20 border-b-2 border-gray-400 text-center outline-none'}
                                defaultValue={amount/5}
                                onChange={(e)=>{
                                    let value = parseInt(e.target.value)
                                    setAmount(value*5);
                                    selectRef.current.value = "Standard";
                                }}></input>
                        </div>
                        <div className = {'flex items-center'}>
                            <img src = "./token.svg" className = {'size-4'} ></img> X 1
                            <span>= 5 rupees</span>
                        </div>
                    </div>
                    <div className = {'flex flex-col items-center h-[40%] justify-around'}>
                        <span className = {'text-2xl '}>₹{amount}</span>
                        <span className = {'text-lg flex items-center'}><img src = "token.svg" className ={'size-6'}></img>{amount == 1999 ? 500:amount/5}</span>
                        <Button style = "Primary" text = "Pay Now" onclick={()=>displayRazorpay()}></Button>
                        <div className = "flex flex-col items-center">
                            <h1 className ="text-xs">powered by</h1>
                            <img src = "razorpay-icon.svg" className = "size-20 h-10"></img>
                        </div>
                    </div>
                </div>
                <div className = {'col-span-2 bg-white flex flex-col items-center rounded-r-xl'}>
                    <div className = {'h-[50%] flex flex-col justify-around items-center border-b-2 w-full'}>
                        <span className ={'text-2xl font-extrabold text-center'}>Most trending</span>
                        <span className = {'flex items-center'}><img src = "token.svg" className = {'size-4'}></img> X 1 = ₹4</span>
                        <span className = {'flex items-center'}><img src = "token.svg" className = {'size-4'}></img> X 500 = ₹1999</span>
                        <Button style = "Primary" text = "Purchase package" onclick= {async ()=>{setAmount(1999);}}></Button>
                    </div>
                    <div className = {'h-[50%] p-3 flex flex-col items-start justify-center'}>
                        <span className = {'text-3xl'}></span>
                        <span className = {'text-sm'}><span className ={'text-lg font-bold flex items-center'}><CreditCardIcon/>Buy Instantly</span>  Securely purchase tokens and add them to your wallet.</span>
                        <span className = {'text-sm'}><span className ={'text-lg font-bold flex items-center'}><ExchangeIcon/> Trade & Learn</span>  Use tokens to request lessons or trade skills.</span>
                        <span className = {'text-sm'}><span className ={'text-lg font-bold flex items-center'}><MoneyIcon/> Earn & Redeem</span>  Offer skills, earn tokens, and cash out when eligible.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
