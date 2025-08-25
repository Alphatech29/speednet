import React, { useEffect, useState } from "react";
import { Table, Modal, Button } from "flowbite-react";
import { getAllReports, updateReportById } from "../../../components/backendApis/admin/apis/report";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { FaFile } from "react-icons/fa";

const statusColor = {
  pending: "text-yellow-500 bg-yellow-100 px-2 py-1 rounded-full text-xs",
  reviewed: "text-blue-500 bg-blue-100 px-2 py-1 rounded-full text-xs",
  resolved: "text-green-500 bg-green-100 px-2 py-1 rounded-full text-xs",
};

const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await getAllReports();
      if (res.success) {
        setReports(res.data || []);
      } else {
        console.error("Error fetching reports:", res.message);
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleViewMessage = (id, message) => {
    setSelectedReportId(id);
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleUpdateStatus = async (status) => {
  if (!selectedReportId) return;
  try {
    const res = await updateReportById(selectedReportId, status);
    if (res.success) {
      setReports((prev) =>
        prev.map((report) =>
          report.id === selectedReportId ? { ...report, status } : report
        )
      );
      setShowModal(false);
    } else {
      console.error("Failed to update:", res.message);
    }
  } catch (err) {
    console.error("Update error:", err);
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All User Reports</h2>

      <div className="bg-white shadow-md rounded-md">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-700 py-8">
            <FaFile className="text-4xl mb-2" />
            <p>No reports available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable className="bg-transparent text-sm">
              <Table.Head className="bg-gray-100 text-gray-700">
                <Table.HeadCell>S/N</Table.HeadCell>
                <Table.HeadCell>Order No</Table.HeadCell>
                <Table.HeadCell>Reporter</Table.HeadCell>
                <Table.HeadCell>Message</Table.HeadCell>
                <Table.HeadCell>Defendant</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-gray-200">
                {reports.map((report, index) => (
                  <Table.Row key={report.id} className="text-gray-700">
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{report.target_id || "N/A"}</Table.Cell>

                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="font-medium">{report.reporter_name}</span>
                        <span className="text-xs text-gray-500">{report.reporter_email}</span>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <Button
                        onClick={() => handleViewMessage(report.id, report.message)}
                        className="text-blue-600 border-0 bg-transparent hover:text-blue-800 max-w-[180px] truncate text-left"
                        title="Click to view full message"
                      >
                        {report.message}
                      </Button>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="font-medium">{report.defendant_name}</span>
                        <span className="text-xs text-gray-500">{report.defendant_email}</span>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <span className={statusColor[report.status] || "text-gray-500"}>
                        {report.status || "Unknown"}
                      </span>
                    </Table.Cell>

                    <Table.Cell>{formatDateTime(report.created_at)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>

      {/* Modal for viewing full message and updating status */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup>
        <Modal.Header className="p-3">
          <h3 className="text-lg font-semibold text-gray-800">Report Message</h3>
        </Modal.Header>
        <Modal.Body>
          <p className="text-gray-600 whitespace-pre-line">{selectedMessage}</p>
        </Modal.Body>
        <Modal.Footer>
  <div className="w-full flex items-end gap-3 justify-end">
    <Button
      onClick={() => handleUpdateStatus("reviewed")}
      size="sm"
      className="py-1 bg-blue-700 text-white border-0 disabled:opacity-50"
      disabled={
        reports.find((r) => r.id === selectedReportId)?.status !== "pending"
      }
    >
      Mark as Reviewed
    </Button>

    <Button
      onClick={() => handleUpdateStatus("resolved")}
      size="sm"
      className="py-1 bg-green-800 text-white border-0"
    >
      Mark as Resolved
    </Button>

    <Button
      onClick={() => setShowModal(false)}
      size="sm"
      className="py-1 bg-gray-400 text-gray-800 border-0"
    >
      Close
    </Button>
  </div>
</Modal.Footer>

      </Modal>
    </div>
  );
};

export default Report;
