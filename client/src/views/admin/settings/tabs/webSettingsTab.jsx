import React from 'react';

const WebSettingsTab = () => {
  return (
    <div className="flex flex-col web-settings">
      <div>
        <h1 className="text-[20px] font-semibold">Web Settings</h1>
        <p className="text-[16px]">
          Customize your website’s configuration including site details, display preferences, security options, and real-time interaction settings to ensure smooth and secure platform performance.
        </p>
      </div>

      <div className="flex max-w-md flex-col gap-4 text-gray-700 mt-3">
        <div>
          <label htmlFor="siteName" className="mb-2 block text-sm font-medium text-gray-700">
            Site Name
          </label>
          <input
            id="siteName"
            type="text"
            placeholder="Enter your website name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="tagLine" className="mb-2 block text-sm font-medium text-gray-700">
            Tagline
          </label>
          <input
            id="tagLine"
            type="text"
            placeholder="Enter website tagline"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="webDescription" className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            id="webDescription"
            type="text"
            placeholder="Enter site description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="supportEmail" className="mb-2 block text-sm font-medium text-gray-700">
            Support Email
          </label>
          <input
            id="supportEmail"
            type="email"
            placeholder="Enter support email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="vat" className="mb-2 block text-sm font-medium text-gray-700">
            VAT (%)
          </label>
          <input
            id="vat"
            type="number"
            placeholder="Enter VAT percentage"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="merchantActivationFee" className="mb-2 block text-sm font-medium text-gray-700">
            Merchant Activation Fee
          </label>
          <input
            id="merchantActivationFee"
            type="number"
            placeholder="Enter activation fee"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="currency" className="mb-2 block text-sm font-medium text-gray-700">
            Currency
          </label>
          <input
            id="currency"
            type="text"
            placeholder="Enter currency (e.g., $)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="xafRate" className="mb-2 block text-sm font-medium text-gray-700">
            XAF Rate
          </label>
          <input
            id="xafRate"
            type="number"
            placeholder="Enter XAF exchange rate"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
          />
        </div>

         <div>
          <label htmlFor="contactNumber" className="mb-2 block text-sm font-medium text-gray-700">
            Contact Number
          </label>
          <input
            id="contactNumber"
            type="tel"
            placeholder="Enter contact phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            id="address"
            type="text"
            placeholder="Enter company or business address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
          />
        </div>

        <button className="bg-primary-600 text-[15px] py-2 px-4 justify-center items-center w-full rounded-md text-white font-medium">
          Update
        </button>
      </div>
    </div>
  );
};

export default WebSettingsTab;
