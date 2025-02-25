import { useState } from "react";
import { Button } from "../components/buttons";

export function BuyTokens() {
    const [amount, setAmount] = useState(250);
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
            <div className = {`w-[35%] h-[70%] grid grid-cols-4 rounded-lg font-['DM_sans'] border-2 bg-gray-100`}>
                <div className = {'col-span-2  flex flex-col items-center bordeer-r-2'}>
                    <div className = {'flex flex-col items-center justify-around h-[60%] border-b-2 border-gray-400 w-full'}>
                        <div className = {'text-2xl font-extrabold '}>
                            Purchase Tokens
                        </div>
                        <div className = {'flex flex-col items-center'}>
                            <label className = {'text-lg'}>Select a package</label>
                            <select className = {'bg-transparent border-b-2 text-center outline-none border-gray-400'}>
                                <option>
                                    Standard
                                </option>
                                <option>
                                    Enthusiast
                                </option>
                                <option>
                                    Learner
                                </option>
                                <option>
                                    The almighty
                                </option>
                            </select>
                        </div>
                        <div className = {'flex flex-col items-center'}>
                            <label className = {'text-lg'}>
                                Add custom tokens
                            </label>
                            <input type = 'number' className = {'border-b-3 bg-transparent w-20 border-b-2 border-gray-400 text-center outline-none'} defaultValue={amount/5}></input>
                        </div>
                        <div className = {'flex items-center'}>
                            <img src = "./token.svg" className = {'size-4'} ></img> X 1
                            <span>= 5 rupees</span>
                        </div>
                    </div>
                    <div className = {'flex flex-col items-center h-[40%] justify-around'}>
                        <span className = {'text-2xl'}>₹{amount}</span>
                        <span className = {'text-lg flex items-center'}><img src = "token.svg" className ={'size-6'}></img>{amount/5}</span>
                        <Button style = "Primary" text = "Pay Now" onclick={()=>displayRazorpay()}></Button>
                        <div className = "flex flex-col items-center">
                            <h1 className ="text-xs">powered by</h1>
                            <img src = "razorpay-icon.svg" className = "size-20 h-10"></img>
                        </div>
                    </div>
                </div>
                <div className = {'col-span-2 bg-white flex flex-col items-center '}>
                    <div className = {'h-[50%] flex flex-col justify-around items-center border-b-2 w-full'}>
                        <span className ={'text-2xl font-extrabold text-center'}>Most trending</span>
                        <span className = {'flex items-center'}><img src = "token.svg" className = {'size-4'}></img> X 1 = ₹4</span>
                        <span className = {'flex items-center'}><img src = "token.svg" className = {'size-4'}></img> X 500 = ₹2000</span>
                        <Button style = "Primary" text = "Purchase package"></Button>
                    </div>
                    <div className = {'h-60%'}>

                    </div>
                </div>
            </div>
        </div>
    );
}
