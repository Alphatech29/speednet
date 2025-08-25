import React, { useContext, useState } from 'react';
import { TextInput, Button } from 'flowbite-react';
import { AuthContext } from '../../../../components/control/authContext';
import { createNordPurchase } from "../../../../components/backendApis/nordVpn/nordVpn";
import Swal from 'sweetalert2';

const Purchase = ({ plan, onClose }) => {
  const { webSettings } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');

  const planPrice = parseFloat(plan?.amount) || 0;
  const vatPercentage = parseFloat(webSettings?.vat) || 0;
  const currency = webSettings?.currency || '$';

  const vatAmount = (vatPercentage / 100) * planPrice;
  const total = planPrice + vatAmount;

  const handleProceed = async () => {
    if (!email || !email.includes('@')) {
      return Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
    }

    if (!fullName || !country || !zipCode) {
      return Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
      });
    }

    const payload = {
      email,
      full_name: fullName,
      country,
      zip_code: zipCode,
      plan: {
        id: plan?.id,
        package_name: plan?.package_name,
        amount: planPrice,
        duration: plan?.duration
      },
      total: total,
    };

    try {
      const response = await createNordPurchase(payload);

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Purchase Successful',
          text: response.message,
        });
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Purchase Failed',
          text: response.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <div>
      {/* Full Name Input */}
      <TextInput
        className="rounded-md text-gray-300 py-3 "
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

       {/* Email Input */}
      <TextInput
        className="rounded-md text-gray-300 py-3"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Country Input */}
      <TextInput
        className="rounded-md text-gray-300 py-3"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      {/* Zip Code Input */}
      <TextInput
        className="rounded-md text-gray-300 py-3"
        placeholder="Zip Code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
      />

     
      <p className="text-gray-300 pc:text-base mobile:text-[13px] mt-3">
        <strong>Note:</strong> This information you provide will be used to set up your Nord account and grant access to your VPN services.
      </p>

      {/* Order Summary */}
      <div className="text-gray-300 pc:text-sm mobile:text-xs mt-4">
        <h1 className="font-semibold pc:text-xl mobile:text-[15px]">Order summary</h1>
        <p>{plan?.package_name} Plan</p>
        <p>Amount: {currency}{planPrice.toFixed(2)}</p>
        <p>VAT ({vatPercentage}%): {currency}{vatAmount.toFixed(2)}</p>
        <p className="font-semibold">Total: {currency}{total.toFixed(2)}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-end w-full gap-4">
        <Button onClick={onClose} className="mt-4 bg-red-500 text-white border-0 rounded">
          Close
        </Button>
        <Button onClick={handleProceed} className="mt-4 bg-primary-600 text-white border-0 rounded">
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default Purchase;
