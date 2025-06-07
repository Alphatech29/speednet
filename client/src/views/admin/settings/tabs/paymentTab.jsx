import React from 'react';

const PaymentTab = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col fapshi-payment">
        <div>
          <h1 className="text-[20px] font-semibold">Fapshi's Payment APIs</h1>
          <p className="text-[16px]">
            Fapshi’s Payment APIs enable secure transactions using your public and secret keys for seamless integration,
            authorization, and real-time payments.
          </p>
        </div>
        <div className="flex max-w-md flex-col gap-4 text-gray-700 mt-3">
          <div>
            <label htmlFor="fapshiUrl" className="mb-2 block text-sm font-medium text-gray-700">
              Fapshi URL
            </label>
            <input
              id="fapshiUrl"
              type="text"
              placeholder="Enter Fapshi API URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>
          <div>
            <label htmlFor="fapshiUser" className="mb-2 block text-sm font-medium text-gray-700">
              Fapshi User
            </label>
            <input
              id="fapshiUser"
              type="text"
              placeholder="Enter Fapshi username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>
          <div>
            <label htmlFor="fapshiKey" className="mb-2 block text-sm font-medium text-gray-700">
              Fapshi Key
            </label>
            <input
              id="fapshiKey"
              type="password"
              placeholder="Enter Fapshi secret key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>
          <button className="bg-primary-600 text-[15px] py-2 px-4 justify-center items-center w-full rounded-md text-white font-medium">
            Update
          </button>
        </div>
      </div>

      <div className="flex flex-col crypto-payment">
  <div>
    <h1 className="text-[20px] font-semibold">Crypomus Payment APIs</h1>
    <p className="text-[16px]">
      Crypomus Payment APIs enable secure crypto transactions using your public and secret keys for seamless integration,
      authorization, and real-time payments.
    </p>
  </div>
  <div className="flex max-w-md flex-col gap-4 text-gray-700 mt-3">
    <div>
      <label htmlFor="crypomusUrl" className="mb-2 block text-sm font-medium text-gray-700">
        Crypomus URL
      </label>
      <input
        id="crypomusUrl"
        type="text"
        placeholder="Enter Crypomus API URL"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
      />
    </div>
    <div>
      <label htmlFor="crypomusMerchantUuid" className="mb-2 block text-sm font-medium text-gray-700">
        Crypomus Merchant UUID
      </label>
      <input
        id="crypomusMerchantUuid"
        type="text"
        placeholder="Enter Crypomus merchant UUID"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
      />
    </div>
    <div>
      <label htmlFor="crypomusKey" className="mb-2 block text-sm font-medium text-gray-700">
        Crypomus Key
      </label>
      <input
        id="crypomusKey"
        type="password"
        placeholder="Enter Crypomus secret key"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
      />
    </div>
    <button className="bg-primary-600 text-[15px] py-2 px-4 justify-center items-center w-full rounded-md text-white font-medium">
      Update
    </button>
  </div>
</div>

    </div>
  );
};

export default PaymentTab;
