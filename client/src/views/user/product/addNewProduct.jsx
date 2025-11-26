import React, { useState, useEffect, useContext } from "react";
import {
  createAccount,
  getAllPlatforms,
} from "../../../components/backendApis/accounts/accounts";
import InputField from "../../../components/interFace/InputField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../components/control/authContext";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import Stepper from "../../../components/utils/stepper";
import { FaEdit } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";

const useAddAccountLogic = () => {
  const [formData, setFormData] = useState({
    platform: "",
    title: "",
    price: "",
    description: "",
    credentials: [
      {
        emailORusername: "",
        password: "",
        recovery_info: "",
        recovery_password: "",
        previewLink: "",
        factor_description: "",
      },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCredentialChange = (index, e) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const updatedCredentials = [...prev.credentials];
      updatedCredentials[index][id] = value;
      return { ...prev, credentials: updatedCredentials };
    });
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleCredentialChange,
  };
};

const AddNewProduct = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [platformOptions, setPlatformOptions] = useState([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState([]);

  const { user } = useContext(AuthContext);
  const userUid = user?.uid || null;

  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleCredentialChange,
  } = useAddAccountLogic();
  const { platform, title, price, description, credentials } = formData;

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setLoadingPlatforms(true);
        const response = await getAllPlatforms();
        if (response?.success && Array.isArray(response.data))
          setPlatformOptions(response.data);
      } finally {
        setLoadingPlatforms(false);
      }
    };
    fetchPlatforms();
  }, []);

  const handlePlatformSelect = (platformId) => {
    handleChange({ target: { id: "platform", value: platformId } });
    setIsPlatformDropdownOpen(false);
  };

  const validateStep1 = () => {
    if (!platform) {
      toast.error("Platform is required");
      return false;
    }
    if (!title.trim()) {
      toast.error("Account Title is required");
      return false;
    }
    if (!price || isNaN(price)) {
      toast.error("Valid Price is required");
      return false;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    for (const cred of credentials) {
      if (!cred.emailORusername.trim()) {
        toast.error("Email/Username is required");
        return false;
      }
      if (!cred.password.trim()) {
        toast.error("Password is required");
        return false;
      }
      if (!cred.factor_description.trim()) {
        toast.error("Factor description is required");
        return false;
      }
    }
    return true;
  };

  const handleAddAnotherAccount = () => {
    if (!validateStep2()) return;
    setSavedAccounts((prev) => [...prev, JSON.parse(JSON.stringify(formData))]);
    setFormData((prev) => ({
      ...prev,
      credentials: [
        {
          emailORusername: "",
          password: "",
          recovery_info: "",
          recovery_password: "",
          previewLink: "",
          factor_description: "",
        },
      ],
    }));
    setCurrentStep(2);
    toast.success("Account added to summary. You can add another.");
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      for (const account of savedAccounts) {
        for (const cred of account.credentials) {
          const payload = {
            ...account,
            ...cred,
            price: parseFloat(account.price),
            userUid,
          };
          delete payload.credentials;
          await createAccount(payload);
        }
      }
      toast.success("All accounts submitted successfully!");
      setSavedAccounts([]);
      setFormData({
        platform: "",
        title: "",
        price: "",
        description: "",
        credentials: [
          {
            emailORusername: "",
            password: "",
            recovery_info: "",
            recovery_password: "",
            previewLink: "",
            factor_description: "",
          },
        ],
      });
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Account Details" },
    { number: 2, title: "Credentials" },
    { number: 3, title: "Summary & Security" },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const selectedPlatform = platformOptions.find(
    (p) => p.id.toString() === platform.toString()
  );

  return (
    <div className="text-gray-200 flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-lg font-semibold">Add New Product</h1>
      <p className="mb-4 text-sm">
        Fill in the details and add multiple accounts. Step 3 will summarize all
        added accounts.
      </p>

      <Stepper steps={steps} currentStep={currentStep} />

      <div className="w-full max-w-lg mx-auto p-3 border border-gray-400/70 rounded-md space-y-4">
        {/* Step 1 */}
        {currentStep === 1 && (
          <>
            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Select Platform <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 pr-10 cursor-pointer flex items-center"
                  onClick={() =>
                    setIsPlatformDropdownOpen(!isPlatformDropdownOpen)
                  }
                >
                  {platform ? (
                    <>
                      {selectedPlatform?.image_path && (
                        <img
                          src={selectedPlatform.image_path}
                          alt={selectedPlatform.name}
                          className="h-5 w-5 rounded-full object-contain mr-2"
                        />
                      )}
                      {selectedPlatform?.name || "Select a platform..."}
                    </>
                  ) : (
                    "Select a platform..."
                  )}
                  {isPlatformDropdownOpen ? (
                    <ChevronUpIcon className="h-4 w-4 absolute right-2" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 absolute right-2" />
                  )}
                </div>
                {isPlatformDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                    {platformOptions.map((option) => (
                      <div
                        key={option.id}
                        className="px-3 py-2 hover:bg-gray-600 cursor-pointer flex items-center"
                        onClick={() => handlePlatformSelect(option.id)}
                      >
                        {option.image_path && (
                          <img
                            src={option.image_path}
                            alt={option.name}
                            className="h-5 w-5 rounded-full object-contain mr-2"
                          />
                        )}
                        {option.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <InputField
              id="title"
              label="Account Title *"
              type="text"
              value={title}
              onChange={handleChange}
              placeholder="e.g. 1 year old Facebook Account"
            />

            {/* Price */}
            <InputField
              id="price"
              label="Account Price *"
              type="number"
              value={price}
              onChange={handleChange}
              placeholder="e.g. $10"
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium">
                Account Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={handleChange}
                placeholder="Describe the account"
                rows={6}
                className="w-full bg-transparent border rounded-md p-2 placeholder:text-gray-600 text-sm"
              />
            </div>
          </>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <>
            {credentials.map((cred, index) => (
              <div key={index} className="border p-2 rounded mb-2">
                <InputField
                  id="emailORusername"
                  label="Email/Username *"
                  type="text"
                  value={cred.emailORusername}
                  onChange={(e) => handleCredentialChange(index, e)}
                />
                <InputField
                  id="password"
                  label="Password *"
                  type="password"
                  value={cred.password}
                  onChange={(e) => handleCredentialChange(index, e)}
                />
                <InputField
                  id="previewLink"
                  label="Preview Link (optional)"
                  type="text"
                  value={cred.previewLink}
                  onChange={(e) => handleCredentialChange(index, e)}
                />
                <InputField
                  id="recovery_info"
                  label="Recovery Info (optional)"
                  type="text"
                  value={cred.recovery_info}
                  onChange={(e) => handleCredentialChange(index, e)}
                />
                <InputField
                  id="recovery_password"
                  label="Recovery Password (optional)"
                  type="password"
                  value={cred.recovery_password}
                  onChange={(e) => handleCredentialChange(index, e)}
                />
                <div>
                  <label className="block text-sm font-medium">
                    Factor Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="factor_description"
                    value={cred.factor_description}
                    onChange={(e) => handleCredentialChange(index, e)}
                    placeholder="description"
                    rows={4}
                    className="w-full bg-transparent border rounded-md p-2 text-sm"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-start">
              <button
                type="button"
                onClick={handleAddAnotherAccount}
                disabled={
                  !credentials[0].emailORusername.trim() ||
                  !credentials[0].password.trim() ||
                  !credentials[0].factor_description.trim()
                }
                className="mt-2 bg-primary-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Add Account
              </button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <>
            <h2 className="text-lg font-semibold mb-3">Summary of Accounts</h2>
            {savedAccounts.length === 0 && <p>No accounts added yet.</p>}
            {savedAccounts.map((account, index) => (
              <div
                key={index}
                className="border p-3 rounded mb-2 bg-gray-800 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-white">
                    Account {index + 1}: {account.title || "N/A"}
                  </p>
                  <p>
                    Platform:{" "}
                    {platformOptions.find(
                      (p) => p.id.toString() === account.platform.toString()
                    )?.name || "N/A"}
                  </p>
                  {account.credentials.map((cred, i) => (
                    <div key={i}>
                      <p>Email/Username: {cred.emailORusername || "N/A"}</p>
                      <p>Password: {cred.password ? "••••••••" : "N/A"}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData(JSON.parse(JSON.stringify(account)));
                      setCurrentStep(2);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => {
                      setSavedAccounts((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      toast.info(`Account ${index + 1} removed`);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <ImCancelCircle />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-end justify-end mt-4 gap-3 w-full">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md shadow-md transition"
            >
              Back
            </button>
          )}
          {currentStep < steps.length && (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md shadow-md transition"
            >
              Next
            </button>
          )}
          {currentStep === steps.length && (
            <button
              onClick={handleSubmitAll}
              disabled={isSubmitting || savedAccounts.length === 0}
              className={`px-6 py-2 rounded-md shadow-md flex items-center justify-center gap-2 transition ${
                savedAccounts.length === 0
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isSubmitting && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              Submit All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;
