import { useState, useContext } from "react";
import { AuthContext } from "../../../../components/control/authContext";
import { setTransactionPin } from "../../../../components/backendApis/pin/transactionPin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PinInput = ({ label, pinValue, setPinValue, prefix }) => (
  <div className="flex flex-col items-center gap-3 w-full">
    <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 tracking-wide">{label}</p>
    <div className="flex justify-center gap-3">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          id={`${prefix}-${i}`}
          type="password"
          maxLength={1}
          value={pinValue[i] || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d?$/.test(val)) {
              const newPin = pinValue.split("");
              newPin[i] = val;
              setPinValue(newPin.join(""));
              const next = document.getElementById(`${prefix}-${i + 1}`);
              if (val && next) next.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !pinValue[i] && i > 0) {
              const prev = document.getElementById(`${prefix}-${i - 1}`);
              if (prev) prev.focus();
            }
          }}
          className="w-12 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all"
        />
      ))}
    </div>
  </div>
);

const PinTab = () => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [oldPin, setOldPin] = useState("");
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const userPinExists = !!(user?.pin && user.pin.trim() !== "");

  const handleSubmit = async () => {
    if (pin.length !== 4 || confirmPin.length !== 4) { toast.error("PIN must be 4 digits."); return; }
    if (pin !== confirmPin) { toast.error("PINs do not match."); return; }

    const payload = { newPin: pin, ...(userPinExists && { oldPin }) };
    try {
      setLoading(true);
      const res = await setTransactionPin(payload);
      if (res?.success) {
        toast.success(res.message || "PIN updated successfully.");
        setPin(""); setConfirmPin(""); setOldPin("");
      } else {
        toast.error(res.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="text-center">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
          {userPinExists ? "Change PIN" : "Create PIN"}
        </h3>
        <p className="text-xs text-gray-400 dark:text-slate-500">
          {userPinExists ? "Enter your old PIN to set a new one." : "Set a 4-digit transaction PIN."}
        </p>
      </div>

      {userPinExists && (
        <PinInput label="Old PIN" pinValue={oldPin} setPinValue={setOldPin} prefix="old-pin" />
      )}
      <PinInput label="New PIN" pinValue={pin} setPinValue={setPin} prefix="new-pin" />
      <PinInput label="Confirm New PIN" pinValue={confirmPin} setPinValue={setConfirmPin} prefix="confirm-new-pin" />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-primary-600/25 hover:-translate-y-0.5 transition-all text-sm"
      >
        {loading ? (userPinExists ? "Changing..." : "Creating...") : userPinExists ? "Change PIN" : "Create PIN"}
      </button>
    </div>
  );
};

export default PinTab;
