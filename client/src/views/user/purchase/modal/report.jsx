import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { report } from "../../../../components/backendApis/purchase/collectOrder";

const Report = ({ defendantId, orderId, onClose }) => {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        defendant_id: defendantId,
        target_id: orderId,
        message,
      };
 
      const response = await report(payload);

      if (response.success) {
        toast.success(response.message || "Report submitted successfully!");

        setTimeout(() => {
          setMessage("");
          onClose();
        }, 1000);
      } else {
        toast.error(response.message || "Failed to submit report. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal show={true} onClose={onClose}>
        <Modal.Header className="bg-primary-50 px-4 pt-4 border-b border-secondary/20">
          <span className="text-lg font-medium text-secondary">Report a Problem</span>
        </Modal.Header>

        <Modal.Body className="bg-primary-50">
          <div className="space-y-3">
            <p className="text-sm text-secondary/50">
              You're reporting <strong>Order No: {orderId}</strong>
            </p>
            <textarea
              rows="4"
              className="w-full p-3 bg-primary-50 text-secondary placeholder:text-secondary/50 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-primary-50 border-t border-secondary/20">
          <div className="flex justify-end gap-3 w-full">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary-600 text-white border-0 py-1 hover:bg-primary-700"
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </Button>
            <Button
              size="sm"
              onClick={onClose}
              className="text-gray-900 bg-gray-300 border-0 py-1 hover:bg-gray-400"
            >
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000}/>
    </>
  );
};

export default Report;
