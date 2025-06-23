import React, { useContext, useState, useEffect, useRef } from "react";
import { Label, Button, Spinner } from "flowbite-react";
import { AuthContext } from "../../../components/control/authContext";
import {
  fetchInternationalAirtimeCountries,
  fetchInternationalProductTypes,
  fetchInternationalOperators,
  fetchInternationalVariations,
  internationalPurchase,
} from "../../../components/backendApis/vtu/vtuService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InternationalAirtime = () => {
  const { user, webSettings } = useContext(AuthContext);

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");

  const [operators, setOperators] = useState([]);
  const [selectedOperatorId, setSelectedOperatorId] = useState("");

  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState("");

  const [loadingProductTypes, setLoadingProductTypes] = useState(false);
  const [loadingOperators, setLoadingOperators] = useState(false);
  const [loadingVariations, setLoadingVariations] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const firstPinRef = useRef(null);
  const dropdownRef = useRef(null);
  const successAudio = new Audio("/success.mp3");

  

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const result = await fetchInternationalAirtimeCountries();
        if (result.success) {
          setCountries(result.countries);
          setFilteredCountries(result.countries);
          setSelectedCountry(result.countries[0] || null);
        } else {
          toast.error(result.message || "Failed to fetch countries");
        }
      } catch (error) {
        console.error("Error loading countries:", error);
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadProductTypes = async () => {
      if (!selectedCountry?.code) return;
      setLoadingProductTypes(true);
      try {
        const result = await fetchInternationalProductTypes(selectedCountry.code);
        if (result.success) {
          setProductTypes(result.productTypes);
          setSelectedProductType(result.productTypes[0]?.product_type_id || "");
        } else {
          setProductTypes([]);
          setSelectedProductType("");
        }
      } catch (error) {
        setProductTypes([]);
        setSelectedProductType("");
      } finally {
        setLoadingProductTypes(false);
      }
      setOperators([]);
      setSelectedOperatorId("");
      setVariations([]);
      setSelectedVariation("");
    };
    loadProductTypes();
  }, [selectedCountry]);

  useEffect(() => {
    const loadOperators = async () => {
      if (!selectedProductType || !selectedCountry?.code) return;
      setLoadingOperators(true);
      try {
        const result = await fetchInternationalOperators(
          selectedCountry.code,
          selectedProductType
        );
        
      if (result?.success) {
        const operatorsData = result.operators || [];
        setOperators(operatorsData);
        setSelectedOperatorId(operatorsData[0]?.operator_id || "");
      } else {
        setOperators([]);
        setSelectedOperatorId("");
        toast.error(result?.message || "Failed to fetch operators");
      }
    } catch (error) {
      console.error("Error fetching operators:", error);
      setOperators([]);
      setSelectedOperatorId("");
    } finally {
      setLoadingOperators(false);
    }
    setVariations([]);
    setSelectedVariation("");
  };
  
  loadOperators();
}, [selectedProductType, selectedCountry?.code]);

  useEffect(() => {
    const loadVariations = async () => {
      if (!selectedOperatorId || !selectedProductType) return;
      setLoadingVariations(true);
      try {
        const result = await fetchInternationalVariations(
          selectedOperatorId,
          selectedProductType
        );
        if (result.success) {
          setVariations(result.variations);
          setSelectedVariation(result.variations[0]?.variation_code || "");
        } else {
          setVariations([]);
          setSelectedVariation("");
        }
      } catch (error) {
        setVariations([]);
        setSelectedVariation("");
      } finally {
        setLoadingVariations(false);
      }
    };
    loadVariations();
  }, [selectedOperatorId, selectedProductType]);

  useEffect(() => {
    const selected = variations.find((v) => v.variation_code === selectedVariation);
    if (selected?.fixedPrice === "Yes" && selected?.variation_amount) {
      setAmount(selected.variation_amount.toString());
    } else {
      setAmount("");
    }
  }, [selectedVariation, variations]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCountries(
      countries.filter((c) => c.name.toLowerCase().includes(term))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCountry) return toast.error("Select a country");
    if (!selectedProductType) return toast.error("Select a product type");
    if (!selectedOperatorId) return toast.error("Select an operator");
    if (!selectedVariation) return toast.error("Select a variation");
    if (!phone) return toast.error("Enter a phone number");
    if (!/^\d+$/.test(phone)) return toast.error("Phone number must contain only digits");
    if (!amount) return toast.error("Enter an amount");
    if (!/^\d*\.?\d+$/.test(amount)) return toast.error("Amount must be a valid number");
    if (Number(amount) < 1) return toast.error("Minimum amount is ₦1");
    setShowPinModal(true);
  };

  const handleConfirmPurchase = async () => {
    setShowPinModal(false);
    setLoading(true);
    try {
      const payload = {
        phone: Number(phone),
        amount: Number(amount),
        countryCode: selectedCountry.code,
        productTypeId: selectedProductType,
        variationCode: selectedVariation,
        operatorId: selectedOperatorId,
        pin,
        email,
      };

      const res = await internationalPurchase(payload);

      if (res.success) {
        successAudio.play();
        toast.success(res.message || "Airtime sent successfully!");
        setPhone("");
        setAmount("");
        setEmail("");
      } else {
        toast.error(res.message || "Airtime purchase failed.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during purchase");
    } finally {
      setLoading(false);
      setPin("");
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-md">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Spinner size="xl" aria-label="Loading..." />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-6 space-y-4 border p-6 rounded-lg shadow-lg relative"
      >
        <ToastContainer />

        <div className="bg-primary-600 text-white p-4 rounded-lg flex space-x-3 items-start">
          <img
            src={user?.avatar}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">{user?.full_name}</h2>
            <p className="text-sm text-gray-200 font-medium">
           {webSettings?.currency}{user?.account_balance}
            </p>
          </div>
        </div>

        {/* Country Dropdown */}
        <div ref={dropdownRef}>
          <Label value="Select Country" />
          <div className="relative mt-1">
            <div
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 cursor-pointer flex items-center justify-between"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedCountry ? (
                <div className="flex items-center gap-2">
                  <img src={selectedCountry.flag} alt="flag" className="w-6 h-6" />
                  <span>{selectedCountry.name}</span>
                </div>
              ) : (
                <span>Select a country</span>
              )}
              <span className="text-sm">&#x25BC;</span>
            </div>
            {dropdownOpen && (
              <div className="absolute w-full bg-gray-800 border border-gray-700 mt-1 max-h-64 overflow-y-auto rounded-md z-50">
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full bg-gray-700 text-white px-3 py-2 border-b border-gray-600 placeholder:text-sm"
                />
                {filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setSelectedCountry(country);
                      setDropdownOpen(false);
                      setSearchTerm("");
                      setFilteredCountries(countries);
                    }}
                  >
                    <img src={country.flag} alt={country.name} className="w-5 h-5" />
                    <span className="text-sm">{country.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Type */}
        <div>
          <Label htmlFor="productType" value="Product Type" />
          <select
            id="productType"
            value={selectedProductType}
            onChange={(e) => {
              setSelectedProductType(e.target.value);
            }}
            className="w-full bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded-md text-white"
            disabled={loadingProductTypes || productTypes.length === 0}
          >
            <option value="">{productTypes.length === 0 ? "No product types available" : "Select a product type"}</option>
            {productTypes.map((type) => (
              <option
                className="bg-gray-800 hover:bg-gray-700"
                key={type.product_type_id}
                value={type.product_type_id}
              >
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Operator Dropdown */}
        <div>
          <Label htmlFor="operator" value="Operator" />
          {loadingOperators ? (
            <div className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-400">
              Loading operators...
            </div>
          ) : (
            <select
              id="operator"
              value={selectedOperatorId}
              onChange={(e) => {
                setSelectedOperatorId(e.target.value);
              }}
              className="w-full bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded-md text-white"
              disabled={operators.length === 0}
            >
              <option value="">{operators.length === 0 ? "No operators available" : "Select an operator"}</option>
              {operators.map((op) => (
                <option 
                  className="bg-gray-800 hover:bg-gray-700" 
                  key={op.operator_id} 
                  value={op.operator_id}
                >
                  {op.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Variation Dropdown */}
        <div>
          <Label htmlFor="variation" value="Variation" />
          <select
            id="variation"
            value={selectedVariation}
            onChange={(e) => setSelectedVariation(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded-md text-white"
            disabled={loadingVariations || variations.length === 0}
          >
            <option value="">{variations.length === 0 ? "No variations available" : "Select a variation"}</option>
            {variations.map((variation) => (
              <option
                className="bg-gray-800 hover:bg-gray-700"
                key={variation.variation_code}
                value={variation.variation_code}
              >
                {variation.name} – ₦
                {Number(
                  variation.charged_amount || variation.variation_amount || 0
                ).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" value="Email Address" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient's email"
            className="w-full bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded-md text-white placeholder:text-gray-500"
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" value="Phone Number" />
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setPhone(value);
            }}
            placeholder="Enter recipient's number"
            className="w-full bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded-md text-white placeholder:text-gray-500"
          />
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="amount" value="Amount (₦)" />
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, '');
              setAmount(value);
            }}
            className="w-full bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded-md text-white placeholder:text-gray-500"
            placeholder="₦100"
            disabled={
              variations.find((v) => v.variation_code === selectedVariation)?.fixedPrice === "Yes"
            }
          />
        </div>

        <Button type="submit" className="w-full bg-primary-600 text-white border-0">
          {loading ? "Processing..." : "Purchase"}
        </Button>

        {/* PIN Modal */}
        {showPinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-sm">
              <h2 className="text-white text-center text-lg font-bold mb-4">
                Enter Transaction PIN
              </h2>
              <div className="flex justify-center gap-3 mb-4">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    id={`pin-${i}`}
                    type="password"
                    maxLength={1}
                    value={pin[i] || ""}
                    ref={i === 0 ? firstPinRef : null}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d?$/.test(val)) {
                        const newPin = pin.split("");
                        newPin[i] = val;
                        setPin(newPin.join(""));
                        const next = document.getElementById(`pin-${i + 1}`);
                        if (val && next) next.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !pin[i] && i > 0) {
                        const prev = document.getElementById(`pin-${i - 1}`);
                        if (prev) prev.focus();
                      }
                    }}
                    className="w-12 h-12 text-center text-xl bg-gray-700 border border-gray-500 rounded-md text-white"
                  />
                ))}
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={() => setShowPinModal(false)}
                  className="bg-gray-600 text-white border-0"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmPurchase}
                  disabled={pin.length !== 4 || !/^\d{4}$/.test(pin)}
                  className={`bg-primary-600 text-white border-0 ${
                    pin.length !== 4 || !/^\d{4}$/.test(pin)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default InternationalAirtime;