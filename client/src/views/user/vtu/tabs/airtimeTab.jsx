import React, { useContext, useState, useRef, useEffect } from "react";
import { Label, Button, Spinner } from "flowbite-react";
import { AuthContext } from "../../../../components/control/authContext";
import { purchaseAirtime } from "../../../../components/backendApis/vtu/vtuService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NETWORK_PREFIXES = {
  mtn: ["0803", "0806", "0703", "0706", "0810", "0813", "0814", "0816", "0903", "0906", "0913", "0916"],
  glo: ["0805", "0807", "0705", "0811", "0815", "0905"],
  airtel: ["0802", "0808", "0708", "0812", "0902", "0907", "0901", "0912"],
  "9mobile": ["0809", "0817", "0818", "0908", "0909"],
};

const NETWORK_OPTIONS = [
  { name: "MTN", value: "mtn", logo: "/image/mtn.png" },
  { name: "GLO", value: "glo", logo: "/image/Globacom.jpg" },
  { name: "Airtel", value: "airtel", logo: "/image/airtel.jpeg" },
  { name: "9Mobile", value: "9mobile", logo: "/image/9Mobile.jpg" },
];

const detectNetwork = (number) => {
  const prefix = number?.substring(0, 4);
  for (let [network, prefixes] of Object.entries(NETWORK_PREFIXES)) {
    if (prefixes.includes(prefix)) {
      return NETWORK_OPTIONS.find((n) => n.value === network);
    }
  }
  return null;
};

const PinTab = () => {
  const { user, webSettings } = useContext(AuthContext);
  const [network, setNetwork] = useState(NETWORK_OPTIONS[0]);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const dropdownRef = useRef(null);
  const firstPinRef = useRef(null);

  const successAudio = new Audio("/success.mp3");

  const dollarBalance = parseFloat(user?.account_balance || 0);
  const nairaRate = parseFloat(webSettings?.naira_rate || 0);
  const nairaBalance = (dollarBalance * nairaRate).toFixed(2);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (phone.length >= 4) {
      const detected = detectNetwork(phone);
      if (detected && detected.value !== network.value) {
        setNetwork(detected);
      }
    }
  }, [phone]);

  useEffect(() => {
    if (showPinModal) {
      setPin("");
      setTimeout(() => {
        firstPinRef.current?.focus();
      }, 100);
    }
  }, [showPinModal]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^\d{11}$/.test(phone)) {
      toast.error("Phone number must be exactly 11 digits.");
      return;
    }

    if (Number(amount) < 100) {
      toast.error("Minimum amount is ₦100");
      return;
    }

    setShowPinModal(true);
  };

  const handleConfirmPurchase = async () => {
    setShowPinModal(false);
    setLoading(true);

    const res = await purchaseAirtime({
      phone,
      amount: Number(amount),
      type: network.value,
      pin,
    });

    setLoading(false);
    setPin("");

    if (res.success) {
      successAudio.play();
      toast.success(res.message || "Airtime purchase successful!");
      setPhone("");
      setAmount("");
    } else {
      toast.error(res.message || "Airtime purchase failed.");
    }
  };

  return (
    <>
      {/* Full screen loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Spinner size="xl" aria-label="Loading..." />
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 space-y-4 border p-6 rounded-lg shadow-lg relative">
        <ToastContainer />

        {/* User Info */}
        <div className="bg-primary-600 text-white p-4 rounded-lg flex space-x-3 items-start">
          <img src={user?.avatar} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <h2 className="text-lg font-semibold">{user?.full_name}</h2>
            <p className="text-sm text-gray-200 font-medium">₦{Number(nairaBalance).toLocaleString()}</p>
          </div>
        </div>

        {/* Phone Input */}
        <div>
          <Label htmlFor="phone" value="Phone Number" className="text-secondary"/>
          <div className="flex items-center mt-2 relative" ref={dropdownRef}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="cursor-pointer bg-primary-50 border border-primary-600 px-2 py-[2px] rounded-l-md flex items-center justify-center"
            >
              <img src={network.logo} alt={network.name} className="w-8 h-8 rounded-full object-contain" />
            </div>

            {showDropdown && (
              <div className="absolute z-10 bg-primary-50 border border-primary-600 rounded-md left-0 mt-12 flex gap-2 p-2">
                {NETWORK_OPTIONS.map((option) => (
                  <img
                    key={option.value}
                    src={option.logo}
                    alt={option.name}
                    className="w-8 h-8 rounded-full cursor-pointer hover:scale-105 transition"
                    onClick={() => {
                      setNetwork(option);
                      setShowDropdown(false);
                    }}
                  />
                ))}
              </div>
            )}

            <input
              id="phone"
              name="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912******"
              className="w-full bg-transparent border-t border-b border-r border-primary-600 text-sm px-3 py-2 rounded-r-md placeholder:text-secondary"
            />
          </div>
        </div>

        {/* Amount Input */}
        <div >
          <Label htmlFor="amount" value="Amount" className="text-secondary"/>
          <input
            id="amount"
            name="amount"
            type="number"
            placeholder="₦100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent border border-primary-600 text-sm px-3 py-2 rounded-md placeholder:text-secondary"
          />
        </div>

        {/* Quick Top-up */}
        <div>
          <Label value="Quick Top-Up" className="text-secondary" />
          <div className="flex flex-wrap gap-2 mt-2">
            {[100, 200, 500, 1000, 2000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt)}
                className="rounded-md px-4 py-2 border border-primary-600 bg-primary-50 text-sm"
              >
                ₦{amt.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmount(5000)}
              className="rounded-md px-4 py-2 border border-primary-600 bg-primary-50 text-sm pc:hidden"
            >
              ₦5,000
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full bg-primary-600 text-white border-0">
          {loading ? "Processing..." : "Buy Airtime"}
        </Button>

        {/* PIN Modal */}
        {showPinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-primary-50 p-6 rounded-md shadow-lg w-full max-w-sm">
              <h2 className="text-secondary text-center text-lg font-bold mb-4">Enter Transaction PIN</h2>
              <div className="flex justify-center gap-3 mb-4">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    id={`pin-${i}`}
                    type="password"
                    maxLength={1}
                    value={pin[i] || ""}
                    ref={i === 0 ? firstPinRef : null}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d?$/.test(val)) {
                        const newPin = pin.split("");
                        newPin[i] = val;
                        setPin(newPin.join(""));
                        const next = document.getElementById(`pin-${i + 1}`);
                        if (val && next) next.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !pin[i] && i > 0) {
                        const prev = document.getElementById(`pin-${i - 1}`);
                        if (prev) prev.focus();
                      }
                    }}
                    className="w-12 h-12 text-center text-xl bg-primary-50 border border-primary-600 rounded-md text-secondary"
                  />
                ))}
              </div>
              <div className="flex justify-between">
                <Button onClick={() => setShowPinModal(false)} className="bg-gray-600 text-white border-0">
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmPurchase}
                  className={`bg-primary-600 text-white border-0 ${
                    pin.length !== 4 || !/^\d{4}$/.test(pin) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={pin.length !== 4 || !/^\d{4}$/.test(pin)}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default PinTab;
