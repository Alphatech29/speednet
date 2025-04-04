import React, { useState } from 'react';
import { FileInput, Label } from "flowbite-react";
import { IoCloudUploadOutline } from "react-icons/io5";

const AddNewProduct = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    platform: '',
    title: '',
    email: '',
    recoveryEmail: '',
    username: '',
    password: '',
    price: '',
    description: '',
    subscriptionStatus: '',
    two_factor_enabled: false,
    two_factor_description: '',
    expiry_date: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleToggle2FA = (e) => {
    setFormData((prev) => ({
      ...prev,
      two_factor_enabled: e.target.checked
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    console.log('Submitted Data:', formData);
    alert('Product Added!');
  };

  return (
    <div className='text-gray-200 flex flex-col'>
      <h1 className='text-lg font-semibold'>Add New Product</h1>
      <p>
        Easily add new products to your store! Fill in the details, set the price, upload images,
        and manage availability.
      </p>

      <div className='mt-3 rounded-md px-3 py-2 bg-gray-800'>
        {step === 1 && (
          <div className='flex w-full flex-col gap-4'>
            <div className='w-full'>
              <label htmlFor="platform" className='block text-sm font-medium'>Platform</label>
              <input
                id="platform"
                type="text"
                value={formData.platform}
                onChange={handleChange}
                placeholder="e.g. Facebook, Instagram, etc."
                className='w-full bg-transparent border-0 shadow-md rounded-md p-2 placeholder:text-gray-600 placeholder:text-sm'
              />
            </div>

            <div className='w-full'>
              <label htmlFor="title" className='block text-sm font-medium'>Account Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. 1 year old Facebook Account"
                className='w-full bg-transparent border-0 shadow-md rounded-md p-2 placeholder:text-gray-600 placeholder:text-sm'
              />
            </div>

            <div className='flex gap-5 w-full'>
              <div className='w-full'>
                <label htmlFor="email" className='block text-sm font-medium'>Account Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email to the account"
                  className='w-full bg-transparent border-0 shadow-md rounded-md p-2 placeholder:text-gray-600 placeholder:text-sm'
                />
              </div>

              <div className='w-full'>
                <label htmlFor="username" className='block text-sm font-medium'>Account Username</label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username to the account"
                  className='w-full bg-transparent border-0 shadow-md rounded-md p-2 placeholder:text-gray-600 placeholder:text-sm'
                />
              </div>
            </div>

            <div className='flex gap-5 w-full'>
              <div className='w-full'>
                <label htmlFor="password" className='block text-sm font-medium'>Account Password</label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password to the account"
                  className='w-full bg-transparent border-0 shadow-md rounded-md p-2 placeholder:text-gray-600 placeholder:text-sm'
                />
              </div>

              <div className='w-full'>
                <label htmlFor="price" className='block text-sm font-medium'>Account Price</label>
                <input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. $10"
                  className='w-full bg-transparent border-0 shadow-md rounded-md p-2 placeholder:text-gray-600 placeholder:text-sm'
                />
              </div>
            </div>

            <div className='w-full'>
              <label htmlFor="description" className='block text-sm font-medium'>Account Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the account"
                rows="10" // Set the rows to 40
                className='w-full bg-transparent border-0 shadow-md rounded-md p-2 placeholder:text-gray-600 placeholder:text-sm'
              />
            </div>

            <div className='flex justify-end'>
              <button onClick={nextStep} className='mt-4 px-4 py-2 bg-gray-900 text-white rounded-md'>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className='flex flex-col gap-4'>
            <div className='flex gap-5'>
              <div className='w-full'>
                <label htmlFor="recoveryEmail" className='block text-sm font-medium'>Recovery Email</label>
                <input
                  id="recoveryEmail"
                  type="email"
                  value={formData.recoveryEmail}
                  onChange={handleChange}
                  placeholder="Recovery email"
                  className='w-full bg-transparent border-0 shadow-md rounded-md p-2 placeholder:text-gray-600 placeholder:text-sm'
                />
              </div>

              <div className='w-full'>
                <label htmlFor='subscriptionStatus' className='block text-sm font-medium'>Subscription Status</label>
                <select
                  id='subscriptionStatus'
                  value={formData.subscriptionStatus}
                  onChange={handleChange}
                  className='w-full bg-transparent border-0 shadow-md rounded-md p-2 text-gray-200'
                >
                  <option value='' disabled>Select status</option>
                  <option value='active'>Active</option>
                  <option value='expired'>Expired</option>
                  <option value='none'>None</option>
                </select>
              </div>

              {formData.subscriptionStatus === 'active' && (
                <div className='w-full'>
                  <label htmlFor="expiry_date" className='block text-sm font-medium'>Expiry Date</label>
                  <input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={handleChange}
                    className='w-full bg-transparent border-0 shadow-md rounded-md p-2 placeholder:text-gray-600 placeholder:text-sm'
                  />
                </div>
              )}
            </div>

            {/* Custom Toggle Switch */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">2FA Enabled</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.two_factor_enabled}
                  onChange={handleToggle2FA}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 transition-all">
                  <div className="absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-300 ease-in-out peer-checked:translate-x-full rtl:peer-checked:-translate-x-full dark:border-gray-600"></div>
                </div>
              </label>
            </div>

            {formData.two_factor_enabled && (
              <div className='w-full'>
                <label htmlFor="two_factor_description" className='block text-sm font-medium'>2FA Description</label>
                <textarea
                  id="two_factor_description"
                  value={formData.two_factor_description}
                  onChange={handleChange}
                  placeholder="Explain how 2FA works on this account"
                  rows="10" // Set the rows to 40
                  className='w-full bg-transparent border-0 shadow-md rounded-md p-2 placeholder:text-gray-600 placeholder:text-sm'
                />
              </div>
            )}

            <div className="flex w-full items-center justify-center mt-4">
              <Label htmlFor="dropzone-file" className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-700 ">
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <IoCloudUploadOutline className="text-4xl" />
                  <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs">Upload the Logo of the platform</p>
                </div>
                <FileInput id="dropzone-file" className="hidden" onChange={() => {}} accept="image/*" />
              </Label>
            </div>

            <div className='flex justify-end gap-2 mt-4'>
              <button onClick={prevStep} className='px-4 py-2 bg-gray-900 text-white rounded-md'>Back</button>
              <button onClick={nextStep} className='px-4 py-2 bg-primary-600 text-white rounded-md'>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className='flex flex-col gap-4'>
            <p className='text-sm'>Ready to submit this product?</p>
            <div className='flex justify-end gap-2 mt-4'>
              <button onClick={prevStep} className='px-4 py-2 bg-gray-900 text-white rounded-md'>Back</button>
              <button type='submit' onClick={handleSubmit} className='px-4 py-2 bg-primary-600 text-white rounded-md'>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewProduct;
