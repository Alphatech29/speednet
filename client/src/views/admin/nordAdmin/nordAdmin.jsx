import React from 'react';
import { FaUsers, FaMoneyCheckAlt, FaChartLine } from "react-icons/fa";
import { PiChartPieSliceThin } from "react-icons/pi";
import { Label,Table } from "flowbite-react";

import '../cssFile/dashboard.css'; 

const NordAdmin = () => {
  const nordCredentials = {
    publicKey: 'nord-pub-9321-LIVEz7_TyQm',
    secretKey: 'Q7mDxE3BV1aNZKLc94xgRA8yP6UTabHX7sLpJr3kXfvbEeTAyMzdTn9LBc6QWdMP4cyuBFmHTqz7kA9p2NdYr3stR5qLcxJmIKuYgXsaQDoVnLwHEu9FqvBtRwMXU',
    apiKey: 'API_LIVE_928a381db9fdb209d725',
    server: 's82p.nordvpn.com',
    refreshToken: 'RTK_EU_REFRESH_92asd12981asd91as',
    nordUrl: 'https://api.nordvpn.com/reseller-program'
  };
const transactions = [];
  return (
    <div className='flex flex-col gap-3'>
      <div>
        <h1 className='title text-[18px] font-semibold text-zinc-700'>Nord Reseller Admin</h1>
      </div>

      {/* Alert */}
      <div className="bg-yellow-100 w-full text-yellow-800 border-l-4 border-yellow-500 px-4 py-3 rounded-lg text-sm mobile:text-[13px] pc:text-[14px]">
        <span className="font-medium">Notice:</span> All dashboard services and features are securely managed and powered by the Nord Server to ensure optimal performance and reliability.
      </div>

      {/* Stats */}
      <div className='flex gap-5'>
        <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#006666]'>
          <span className='text-zinc-400'>Funds</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>$200</h1>
            <div className='bg-[#006666]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaMoneyCheckAlt className='text-[24px] text-[#006666]' />
            </div>
          </div>
        </div>

        <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#f7a740]'>
          <span className='text-zinc-400'>Total Sales</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>$0</h1>
            <div className='bg-[#f7a740]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaChartLine className='text-[24px] text-[#f7a740]' />
            </div>
          </div>
        </div>

        <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#e65733]'>
          <span className='text-zinc-400'>Commission</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>$0</h1>
            <div className='bg-[#e65733]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <PiChartPieSliceThin className='text-[24px] text-[#e65733]' />
            </div>
          </div>
        </div>

        <div className='bibb flex flex-col bg-white rounded-md px-6 py-4 gap-2 border-b-[0.90px] border-[#979797]'>
          <span className='text-zinc-400'>Total Account</span>
          <div className='flex justify-between items-center'>
            <h1 className='text-zinc-900 font-bold text-[25px]'>0</h1>
            <div className='bg-[#979797]/50 h-[45px] w-[45px] rounded-md flex justify-center items-center'>
              <FaUsers className='text-[24px] text-[#979797]' />
            </div>
          </div>
        </div>
      </div>

      {/* Nord Server Connection (Read-Only) */}
      <div className='w-full bg-white p-6 py-4 rounded-md'>
        <h1 className='title text-[16px] font-semibold text-zinc-700 mb-3'>Nord Server System Connection</h1>
        <div className='grid grid-cols-1 mobile:grid-cols-2 pc:grid-cols-3 gap-6'>

          <div className='flex flex-col'>
            <Label htmlFor="resellerId" value="Reseller Public Key" className="text-gray-800" />
            <input
              type="text"
              id="resellerId"
              value={nordCredentials.publicKey}
              readOnly
              className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className='flex flex-col'>
            <Label htmlFor="resellerKey" value="Reseller Secret Key" className="text-gray-800" />
            <input
              type="text"
              id="resellerKey"
              value={nordCredentials.secretKey}
              readOnly
              className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className='flex flex-col'>
            <Label htmlFor="resellerApi" value="Reseller API Key" className="text-gray-800" />
            <input
              type="text"
              id="resellerApi"
              value={nordCredentials.apiKey}
              readOnly
              className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

           <div className='flex flex-col'>
            <Label htmlFor="resellerApi" value="Refresh Token" className="text-gray-800" />
            <input
              type="text"
              id="resellerApi"
              value={nordCredentials.refreshToken}
              readOnly
              className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className='flex flex-col'>
            <Label htmlFor="resellerApi" value="Nord Server" className="text-gray-800" />
            <input
              type="text"
              id="resellerApi"
              value={nordCredentials.server}
              readOnly
              className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className='flex flex-col'>
            <Label htmlFor="nordUrl" value="Nord Url" className="text-gray-800" />
            <input
              type="text"
              id="nordUrl"
              value={nordCredentials.nordUrl}
              readOnly
              className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

        </div>
      </div>

     {/* Nord Server Plan's (flowbite-react Table) */}
<div className="w-full bg-white p-6 py-4 rounded-md">
  <h1 className="title text-[16px] font-semibold text-zinc-700 mb-3">
    Nord Reseller Plan's Available
  </h1>
  <div className="overflow-x-auto">
    <Table hoverable className="bg-transparent">
      <Table.Head className="bg-transparent text-gray-800 text-sm">
        <Table.HeadCell>Plan</Table.HeadCell>
        <Table.HeadCell>Duration</Table.HeadCell>
        <Table.HeadCell>Account(user's)</Table.HeadCell>
        <Table.HeadCell>Active Account(User's)</Table.HeadCell>
        <Table.HeadCell>Inactive Account(User's)</Table.HeadCell>
        <Table.HeadCell>Sales</Table.HeadCell>
        <Table.HeadCell>Commission</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        <Table.Row  className="text-sm">
          <Table.Cell >
            Professional
          </Table.Cell>
          <Table.Cell>1 Month</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>$0.00</Table.Cell>
          <Table.Cell>$0.00</Table.Cell>
        </Table.Row>
        <Table.Row  className="text-sm">
          <Table.Cell >
            Standard
          </Table.Cell>
          <Table.Cell>1 Month</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>$0.00</Table.Cell>
          <Table.Cell>$0.00</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </div>
</div>

 {/* Nord Reseller Transaction History (flowbite-react Table) */}
<div className="w-full bg-white p-6 py-4 rounded-md">
  <h1 className="title text-[16px] font-semibold text-zinc-700 mb-3">
    Reseller Transaction History
  </h1>
  <div className="overflow-x-auto">
    <Table hoverable className="bg-transparent">
      <Table.Head className="bg-transparent text-gray-800 text-sm">
        <Table.HeadCell>S/N</Table.HeadCell>
        <Table.HeadCell>User Details</Table.HeadCell>
        <Table.HeadCell>Plan</Table.HeadCell>
        <Table.HeadCell>Amount</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Date</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {transactions.length === 0 ? (
          <Table.Row >
            <Table.Cell colSpan={6} className="py-24 text-gray-500 text-center">
              No Transaction History
            </Table.Cell>
          </Table.Row>
        ) : (
          transactions.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{item.user}</Table.Cell>
              <Table.Cell>{item.plan}</Table.Cell>
              <Table.Cell>{item.amount}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>{item.date}</Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  </div>
</div>
    </div>
  );
}

export default NordAdmin;
