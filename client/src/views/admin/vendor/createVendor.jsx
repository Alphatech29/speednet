import { useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiEye, HiEyeOff, HiRefresh } from "react-icons/hi";

const COUNTRIES = [
  "Nigeria", "Cameroon", "Ghana", "South Africa", "Kenya",
  "Rwanda", "United Kingdom", "United States", "Canada",
];

const PASSWORD_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

const passwordStrength = (pw) => {
  if (!pw || pw.length < 6) return { label: "Weak", color: "bg-red-500", w: "33%" };
  const strong = pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  if (strong) return { label: "Strong", color: "bg-green-500", w: "100%" };
  return { label: "Medium", color: "bg-yellow-500", w: "66%" };
};

const inputCls = (err) => `w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none ${
  err ? "border-red-400 bg-red-50" : "border-gray-200 bg-white text-gray-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10"
}`;

const FormField = ({ label, name, type = "text", value, onChange, placeholder, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      className={inputCls(error)} />
    {error && <p className="text-[11px] text-red-500">{error}</p>}
  </div>
);

function CreateVendor() {
  const [formData, setFormData] = useState({
    vendorName: "", username: "", email: "", password: "", phone: "", country: "",
  });
  const [errors, setErrors]         = useState({});
  const [showPassword, setShowPass] = useState(false);
  const [loading, setLoading]       = useState(false);

  const strength = passwordStrength(formData.password);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: null }));
  }, []);

  const generatePassword = useCallback(() => {
    let pw = "";
    for (let i = 0; i < 12; i++)
      pw += PASSWORD_CHARSET.charAt(Math.floor(Math.random() * PASSWORD_CHARSET.length));
    setFormData((p) => ({ ...p, password: pw }));
    toast.info("Secure password generated.");
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { vendorName, username, email, password, phone, country } = formData;
    if (!vendorName || !username || !email || !password || !phone || !country) {
      toast.error("All fields are required."); return;
    }
    setLoading(true); setErrors({});
    try {
      const { data: res } = await axios.post("/auth/register", {
        full_name: vendorName.trim(), username: username.trim(),
        email: email.trim(), phone_number: phone.trim(), password, country, role: "merchant",
      });
      if (res?.success) {
        toast.success(res.message || "Merchant created successfully.");
        setFormData({ vendorName: "", username: "", email: "", password: "", phone: "", country: "" });
      } else {
        if (res.errors?.length) {
          const fe = {};
          res.errors.forEach((err) => {
            if (err.includes("Email")) fe.email = err;
            else if (err.includes("Phone")) fe.phone = err;
            else if (err.includes("Username")) fe.username = err;
            else fe.general = err;
            toast.error(err);
          });
          setErrors(fe);
        } else toast.error(res?.message || "Registration failed.");
      }
    } catch { toast.error("Network error. Please try again."); }
    setLoading(false);
  }, [formData]);

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <div>
        <p className="text-sm font-bold text-gray-800">Create Merchant</p>
        <p className="text-xs text-gray-400 mt-0.5">Add merchant details and generate secure credentials</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-5">
          <div className="grid grid-cols-1 tab:grid-cols-2 gap-4">
            <FormField label="Merchant Full Name" name="vendorName" value={formData.vendorName}
              onChange={handleChange} placeholder="Enter full name" error={errors.vendorName} />

            <FormField label="Username" name="username" value={formData.username}
              onChange={handleChange} placeholder="Enter username" error={errors.username} />

            <FormField label="Email Address" name="email" type="email" value={formData.email}
              onChange={handleChange} placeholder="merchant@email.com" error={errors.email} />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">Password</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input type={showPassword ? "text" : "password"} name="password"
                    value={formData.password} onChange={handleChange}
                    placeholder="Generate or enter password"
                    className={`${inputCls(errors.password)} pr-10`} />
                  <button type="button" onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <HiEyeOff size={15} /> : <HiEye size={15} />}
                  </button>
                </div>
                <button type="button" onClick={generatePassword}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all whitespace-nowrap">
                  <HiRefresh size={12} /> Generate
                </button>
              </div>
              {formData.password && (
                <div className="mt-1">
                  <div className="h-1.5 w-full rounded-full bg-gray-100">
                    <div className={`h-1.5 rounded-full transition-all ${strength.color}`} style={{ width: strength.w }} />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">Strength: <span className="font-semibold">{strength.label}</span></p>
                </div>
              )}
              {errors.password && <p className="text-[11px] text-red-500">{errors.password}</p>}
            </div>

            <FormField label="Phone Number" name="phone" type="tel" value={formData.phone}
              onChange={handleChange} placeholder="+234 000 000 0000" error={errors.phone} />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">Country</label>
              <select name="country" value={formData.country} onChange={handleChange}
                className={inputCls(errors.country)}>
                <option value="">Select country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.country && <p className="text-[11px] text-red-500">{errors.country}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button type="submit" disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all">
              {loading ? "Creating..." : "Create Merchant"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateVendor;
