import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'flowbite-react';

const ApisTab = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApis = async () => {
      try {
        const response = await axios.get('/general/apis');
        setApis(response.data);
      } catch (error) {
        console.error('Failed to fetch API data:', error);
      } finally {
        setLoading(false);
      }
    };

    getApis();
  }, []);

  return (
    <div>
      <Table hoverable className="bg-transparent">
        <Table.Head className="bg-transparent text-gray-600 text-sm">
          <Table.HeadCell>S/N</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Plan</Table.HeadCell>
          <Table.HeadCell>Billing</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Expires On</Table.HeadCell>
          <Table.HeadCell>Days Left</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="text-center py-4">
                Loading APIs...
              </Table.Cell>
            </Table.Row>
          ) : apis.length > 0 ? (
            apis.map((api, index) => (
              <Table.Row key={index} className="text-sm">
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{api.name}</Table.Cell>
                <Table.Cell>{api.premium_plan.plan}</Table.Cell>
                <Table.Cell>{api.premium_plan.billing_cycle}</Table.Cell>
                <Table.Cell>${api.premium_plan.price_usd}</Table.Cell>
                <Table.Cell>{api.expires_on}</Table.Cell>
                <Table.Cell>{api.days_remaining} days</Table.Cell>
                <Table.Cell>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs ${
                      api.state === 'Running' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {api.state}
                  </span>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={8} className="text-center py-4">
                No APIs found.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ApisTab;
