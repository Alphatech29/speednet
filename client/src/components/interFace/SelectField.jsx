import React, { useState, useEffect } from 'react';

const SelectField = ({ 
  label = 'Select', 
  options = [], 
  value = null, 
  onChange = () => {}, 
  error = null, 
  disabled = false, 
  loading = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  // Sync internal value with external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleSelect = (option) => {
    try {
      if (typeof onChange !== 'function') {
        console.error('onChange is not a function:', onChange);
      } else {
        onChange(option);
      }
      setInternalValue(option);
      setIsOpen(false);
    } catch (err) {
      console.error('Error in handleSelect:', err);
    }
  };
  

  const handleToggle = () => {
    if (!disabled && !loading) {
      setIsOpen(prev => !prev);
    }
  };

  return (
    <div className="relative mb-4">
      <label className="block text-sm font-medium mb-1 text-gray-200">
        {label}
      </label>

      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || loading}
        className={`
          mt-1 w-full bg-gray-700 border rounded-md shadow-sm py-2 px-3 
          text-left flex items-center justify-between text-gray-200
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-600'}
          ${error ? 'border-red-500' : 'border-gray-600'}
        `}
      >
        <div className="flex items-center gap-2">
          {internalValue?.image_path && (
            <img 
              src={internalValue.image_path} 
              alt={internalValue?.name || ''}
              className="h-5 w-5 rounded-full"
              onError={(e) => (e.target.style.display = 'none')}
            />
          )}
          <span className="truncate">
            {loading ? 'Loading...' : (internalValue?.name || 'Select an option')}
          </span>
        </div>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && !disabled && !loading && (
        <ul className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.id}
              onClick={() => handleSelect(option)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-600 cursor-pointer text-gray-200"
            >
              {option.image_path && (
                <img 
                  src={option.image_path} 
                  alt={option.name || ''}
                  className="h-5 w-5 rounded-full"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              <span className="truncate">{option.name}</span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {loading && !error && <p className="mt-1 text-xs text-gray-400">Loading options...</p>}
    </div>
  );
};

export default SelectField;