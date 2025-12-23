import React, { useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ----------------------------------
 * Constants
 * ---------------------------------- */
const COUNTRIES = [
  "Nigeria",
  "Cameroon",
  "Ghana",
  "South Africa",
  "Kenya",
  "Rwanda",
  "United Kingdom",
  "United States",
  "Canada",
];

const PASSWORD_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

/* ----------------------------------
 * Helpers
 * ---------------------------------- */
const evaluatePasswordStrength = (password) => {
  if (!password || password.length < 6) {
    return { label: "Weak", color: "bg-red-500", width: "33%" };
  }

  const isStrong =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  if (isStrong) {
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  }

  return { label: "Medium", color: "bg-yellow-500", width: "66%" };
};

/* ----------------------------------
 * Component
 * ---------------------------------- */
function CreateVendor() {
  const [formData, setFormData] = useState({
    vendorName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    referralCode: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = evaluatePasswordStrength(formData.password);

  /* ----------------------------------
   * Handlers
   * ---------------------------------- */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const generatePassword = useCallback(() => {
    let generated = "";
    for (let i = 0; i < 12; i++) {
      generated += PASSWORD_CHARSET.charAt(
        Math.floor(Math.random() * PASSWORD_CHARSET.length)
      );
    }
    setFormData((prev) => ({ ...prev, password: generated }));
    toast.info("Secure password generated.");
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const { vendorName, username, email, password, phone, country } = formData;

      if (!vendorName || !username || !email || !password || !phone || !country) {
        toast.error("All fields are required.");
        return;
      }

      const payload = {
        full_name: vendorName.trim(),
        username: username.trim(),
        email: email.trim(),
        phone_number: phone.trim(),
        password,
        country,
        role: "merchant",
      };

      setLoading(true);
      setErrors({});

      try {
        const { data: response } = await axios.post("/auth/register", payload);

        if (response.success) {
          toast.success(response.message || "Merchant created successfully.");
          setFormData({
            vendorName: "",
            username: "",
            email: "",
            password: "",
            phone: "",
            country: "",
          });
        } else {
          if (response.errors?.length) {
            const fieldErrors = {};
            response.errors.forEach((err) => {
              if (err.includes("Email")) fieldErrors.email = err;
              else if (err.includes("Phone")) fieldErrors.phone = err;
              else if (err.includes("Username")) fieldErrors.username = err;
              else fieldErrors.general = err;
              toast.error(err);
            });
            setErrors(fieldErrors);
          } else if (response.message) {
            toast.error(response.message);
          } else {
            toast.error("Registration failed. Please try again.");
          }
          console.error("Register failed:", response.errors || response.message);
        }
      } catch (err) {
        toast.error("Network error. Please try again.");
        console.error("Network error:", err.message);
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  /* ----------------------------------
   * Render
   * ---------------------------------- */
  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} newestOnTop />

      <div className="w-full rounded-2xl bg-white shadow-xl">
        <header className="border-b px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">Create Merchant</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add merchant details and generate secure credentials.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 px-6 py-6 tab:grid-cols-2"
          noValidate
        >
          <FormInput
            label="Merchant Full Name"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            error={errors.vendorName}
          />

          <FormInput
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
            error={errors.username}
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="merchant@email.com"
            required
            error={errors.email}
          />

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 flex gap-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Generate or enter password"
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rounded-lg border px-3 text-sm text-gray-600 hover:bg-gray-100"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

              <button
                type="button"
                onClick={generatePassword}
                className="rounded-lg bg-indigo-100 px-3 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
              >
                Generate
              </button>
            </div>

            {formData.password && (
              <div className="mt-2">
                <div className="h-2 w-full rounded bg-gray-200">
                  <div
                    className={`h-2 rounded ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Strength: <span className="font-medium">{passwordStrength.label}</span>
                </p>
              </div>
            )}
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+234 000 000 0000"
            error={errors.phone}
          />

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`mt-1 w-full rounded-lg border px-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 ${
                errors.country ? "border-red-500" : ""
              }`}
              required
            >
              <option value="">Select country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
          </div>

          {/* Actions */}
          <div className="tab:col-span-2 flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`rounded-lg px-5 py-2 text-sm text-white ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Creating..." : "Create Merchant"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}


function FormInput({ label, name, type = "text", value, onChange, placeholder, required = false, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`mt-1 w-full rounded-lg border px-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default CreateVendor;
