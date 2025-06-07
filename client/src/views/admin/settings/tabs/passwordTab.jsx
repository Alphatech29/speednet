import React from 'react';

const PasswordTab = () => {
  return (
    <div>
      <div>
        <div className="flex max-w-md flex-col gap-4 text-gray-700">
          <div>
            <label htmlFor="oldPassword" className="mb-2 block text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              id="oldPassword"
              type="password"
              placeholder="Enter old password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="mb-2 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>
          <button className='bg-primary-600 text-[15px] py-2 px-4 justify-center items-center w-full rounded-md text-white font-medium'>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordTab;
