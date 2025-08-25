import React from 'react';

const InputField = ({ id, label, type, value, onChange, placeholder, error }) => {
  return (
    <div className='mb-4'>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border-1 shadow-md rounded-md p-2 py-3 placeholder:text-gray-500 text-gray-300 text-sm"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
