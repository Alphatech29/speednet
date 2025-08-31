import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Button, Spinner } from "flowbite-react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getSmsPoolCountries,
  getSmsPoolServicesByCountry,
  buySmsPoolNumber,
} from "../../../components/backendApis/sms-service/sms-service";

const GetNumber = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [buyingServiceId, setBuyingServiceId] = useState(null);
  const [error, setError] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  const fetchCountries = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getSmsPoolCountries();
      if (result?.success && Array.isArray(result.data)) {
        const options = result.data
          .map((c) => ({
            value: String(c.ID),
            label: c.name,
            alphaCode: String(c.short_name).toLowerCase(),
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(options);

        const defaultCountry = options.find((c) => c.value === "1") || options[0];
        setSelectedCountry(defaultCountry);
        if (defaultCountry) fetchServices(Number(defaultCountry.value));
      } else {
        throw new Error("No countries found");
      }
    } catch (err) {
      const errMsg = err.message || "Error fetching countries";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (countryId) => {
    setServiceLoading(true);
    setError("");
    try {
      const result = await getSmsPoolServicesByCountry(Number(countryId));
      setServices(Array.isArray(result) ? result : []);
    } catch (err) {
      setServices([]);
      const errMsg = err.message || "Error fetching services";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    fetchServices(Number(country.value));
  };

 const handleBuyNumber = async (service) => {
  setBuyingServiceId(service.ID);
  try {
    const payload = {
      service: Number(service.ID),
      country: Number(selectedCountry.value),
      pool: service.pool,
      price: Number(service.price),
    };

    console.log("buySmsPoolNumber payload:", payload);

    const response = await buySmsPoolNumber(payload);

    console.log("buySmsPoolNumber response:", response);

    if (response?.success) {
      toast.success(response.message || "Number purchased successfully");
      setTimeout(() => navigate("/user/sms-service"), 1000);
    } else {
      toast.error(response.message || "Failed to buy number");
    }
  } catch (err) {
    toast.error(err.message);
  } finally {
    setBuyingServiceId(null);
  }
};


  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-400 text-black px-1 rounded">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-2 tab:p-4 pc:p-4 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <ToastContainer position="top-right" autoClose={4000} />
      <h2 className="text-2xl font-extrabold mb-6 text-center tracking-wide">
        Get Your SMS Number
      </h2>

      <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg pc:p-6 tab:p-6 p-2 border border-gray-700">
        <div className="flex items-center mb-6">
          <NavLink
            to="/user/sms-service"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <IoIosArrowRoundBack className="w-5 h-5 mr-1" /> Back
          </NavLink>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-6">
            <p className="mb-4 text-red-400">{error}</p>
            <Button onClick={fetchCountries}>Retry</Button>
          </div>
        ) : (
          <>
            <div className="flex md:flex-row gap-4">
              <div className="flex-1">
                <Select
                  options={countries}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  placeholder="Select country..."
                  isSearchable
                  formatOptionLabel={(option) => (
                    <div className="flex items-center gap-2">
                      <img src={`https://flagcdn.com/h40/${option.alphaCode}.png`} alt={option.label} className="w-5 h-5 rounded-full" />
                      <span>{option.label}</span>
                    </div>
                  )}
                  styles={{
                    control: (provided) => ({ ...provided, backgroundColor: "#1F2937" }),
                    singleValue: (provided) => ({ ...provided, color: "#FFFFFF" }),
                    menu: (provided) => ({ ...provided, backgroundColor: "#111827" }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused ? "#F66B04" : "#111827",
                      color: state.isFocused ? "#FFFFFF" : "#E5E7EB",
                      cursor: "pointer",
                    }),
                    placeholder: (provided) => ({ ...provided, color: "#9CA3AF" }),
                    dropdownIndicator: (provided) => ({ ...provided, color: "#F66B04" }),
                    indicatorSeparator: (provided) => ({ ...provided, backgroundColor: "#374151" }),
                  }}
                />
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search service..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {serviceLoading ? (
              <div className="flex justify-center mt-6">
                <Spinner size="lg" />
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-4 gap-3 mt-6">
                {filteredServices.map((service) => (
                  <div
                    key={service.ID}
                    className="bg-gray-900/60 border border-gray-700 rounded-xl p-5 flex flex-col justify-between hover:scale-105 transition-all"
                  >
                    <h2 className="font-bold text-[15px]">
                      {highlightText(service.name, serviceSearch)}
                    </h2>
                    <p className="text-[13px] text-gray-300">{selectedCountry?.label}</p>
                    <div className="flex justify-between mt-4">
                      <span>Pool: {service.pool}</span>
                      <span className="font-bold text-green-400">${parseFloat(service.price).toFixed(2)}</span>
                    </div>
                    <Button
                      size="sm"
                      className="mt-3 w-full bg-gradient-to-r from-primary to-orange-500 text-white"
                      onClick={() => handleBuyNumber(service)}
                      disabled={buyingServiceId === service.ID}
                    >
                      {buyingServiceId === service.ID ? "Buying..." : "Buy Now"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-center text-gray-400">No services match your search.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GetNumber;
