import React, { useState, useEffect, useContext } from 'react';
import { createAccount, getAllPlatforms } from "../../../components/backendApis/accounts/accounts";
import InputField from "../../../components/interFace/InputField";
import SelectField2 from "../../../components/interFace/SelectField2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../../../components/control/authContext";

const useAddAccountLogic = (userUid, setCurrentStep) => {
  const [formData, setFormData] = useState({
    platform: '',
    title: '',
    emailORusername: '',
    password: '',
    price: '',
    previewLink: '',
    description: '',
    subscriptionStatus: '',
    two_factor_enabled: false,
    two_factor_description: '',
    expiry_date: '',
    recoveryEmail: '',
    recoveryEmailPassword: '',
    additionalEmail: '',
    additionalPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = validateForm();
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      try {
        const payLoad = {
          ...formData,
          price: parseFloat(formData.price),
          userUid: userUid 
        };
  
        const result = await createAccount(payLoad);
        
        if (result?.success) {
          toast.success(result.message, {
            position: "top-right",
            autoClose: 3000,
          });
          // Reset form after successful submission
          setFormData({
            platform: '',
            title: '',
            emailORusername: '',
            password: '',
            price: '',
            previewLink: '',
            description: '',
            subscriptionStatus: '',
            two_factor_enabled: false,
            two_factor_description: '',
            expiry_date: '',
            recoveryEmail: '',
            recoveryEmailPassword: '',
            additionalEmail: '',
            additionalPassword: ''
          });
          if (setCurrentStep) {
            setCurrentStep(1); // Reset to first step
          }
        } else {
          const errorMessage = result?.message || 
                              result?.error || 
                              'Failed to add account';
          toast.error(errorMessage, {
            position: "top-right",
          });
        }
      } catch (err) {
        console.error("Error creating account:", err);
        const errorMessage = err.response?.data?.message || 
                            err.message || 
                            'Network error occurred';
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
      toast.warn('Please fix the form errors', {
        position: "top-right",
      });
    }
  };

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validateForm = () => {
    const errors = {};
    const {
      title, price, description, emailORusername, password,
      recoveryEmail, recoveryEmailPassword, two_factor_enabled,
      two_factor_description, subscriptionStatus, expiry_date
    } = formData;

    if (!formData.platform) errors.platform = "Platform selection is required";
    if (!title.trim()) errors.title = "Account Title is required";
    if (!price || isNaN(price)) errors.price = "Valid price is required";
    if (parseFloat(price) <= 0) errors.price = "Price must be positive";
    if (!description.trim()) errors.description = "Description is required";

    if (!emailORusername.trim()) {
      errors.emailORusername = "Email/Username is required";
    } else if (emailORusername.includes('@') && !isValidEmail(emailORusername)) {
      errors.emailORusername = "Invalid email format";
    }

    if (!password.trim()) errors.password = "Password is required";

    if (!recoveryEmail.trim()) {
      errors.recoveryEmail = "Recovery email is required";
    } else if (!isValidEmail(recoveryEmail)) {
      errors.recoveryEmail = "Invalid recovery email";
    }

    if (!recoveryEmailPassword.trim()) {
      errors.recoveryEmailPassword = "Recovery password is required";
    }

    if (two_factor_enabled && !two_factor_description.trim()) {
      errors.two_factor_description = "2FA description required when enabled";
    }

    if (!subscriptionStatus) {
      errors.subscriptionStatus = "Subscription status is required";
    } else if (subscriptionStatus === 'active' && !expiry_date) {
      errors.expiry_date = "Expiry date required for active subscription";
    }

    return errors;
  };

  return {
    ...formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFormData
  };
};

const AddNewProduct = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [platformOptions, setPlatformOptions] = useState([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);
  const [platformError, setPlatformError] = useState(null);

  const { user } = useContext(AuthContext);
  const userUid = user?.uid || null;

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setLoadingPlatforms(true);
        const response = await getAllPlatforms();
        if (response?.success && Array.isArray(response.data)) {
          setPlatformOptions(response.data);
        } else {
          throw new Error('Invalid platforms data format');
        }
      } catch (error) {
        setPlatformError(error.message || 'Failed to load platforms');
        console.error("Error fetching platforms:", error);
        setPlatformOptions([]);
      } finally {
        setLoadingPlatforms(false);
      }
    };

    fetchPlatforms();
  }, []);

  const {
    platform,
    title,
    emailORusername,
    password,
    price,
    previewLink,
    description,
    subscriptionStatus,
    two_factor_enabled,
    two_factor_description,
    expiry_date,
    recoveryEmail,
    recoveryEmailPassword,
    additionalEmail,
    additionalPassword,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFormData
  } = useAddAccountLogic(userUid, setCurrentStep);

  const handlePlatformChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      platform: value
    }));
  };

  const steps = [
    { number: 1, title: 'Account Details' },
    { number: 2, title: 'Credentials' },
    { number: 3, title: 'Security' }
  ];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const selectedPlatform = platformOptions.find(p => p.id === platform);

  const renderLoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </div>
  );

  return (
    <div className='text-gray-200 flex flex-col'>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
      
      <h1 className='text-lg font-semibold'>Add New Product</h1>
      <p className='mb-4'>
        Easily add new products to your store! Fill in the details, set the price,
        upload images, and manage availability.
      </p>

      <div className='rounded-md px-3 py-2 bg-gray-800 justify-center items-center'>
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${currentStep >= step.number ? 'bg-primary-600' : 'bg-gray-600'}
                      ${currentStep === step.number ? 'ring-2 ring-primary-400' : ''}`}
                  >
                    <span className="text-white text-sm">{step.number}</span>
                  </div>
                  <span className={`text-xs mt-1 ${currentStep === step.number ? 'text-primary-400 font-medium' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${currentStep > step.number ? 'bg-primary-600' : 'bg-gray-600'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {platformError && (
          <div className="text-red-500 text-center mb-4">{platformError}</div>
        )}

        <div className='w-[50%] mx-auto p-3 border border-gray-400/70 rounded-md space-y-4'>
          {currentStep === 1 && (
            <>
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-white mb-1">
                  Select Platform
                </label>
                {loadingPlatforms ? (
                  <div className="text-center py-2">Loading platforms...</div>
                ) : (
                  <div className="relative">
                    <select
                      id="platform"
                      name="platform"
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 pr-10 appearance-none"
                      value={platform}
                      onChange={handlePlatformChange}
                    >
                      <option value="" disabled>Select a platform...</option>
                      {platformOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    {selectedPlatform && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <img 
                          src={selectedPlatform.image_path} 
                          alt={selectedPlatform.name}
                          className="h-5 w-5 object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}
                {errors.platform && <p className="text-xs text-red-500 mt-1">{errors.platform}</p>}
              </div>

              <InputField
                id="title"
                label="Account Title"
                type="text"
                value={title}
                onChange={handleChange}
                placeholder="e.g. 1 year old Facebook Account"
                error={errors.title}
              />
              <InputField
                id="previewLink"
                label="Preview Link"
                type="text"
                value={previewLink}
                onChange={handleChange}
                placeholder="Preview link to the account (optional)"
                error={errors.previewLink}
              />
              <InputField
                id="price"
                label="Account Price"
                type="number"
                value={price}
                onChange={handleChange}
                placeholder="e.g. $10"
                error={errors.price}
              />
              <div>
                <label htmlFor="description" className='block text-sm font-medium'>Account Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={handleChange}
                  placeholder="Describe the account"
                  rows={6}
                  className='w-full bg-transparent border border-gray-600 rounded-md p-2 placeholder:text-gray-600 text-sm'
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
              </div>
              <div className="mt-6 flex justify-end items-end gap-3">
                <button
                  onClick={handleNext}
                  disabled={!platform || !title || !price || !description || isSubmitting}
                  className={`px-6 py-2 rounded-md shadow-md transition 
                    ${(!platform || !title || !price || !description || isSubmitting) ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
                >
                  {isSubmitting ? renderLoadingSpinner() : 'Next'}
                </button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className='flex flex-col'>
                <div className='flex justify-center items-center'>
                  <h1 className='text-[17px] font-semibold'>Account Credentials</h1>
                </div>
                <InputField
                  id="emailORusername"
                  label="Account Email/Username"
                  type="text"
                  value={emailORusername}
                  onChange={handleChange}
                  placeholder="Email or Username"
                  error={errors.emailORusername}
                />
                <InputField
                  id="password"
                  label="Account Password"
                  type="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Password to the account"
                  error={errors.password}
                />
              </div>

              <div className='flex flex-col'>
                <div className='flex justify-center items-center'>
                  <h1 className='text-[17px] font-semibold'>Additional Information (optional)</h1>
                </div>
                <InputField
                  id="additionalEmail"
                  label="Additional Email"
                  type="email"
                  value={additionalEmail}
                  onChange={handleChange}
                  placeholder="Optional - Email attached to the account"
                  error={errors.additionalEmail}
                />
                <InputField
                  id="additionalPassword"
                  label="Additional Password"
                  type="password"
                  value={additionalPassword}
                  onChange={handleChange}
                  placeholder="Optional - Password to the additional email"
                  error={errors.additionalPassword}
                />
              </div>

              <div className='flex flex-col'>
                <div className='flex justify-center items-center'>
                  <h1 className='text-[17px] font-semibold'>Recovery Details</h1>
                </div>
                <InputField
                  id="recoveryEmail"
                  label="Recovery Email"
                  type="email"
                  value={recoveryEmail}
                  onChange={handleChange}
                  placeholder="Recovery email for the account"
                  error={errors.recoveryEmail}
                />
                <InputField
                  id="recoveryEmailPassword"
                  label="Recovery Email Password"
                  type="password"
                  value={recoveryEmailPassword}
                  onChange={handleChange}
                  placeholder="Password for recovery email"
                  error={errors.recoveryEmailPassword}
                />
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className={`px-6 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-gray-600 hover:bg-gray-700'} text-white rounded-md shadow-md transition`}
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!emailORusername || !password || isSubmitting}
                  className={`px-6 py-2 rounded-md shadow-md transition 
                    ${(!emailORusername || !password || isSubmitting) ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
                >
                  {isSubmitting ? renderLoadingSpinner() : 'Next'}
                </button>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <SelectField2
                id="subscriptionStatus"
                label="Subscription Status"
                value={subscriptionStatus}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'expired', label: 'Expired' },
                  { value: 'none', label: 'None' },
                ]}
                error={errors.subscriptionStatus}
              />

              {subscriptionStatus === 'active' && (
                <InputField
                  id="expiry_date"
                  label="Expiry Date"
                  type="date"
                  value={expiry_date}
                  onChange={handleChange}
                  error={errors.expiry_date}
                />
              )}

              <InputField
                id="two_factor_enabled"
                label="2-Factor Authentication"
                type="checkbox"
                checked={two_factor_enabled}
                onChange={handleChange}
                error={errors.two_factor_enabled}
              />

              {two_factor_enabled && (
                <div className={`transition-all duration-300 ${two_factor_enabled ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                  <label htmlFor="two_factor_description" className='block text-sm font-medium'>
                    2-Factor Authentication Description
                  </label>
                  <textarea
                    id="two_factor_description"
                    value={two_factor_description}
                    onChange={handleChange}
                    placeholder="Explain the 2FA procedure"
                    rows={6}
                    className='w-full bg-transparent border border-gray-600 rounded-md p-2 placeholder:text-gray-600 text-sm'
                  />
                  {errors.two_factor_description && (
                    <p className="text-xs text-red-500">{errors.two_factor_description}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className={`px-6 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-gray-600 hover:bg-gray-700'} text-white rounded-md shadow-md transition`}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!subscriptionStatus || isSubmitting}
                  className={`px-6 py-2 rounded-md shadow-md transition 
                    ${(!subscriptionStatus || isSubmitting) ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
                >
                  {isSubmitting ? renderLoadingSpinner() : 'Submit'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;