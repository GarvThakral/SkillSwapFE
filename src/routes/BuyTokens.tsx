import React, { useRef, useState } from "react";

export function BuyTokens() {
  const [amount, setAmount] = useState(250);
  const selectRef = useRef<HTMLSelectElement>(null);
  const tokenRef = useRef<HTMLInputElement>(null);

  function loadScript(src: string): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay failed to load!");
      return;
    }

    // create order on backend
    const createRes = await fetch("http://localhost:3000/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await createRes.json();
    if (!data?.id) {
      alert("Failed to create order");
      return;
    }

    const options = {
      key: "rzp_test_ru5HdNikLfjmlt",
      amount: data.amount,
      currency: "INR",
      name: "SkillSwap",
      description: "Token Purchase",
      image: "https://example.com/logo.png",
      order_id: data.id,
      handler: async (response: any) => {
        // verify payment
        const userId = localStorage.getItem("userId");
        const verifyRes = await fetch("http://localhost:3000/payment/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert("Payment Successful!");
          // TODO: update user's token balance
        } else {
          alert("Payment Verification Failed!");
        }
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: { color: "#6d28d9" },
    };
    // @ts-ignore
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center items-center p-4 font-['DM_sans']">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-4 grid-cols-1">
          {/* Left Panel */}
          <div className="md:col-span-2 p-8 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex flex-col h-full">
              <div className="flex-1 border-b border-gray-200 pb-8 mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Purchase Tokens
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-lg font-semibold text-gray-700">Select a package</label>
                    <select
                      ref={selectRef}
                      className="w-full p-3 bg-white border-2 border-purple-200 rounded-lg text-center focus:ring-2 focus:ring-purple-500 transition-all"
                      onChange={() => {
                        if (!selectRef.current || !tokenRef.current) return;
                        const v = selectRef.current.value;
                        if (v === "") {
                          const custom = parseInt(tokenRef.current.value) || 0;
                          setAmount(custom * 5);
                        } else if (v === "Standard") {
                          setAmount(1000);
                          tokenRef.current.value = "200";
                        } else if (v === "Enthusiast") {
                          setAmount(2000);
                          tokenRef.current.value = "400";
                        } else if (v === "Learner") {
                          setAmount(3000);
                          tokenRef.current.value = "600";
                        } else {
                          setAmount(4000);
                          tokenRef.current.value = "800";
                        }
                      }}
                    >
                      <option value="">Select a package</option>
                      <option value="Standard">Standard (200 tokens)</option>
                      <option value="Enthusiast">Enthusiast (400 tokens)</option>
                      <option value="Learner">Learner (600 tokens)</option>
                      <option value="TheAlmighty">The Almighty (800 tokens)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-lg font-semibold text-gray-700">
                      Or customize your amount
                    </label>
                    <div className="relative">
                      <input
                        ref={tokenRef}
                        type="number"
                        defaultValue={amount / 5}
                        className="w-full p-3 bg-white border-2 border-purple-200 rounded-lg text-center focus:ring-2 focus:ring-purple-500 transition-all"
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setAmount(val * 5);
                          if (selectRef.current) selectRef.current.value = "";
                        }}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-100 px-2 py-1 rounded text-purple-700 font-semibold">
                        tokens
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
                    <img src="/token.svg" className="w-6 h-6 mr-2" alt="Token" />
                    <span className="text-blue-800">1 token = ₹5</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-gray-800">₹{amount}</div>
                <div className="flex items-center justify-center text-lg">
                  <img src="/token.svg" className="w-6 h-6 mr-2" alt="Token" />
                  <span className="font-semibold">
                    {amount === 1999 ? 500 : amount / 5} tokens
                  </span>
                </div>

                <Button
                  onClick={displayRazorpay}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                >
                  Pay Now
                </Button>

                <div className="flex flex-col items-center mt-4">
                  <p className="text-xs text-gray-500">powered by</p>
                  <img src="/razorpay-icon.svg" className="h-8 mt-1" alt="Razorpay" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="md:col-span-2 bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8">
            <div className="h-full flex flex-col">
              <div className="flex-1 border-b border-white/20 pb-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">Most Popular</h2>

                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <SparklesIcon />
                      <h3 className="text-xl font-bold">Premium Package</h3>
                    </div>
                    <div className="bg-yellow-300 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                      BEST VALUE
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-xl">
                      <img src="/token.svg" className="w-6 h-6 mr-2" alt="Token" />
                      <span className="font-bold">500 tokens</span>
                      <span className="mx-2">=</span>
                      <span className="font-bold">₹1999</span>
                      <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded">
                        SAVE ₹501
                      </span>
                    </div>

                    <Button
                      onClick={() => {
                        setAmount(1999);
                        if (tokenRef.current) tokenRef.current.value = "500";
                        if (selectRef.current) selectRef.current.value = "";
                      }}
                      className="w-full bg-white text-purple-700 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
                    >
                      Purchase Package
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Why Buy Tokens?</h3>
                <Feature
                  icon={<CreditCardIcon />}
                  title="Buy Instantly"
                  description="Securely purchase tokens and add them to your wallet."
                />
                <Feature
                  icon={<ExchangeIcon />}
                  title="Trade & Learn"
                  description="Use tokens to request lessons or trade skills."
                />
                <Feature
                  icon={<MoneyIcon />}
                  title="Earn & Redeem"
                  description="Offer skills, earn tokens, and cash out when eligible."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Sub-components in the same file
─────────────────────────────────────────────────────────────────────────────*/

function Button({
  children,
  className,
  onClick,
}: React.PropsWithChildren<{ className?: string; onClick?: () => void }>) {
  return (
    <button onClick={onClick} className={`inline-block font-medium ${className}`}>
      {children}
    </button>
  );
}

function CreditCardIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" strokeWidth="2" />
      <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
      <circle cx="6" cy="15" r="1" fill="currentColor" />
      <circle cx="10" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

function ExchangeIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M4 4v6h6M20 20v-6h-6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline points="4 10 20 10 20 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="20 14 4 14 4 20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path d="M12 8v1M12 15v1M15 12h1M8 12H7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-6 h-6 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l.518 1.586a1 1 0 00.95.69h1.63c.969 0 1.371 1.24.588 1.81l-1.318.96a1 1 0 00-.364 1.118l.518 1.586c.3.921-.755 1.688-1.54 1.118l-1.318-.96a1 1 0 00-1.176 0l-1.318.96c-.784.57-1.838-.197-1.54-1.118l.518-1.586a1 1 0 00-.364-1.118l-1.318-.96c-.783-.57-.38-1.81.588-1.81h1.63a1 1 0 00.95-.69l.518-1.586z" />
    </svg>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start">
      <div className="bg-white/10 p-2 rounded-full mr-4">{icon}</div>
      <div>
        <h4 className="font-bold text-lg">{title}</h4>
        <p className="text-white/80">{description}</p>
      </div>
    </div>
  );
}
