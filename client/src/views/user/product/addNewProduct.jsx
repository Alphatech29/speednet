import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { HiSearch, HiCheck } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import {
  createAccount,
  getAllPlatforms,
} from "../../../components/backendApis/accounts/accounts";
import { AuthContext } from "../../../components/control/authContext";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

/* ─── Reusable FloatingInput ──────────────────────────────────────────── */
const FloatInput = ({ id, label, type = "text", value, onChange, required, placeholder = " " }) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete="off"
      className="peer w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 pt-5 pb-2.5 text-sm text-gray-800 dark:text-slate-200 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all"
    />
    <label
      htmlFor={id}
      className="absolute left-4 top-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide pointer-events-none transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wide peer-focus:text-primary-600"
    >
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  </div>
);

const FloatTextarea = ({ id, label, value, onChange, rows = 5, required }) => (
  <div className="relative">
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder=" "
      className="peer w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 pt-5 pb-2.5 text-sm text-gray-800 dark:text-slate-200 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all resize-none"
    />
    <label
      htmlFor={id}
      className="absolute left-4 top-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide pointer-events-none transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wide peer-focus:text-primary-600"
    >
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  </div>
);

/* ─── Inline Stepper ──────────────────────────────────────────────────── */
const steps = [
  { number: 1, title: "Account Details" },
  { number: 2, title: "Credentials" },
  { number: 3, title: "Summary" },
];

