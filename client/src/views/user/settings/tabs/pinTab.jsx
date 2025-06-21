import React, { useState, useContext } from "react";
import { Label, Button } from "flowbite-react";
import { AuthContext } from "../../../../components/control/authContext";
import { setTransactionPin } from "../../../../components/backendApis/pin/transactionPin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PinInput = ({ label, pinValue, setPinValue, prefix }) => (
  <div className="flex flex-col items-center mb-6 w-full">
    <Label htmlFor={prefix} value={label} className="text-white mb-2" />
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
          className="w-12 h-12 text-center text-xl bg-gray-700 border border-gray-500 rounded-md text-white"
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
    if (pin.length !== 4 || confirmPin.length !== 4) {
      toast.error("PIN must be 4 digits.");
      return;
    }

    if (pin !== confirmPin) {
      toast.error("PINs do not match.");
      return;
    }

    const payload = {
      newPin: pin,
      ...(userPinExists && { oldPin }),
    };

    try {
      setLoading(true);
      const response = await setTransactionPin(payload);
      if (response?.success) {
        toast.success(response.message || "PIN updated successfully.");

        // Reset inputs after success
        setPin("");
        setConfirmPin("");
        setOldPin("");
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to update PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {!userPinExists ? (
        // -------- CREATE PIN --------
        <div className="flex flex-col justify-center items-center border border-gray-600 bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <div className="text-center text-white mb-6">
            <h2 className="text-2xl font-bold mb-4">Create Pin</h2>
            <p>Manage your transaction pin settings here.</p>
          </div>
          <div className="p-6 flex flex-col justify-center items-center rounded-lg w-full">
            <PinInput label="Set Pin" pinValue={pin} setPinValue={setPin} prefix="pin" />
            <PinInput label="Confirm Pin" pinValue={confirmPin} setPinValue={setConfirmPin} prefix="confirm-pin" />
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-1/2 mx-auto bg-primary-600 hover:bg-primary-700 border-0"
            >
              {loading ? "Creating..." : "Create Pin"}
            </Button>
          </div>
        </div>
      ) : (
        // -------- CHANGE PIN --------
        <div className="flex flex-col justify-center items-center border border-gray-600 bg-gray-8000 p-6 rounded-lg w-full max-w-md">
          <div className="text-center text-white mb-6">
            <h2 className="text-2xl font-bold mb-4">Change Pin</h2>
            <p>You already have a pin. Enter your old pin to set a new one.</p>
          </div>
          <div className="p-6 flex flex-col justify-center items-center rounded-lg w-full">
            <PinInput label="Old Pin" pinValue={oldPin} setPinValue={setOldPin} prefix="old-pin" />
            <PinInput label="New Pin" pinValue={pin} setPinValue={setPin} prefix="new-pin" />
            <PinInput label="Confirm New Pin" pinValue={confirmPin} setPinValue={setConfirmPin} prefix="confirm-new-pin" />
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-1/2 mx-auto bg-primary-600 hover:bg-primary-700 border-0"
            >
              {loading ? "Changing..." : "Change Pin"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinTab;
