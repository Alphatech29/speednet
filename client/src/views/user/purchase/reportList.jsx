import React, { useContext, useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { getReports } from "../../../components/backendApis/purchase/collectOrder";
import { AuthContext } from "../../../components/control/authContext";
import { formatDateTime } from "../../../components/utils/formatTimeDate";
import { FaFile } from "react-icons/fa";

const ReportList = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserReports = async () => {
      try {
        const res = await getReports();
        if (res.success) {
          setReports(res.data || []);
        } else {
          console.error("Fetch failed:", res.message);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-medium text-gray-300 mb-3">My Reports</h2>

      <div className="bg-gray-800 rounded-md">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-400">
            <FaFile className="text-4xl mb-2" />
            <p>No reports found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable className="bg-transparent text-xs tab:text-sm pc:text-base">
              <Table.Head className="bg-gray-700 text-white bg-transparent">
                <Table.HeadCell>S/N</Table.HeadCell>
                <Table.HeadCell>Order Id</Table.HeadCell>
                <Table.HeadCell>Complain</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-gray-600">
                {reports.map((report, index) => (
                  <Table.Row key={report.id} className=" text-gray-300">
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{report.target_id}</Table.Cell>
                    <Table.Cell className="max-w-[200px] truncate" title={report.message}>
                      {report.message}
                    </Table.Cell>

                    <Table.Cell>
                      <span
                        className={`capitalize px-2 py-1 rounded-full text-xs font-medium
      ${report.status === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : report.status === "reviewed"
                              ? "bg-blue-200 text-blue-800"
                              : report.status === "resolved"
                                ? "bg-green-200 text-green-800"
                                : "bg-gray-300 text-gray-800"
                          }
    `}
                      >
                        {report.status}
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
    </div>
  );
};

export default ReportList;
