import React, { useEffect, useState, useContext } from "react";
import { Table } from "flowbite-react";
import { fetchReferralsByUser } from "../../../../components/backendApis/referral/referral";
import { AuthContext } from "../../../../components/control/authContext";

const Completed = () => {
  const { user } = useContext(AuthContext);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const loadReferrals = async () => {
      const result = await fetchReferralsByUser(user.uid);
      if (result.success) {
        setReferrals(result.data);
      }
      setLoading(false);
    };

    loadReferrals();
  }, [user?.uid]);

  const completedReferrals = referrals.filter(
    (referral) => referral.referral_status === 1
  );

  return (
    <div className="w-full overflow-x-auto mobile:px-2 tab:px-4 pc:px-0">
      {loading ? (
        <p className="text-white text-center text-sm tab:text-base">Loading referrals...</p>
      ) : (
        <Table
          hoverable
          className="bg-transparent min-w-[600px] text-xs tab:text-sm pc:text-base"
        >
          <Table.Head className="bg-transparent text-white text-xs tab:text-sm">
            <Table.HeadCell>S/N</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {completedReferrals.length > 0 ? (
              completedReferrals.map((referral, index) => (
                <Table.Row key={referral.id} className="text-white">
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    <span className="text-gray-200">{referral.email}</span>
                  </Table.Cell>
                  <Table.Cell>
                    ${Number(referral.referral_amount).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="px-2 py-1 rounded-full text-white text-[10px] tab:text-xs bg-green-500">
                      Completed
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={4} className="py-24 text-gray-500 text-center">
                  No completed referrals found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default Completed;
