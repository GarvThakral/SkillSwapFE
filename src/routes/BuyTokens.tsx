import { useState } from "react";
import { Button } from "../components/buttons";

export function BuyTokens() {
    const [amount, setAmount] = useState("");

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
        <div className="min-h-screen flex justify-center items-center flex-col">
            <span>How many tokens do you want to buy?</span>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="border p-2 m-2"
            />
            <Button text="Purchase" style="Secondary" onclick={displayRazorpay} />
        </div>
    );
}
