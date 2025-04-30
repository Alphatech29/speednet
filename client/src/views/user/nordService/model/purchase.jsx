import React, { useContext, useState } from 'react';
import { TextInput, Button } from 'flowbite-react';
import { AuthContext } from '../../../../components/control/authContext';
import Swal from 'sweetalert2';

const Purchase = ({ plan, onClose }) => {
  const { webSettings } = useContext(AuthContext);

  const [email, setEmail] = useState('');

  const planPrice = parseFloat(plan?.price) || 0;
  const vatPercentage = parseFloat(webSettings?.vat) || 0;
  const currency = webSettings?.currency || '$';

  const vatAmount = (vatPercentage / 100) * planPrice;
  const total = planPrice + vatAmount;

  // Handle proceed action
  const handleProceed = () => {
    if (!email || !email.includes('@')) {
      return Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
    }

    // Proceed logic goes here (e.g. API call, navigation, etc.)
    Swal.fire({
      icon: 'error',
      title: 'Sorry',
      text: 'Your order cannot be processed at this time. API not responding. Check your provider email for debugging.',
    });
  };

  return (
    <div>
      {/* Email Input Section */}
      <div>
        <TextInput
          className="rounded-md text-gray-300 py-5"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-gray-300 text-base mt-4">
          <strong>Note:</strong> The email you provide will be used to set up your Nord account and grant access to your VPN services.
        </p>
      </div>

      {/* Order Summary Section */}
      <div className="text-gray-300 text-sm mt-4">
        <h1 className="font-semibold text-xl">Order summary</h1>
        <p>{plan?.name} Plan</p>
        <p>Amount: {currency}{planPrice.toFixed(2)}</p>
        <p>VAT ({vatPercentage}%): {currency}{vatAmount.toFixed(2)}</p>
        <p className="font-semibold">Total: {currency}{total.toFixed(2)}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-end w-full gap-4">
        <Button onClick={onClose} className="mt-4 bg-red-500 text-white border-0 rounded">Close</Button>
        <Button onClick={handleProceed} className="mt-4 bg-primary-600 text-white border-0 rounded">Proceed</Button>
      </div>
    </div>
  );
};

export default Purchase;