const InlineStepper = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-0 mb-8">
    {steps.map((step, i) => (
      <div key={step.number} className="flex items-center">
        <div className="flex flex-col items-center">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
              currentStep > step.number
                ? "bg-green-500 text-white"
                : currentStep === step.number
                ? "bg-primary-600 text-white ring-4 ring-primary-600/20"
                : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500"
            }`}
          >
            {currentStep > step.number ? <HiCheck size={16} /> : step.number}
          </div>
          <span
            className={`text-[10px] mt-1.5 font-semibold whitespace-nowrap ${
              currentStep === step.number
                ? "text-primary-600"
                : currentStep > step.number
                ? "text-green-500"
                : "text-gray-400 dark:text-slate-500"
            }`}
          >
            {step.title}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div
            className={`w-16 h-0.5 mx-2 mb-5 transition-all ${
              currentStep > step.number ? "bg-primary-600" : "bg-gray-200 dark:bg-slate-700"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

/* ─── Empty credential template ──────────────────────────────────────── */
const emptyCredential = () => ({
  emailORusername: "",
  password: "",
  recovery_info: "",
  recovery_password: "",
  previewLink: "",
  factor_description: "",
});

/* ─── Main component ──────────────────────────────────────────────────── */
const AddNewProduct = () => {
  const { user } = useContext(AuthContext);
  const userUid = user?.uid || null;

  const [currentStep, setCurrentStep] = useState(1);
  const [platformOptions, setPlatformOptions] = useState([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const [platformSearch, setPlatformSearch] = useState("");
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    platform: "",
    title: "",
    price: "",
    description: "",
    credentials: [emptyCredential()],
  });

  const { platform, title, price, description, credentials } = formData;

  useEffect(() => {
    getAllPlatforms()
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) setPlatformOptions(res.data);
      })
      .finally(() => setLoadingPlatforms(false));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCredentialChange = (index, e) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const updated = [...prev.credentials];
      updated[index][id] = value;
      return { ...prev, credentials: updated };
    });
  };

  const handlePlatformSelect = (platformId) => {
    setFormData((prev) => ({ ...prev, platform: String(platformId) }));
    setIsPlatformDropdownOpen(false);
    setPlatformSearch("");
  };

  const filteredPlatforms = platformOptions.filter((o) =>
    o.name.toLowerCase().includes(platformSearch.toLowerCase())
  );

  const selectedPlatform = platformOptions.find(
    (p) => String(p.id) === String(platform)
  );

  const validateStep1 = () => {
    if (!platform) { toast.error("Platform is required"); return false; }
    if (!title.trim()) { toast.error("Account Title is required"); return false; }
    if (!price || isNaN(price)) { toast.error("Valid Price is required"); return false; }
    if (!description.trim()) { toast.error("Description is required"); return false; }
    return true;
  };

  const validateStep2 = () => {
    for (const cred of credentials) {
      if (!cred.emailORusername.trim()) { toast.error("Email/Username is required"); return false; }
      if (!cred.password.trim()) { toast.error("Password is required"); return false; }
      if (!cred.factor_description.trim()) { toast.error("Factor description is required"); return false; }
    }
    return true;
  };

  const handleAddAnotherAccount = () => {
    if (!validateStep2()) return;
    setSavedAccounts((prev) => [...prev, JSON.parse(JSON.stringify(formData))]);
    setFormData((prev) => ({ ...prev, credentials: [emptyCredential()] }));
    setCurrentStep(2);
    toast.success("Account saved to summary");
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      for (const account of savedAccounts) {
        for (const cred of account.credentials) {
          const payload = { ...account, ...cred, price: parseFloat(account.price), userUid };
          delete payload.credentials;
          await createAccount(payload);
        }
      }
      toast.success("All accounts submitted successfully!");
      setSavedAccounts([]);
      setFormData({ platform: "", title: "", price: "", description: "", credentials: [emptyCredential()] });
      setCurrentStep(1);
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ToastContainer position="top-right" theme="colored" />

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Add New Product</h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">
          Fill in the details and add credentials. Review in Step 3 before submitting.
        </p>
      </div>

      {/* Stepper */}
      <InlineStepper currentStep={currentStep} />

      {/* Form card */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            Step {currentStep}:{" "}
            <span className="text-gray-400 dark:text-slate-400 font-normal">
              {steps[currentStep - 1].title}
            </span>
          </p>
        </div>

        <div className="p-6 space-y-4">
          <AnimatePresence mode="wait">
            {/* ── STEP 1 ── */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Platform selector */}
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2 block">
                    Platform <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPlatformDropdownOpen((v) => !v)}
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3 text-left hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all"
                    >
                      {loadingPlatforms ? (
                        <span className="text-sm text-gray-400 dark:text-slate-500">Loading platforms...</span>
                      ) : platform && selectedPlatform ? (
                        <>
                          {selectedPlatform.image_path && (
                            <img
                              src={selectedPlatform.image_path}
                              alt={selectedPlatform.name}
                              className="w-6 h-6 rounded-lg object-contain flex-shrink-0"
                            />
                          )}
                          <span className="text-sm text-gray-800 dark:text-slate-200 font-semibold">
                            {selectedPlatform.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-slate-500">Select a platform...</span>
                      )}
                      <span className="ml-auto text-gray-400 dark:text-slate-500">
                        {isPlatformDropdownOpen ? (
                          <ChevronUpIcon className="w-4 h-4" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4" />
                        )}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isPlatformDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-30 mt-1.5 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl max-h-60 overflow-hidden flex flex-col"
                        >
                          <div className="p-3 border-b border-gray-100 dark:border-slate-700 flex-shrink-0">
                            <div className="relative">
                              <HiSearch
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
                              />
                              <input
                                type="text"
                                value={platformSearch}
                                onChange={(e) => setPlatformSearch(e.target.value)}
                                placeholder="Search platforms..."
                                autoFocus
                                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600/30 transition-all"
                              />
                            </div>
                          </div>
                          <div className="overflow-y-auto">
                            {filteredPlatforms.length === 0 ? (
                              <p className="px-4 py-3 text-sm text-gray-400 dark:text-slate-500 text-center">
                                No platforms found
                              </p>
                            ) : (
                              filteredPlatforms.map((option) => (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => handlePlatformSelect(option.id)}
                                  className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-primary-600/5 dark:hover:bg-primary-600/10 transition-colors ${
                                    String(option.id) === String(platform)
                                      ? "bg-primary-600/10 dark:bg-primary-600/15"
                                      : ""
                                  }`}
                                >
                                  {option.image_path && (
                                    <img
                                      src={option.image_path}
                                      alt={option.name}
                                      className="w-6 h-6 rounded-lg object-contain flex-shrink-0"
                                    />
                                  )}
                                  <span className="text-sm text-gray-800 dark:text-slate-200">
                                    {option.name}
                                  </span>
                                  {String(option.id) === String(platform) && (
                                    <HiCheck size={14} className="ml-auto text-primary-600" />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <FloatInput id="title" label="Account Title" value={title} onChange={handleChange} required />
                <FloatInput id="price" label="Account Price" type="number" value={price} onChange={handleChange} required />
                <FloatTextarea id="description" label="Account Description" value={description} onChange={handleChange} required />
              </motion.div>
            )}

            {/* ── STEP 2 ── */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {credentials.map((cred, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 rounded-2xl p-4 space-y-3"
                  >
                    <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                      Credential #{index + 1}
                    </p>
                    <FloatInput
                      id="emailORusername"
                      label="Email / Username"
                      value={cred.emailORusername}
                      onChange={(e) => handleCredentialChange(index, e)}
                      required
                    />
                    <FloatInput
                      id="password"
                      label="Password"
                      type="password"
                      value={cred.password}
                      onChange={(e) => handleCredentialChange(index, e)}
                      required
                    />
                    <FloatInput
                      id="previewLink"
                      label="Preview Link (optional)"
                      value={cred.previewLink}
                      onChange={(e) => handleCredentialChange(index, e)}
                    />
                    <FloatInput
                      id="recovery_info"
                      label="Recovery Info (optional)"
                      value={cred.recovery_info}
                      onChange={(e) => handleCredentialChange(index, e)}
                    />
                    <FloatInput
                      id="recovery_password"
                      label="Recovery Password (optional)"
                      type="password"
                      value={cred.recovery_password}
                      onChange={(e) => handleCredentialChange(index, e)}
                    />
                    <FloatTextarea
                      id="factor_description"
                      label="Factor Description"
                      value={cred.factor_description}
                      onChange={(e) => handleCredentialChange(index, e)}
                      rows={3}
                      required
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddAnotherAccount}
                  disabled={
                    !credentials[0].emailORusername.trim() ||
                    !credentials[0].password.trim() ||
                    !credentials[0].factor_description.trim()
                  }
                  className="w-full py-2.5 text-sm font-bold bg-primary-600/10 hover:bg-primary-600/15 text-primary-600 border border-primary-600/20 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  + Save Account to Summary
                </button>
              </motion.div>
            )}

            {/* ── STEP 3 ── */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {savedAccounts.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-10">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-slate-500">No accounts added yet</p>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-2xl transition-all"
                    >
                      Go to Credentials
                    </button>
                  </div>
                ) : (
                  savedAccounts.map((account, index) => {
                    const pName = platformOptions.find(
                      (p) => String(p.id) === String(account.platform)
                    )?.name;
                    return (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            Account {index + 1}: {account.title}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                            {pName || "Unknown platform"} · {account.credentials.length} credential{account.credentials.length !== 1 ? "s" : ""}
                          </p>
                          {account.credentials.map((cred, i) => (
                            <p key={i} className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                              {cred.emailORusername} · ••••••••
                            </p>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => { setFormData(JSON.parse(JSON.stringify(account))); setCurrentStep(2); }}
                            className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSavedAccounts((prev) => prev.filter((_, i) => i !== index));
                              toast.info(`Account ${index + 1} removed`);
                            }}
                            className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center transition-all"
                          >
                            <ImCancelCircle size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-800/50">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 text-sm font-bold rounded-2xl transition-all disabled:opacity-50"
              >
                Back
              </button>
            )}
          </div>

          <div>
            {currentStep < steps.length && (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-primary-600/25 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                Next Step
              </button>
            )}

            {currentStep === steps.length && (
              <button
                type="button"
                onClick={handleSubmitAll}
                disabled={isSubmitting || savedAccounts.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-2xl shadow-md shadow-green-600/25 hover:-translate-y-0.5 transition-all"
              >
                {isSubmitting && (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {isSubmitting ? "Submitting..." : `Submit ${savedAccounts.length} Account${savedAccounts.length !== 1 ? "s" : ""}`}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddNewProduct;
