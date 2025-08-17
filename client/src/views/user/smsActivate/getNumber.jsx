import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Button, Spinner } from "flowbite-react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getSmsManCountries,
  getOnlineSimServicesByCountry,
  buyOnlineSimNumber,
} from "../../../components/backendApis/sms-service/sms-service";

const GetNumber = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [buyingServiceId, setBuyingServiceId] = useState(null);
  const [error, setError] = useState("");

  const countryMap = useMemo(() => {
    const map = {};
    countries.forEach((c) => {
      map[c.value] = { name: c.name, code: c.value };
    });
    return map;
  }, [countries]);

  const fetchCountries = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getSmsManCountries();
      if (result?.countries && typeof result.countries === "object") {
        const countryList = Object.values(result.countries);

        // Map and sort alphabetically
        const options = countryList
          .map((country) => {
            const numericCode = country.phone_code || country.code || "";
            const alphaCode = String(country.code || "").toLowerCase();

            return {
              value: String(numericCode),
              label: country.name, // plain string for search
              name: country.name,
              alphaCode, // for flag display
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));

        setCountries(options);

        if (options.length > 0) {
          const countryOne = options.find((c) => c.value === "1");
          if (countryOne) setSelectedCountry(countryOne.value);
        }
      } else {
        const errMsg = "No countries found in API response";
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      const errMsg = err.message || "Unexpected error fetching countries";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (countryCode) => {
    setServiceLoading(true);
    setError("");
    try {
      const result = await getOnlineSimServicesByCountry(countryCode);
      if (result?.response === 1 && result?.services) {
        setServices(Object.values(result.services));
      } else {
        setServices([]);
        const errMsg = "No services found for this country.";
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      const errMsg = err.message || "Unexpected error fetching services";
      setError(errMsg);
      setServices([]);
      toast.error(errMsg);
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) fetchServices(selectedCountry);
    else setServices([]);
  }, [selectedCountry]);

  const handleBuyNumber = async (service) => {
    setBuyingServiceId(service.service);

    try {
      const payload = {
        service: service.service,
        country: selectedCountry,
        price: service.price,
      };

      const response = await buyOnlineSimNumber(payload);

      if (response.response === 1) {
        toast.success(response.message);
        console.log("Purchased number:", response.data?.number);

        // Redirect back after 1 second
        setTimeout(() => {
          navigate("/user/sms-service");
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBuyingServiceId(null);
    }
  };

  return (
    <div className="p-4 pc:p-4 mobile:p-1 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <ToastContainer position="top-right" autoClose={4000} />
      <h2 className="text-2xl font-extrabold mb-6 text-center tracking-wide">
        Get Your SMS Number
      </h2>

      <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg pc:p-6 mobile:py-6 mobile:px-1 border border-gray-700">
        <div className="pc:flex items-center justify-between mb-6 mobile:hidden">
          <NavLink
            to="/user/sms-service"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <IoIosArrowRoundBack className="w-5 h-5 mr-1" />
            Back
          </NavLink>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <Spinner size="xl" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-400 py-6">
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchCountries}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-6">
            {/* Country Selector */}
            <div>
              <Select
                options={countries}
                placeholder="Search country..."
                className="w-full min-w-[250px] text-black"
                styles={{
                  control: (base) => ({ ...base, borderRadius: "0.75rem", padding: "2px" }),
                }}
                value={countries.find((c) => c.value === selectedCountry) || null}
                onChange={(option) => setSelectedCountry(option?.value)}
                isSearchable={true}
                formatOptionLabel={(option) => (
                  <div className="flex items-center gap-2">
                    {option.alphaCode && (
                      <img
                        src={`https://flagcdn.com/h40/${option.alphaCode}.png`}
                        alt={option.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    )}
                    <span>{option.name}</span>
                  </div>
                )}
              />
            </div>

            {/* Services Grid */}
            {serviceLoading ? (
              <div className="flex justify-center">
                <Spinner size="lg" />
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-4 gap-3">
                {services.map((service, index) => {
                  const countryInfo = countryMap[service.code];
                  return (
                    <div
                      key={index}
                      className="rounded-xl bg-gray-900/60 border border-gray-700 p-5 hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <h2 className="font-bold text-[15px]">{service.service}</h2>
                        <div className="flex items-center gap-2 text-[13px] text-gray-400 mt-1">
                          <span>{countryInfo?.name}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm">Available: {service.count || 0}</span>
                        <span className="text-sm font-bold text-green-400">
                          ${service.price?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-orange-500 py-1 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                        onClick={() => handleBuyNumber(service)}
                        disabled={buyingServiceId === service.service}
                      >
                        {buyingServiceId === service.service ? (
                          <>
                            <Spinner size="sm" /> Buying...
                          </>
                        ) : (
                          "Buy Now"
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              selectedCountry && (
                <div className="mt-4 bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-gray-400">No services available for the selected country.</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetNumber;
