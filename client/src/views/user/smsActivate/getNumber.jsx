import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Button } from "flowbite-react";
import Select from "react-select";

import {
  getSmsManCountries,
  getSmsManServices,
  getSmsManServicesWithPrices,
} from "../../../components/backendApis/sms-service/sms-service";

const customSelectStyles = {
  menu: (base) => ({
    ...base,
    maxHeight: 400,
    backgroundColor: "#374151",
    color: "#d1d5db",
    zIndex: 50,
  }),
  control: (base) => ({
    ...base,
    backgroundColor: "#374151",
    borderColor: "#4b5563",
    color: "#d1d5db",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
  }),
  input: (base) => ({
    ...base,
    color: "#d1d5db",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? "#1f2937"
      : isFocused
      ? "#4b5563"
      : "transparent",
    color: "#fff",
  }),
};

const GetNumber = () => {
  const [country, setCountry] = useState(null);
  const [service, setService] = useState(null);

  const [countryOptions, setCountryOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);

  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingServicesWithPrices, setLoadingServicesWithPrices] = useState(false);

  const [servicesWithPrices, setServicesWithPrices] = useState([]);

  // Fetch countries & services on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const res = await getSmsManCountries();
        if (res.success && Array.isArray(res.data)) {
          const options = res.data.map((c) => ({
            label: c.name,
            value: c.id,
            code: c.code,
          }));
          setCountryOptions(options);

          // ✅ Auto-select USA by ID = 6
          if (!country && options.length > 0) {
            const usa = options.find((c) => c.value === 6);
            setCountry(usa || options[6]);
          }
        } else {
          console.error("Failed to load countries:", res.message || res);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    };

    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const res = await getSmsManServices();
        if (res.success && Array.isArray(res.data)) {
          const options = res.data.map((s) => ({
            label: s.name,
            value: s.code,
          }));
          setServiceOptions(options);
        } else {
          console.error("Failed to load services:", res.message || res);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchCountries();
    fetchServices();
  }, []);

  // Fetch services with prices when country changes
  useEffect(() => {
    const fetchServicesWithPrices = async () => {
      if (!country) return;
      setLoadingServicesWithPrices(true);
      try {
        const res = await getSmsManServicesWithPrices(country.value);
        if (res.success && Array.isArray(res.data)) {
          setServicesWithPrices(res.data);
        } else {
          console.error("Failed to fetch services with prices:", res.message || res);
          setServicesWithPrices([]);
        }
      } catch (err) {
        console.error("Error fetching services with prices:", err);
        setServicesWithPrices([]);
      } finally {
        setLoadingServicesWithPrices(false);
      }
    };

    fetchServicesWithPrices();
    setService(null); // Reset selected service when country changes
  }, [country]);

  const displayedServices = useMemo(() => {
    if (!service) return servicesWithPrices;
    return servicesWithPrices.filter((s) => s.code === service.value);
  }, [servicesWithPrices, service]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-300">Get Number</h2>
      <div className="bg-gray-800 rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex justify-end items-end text-gray-300">
            <NavLink
              to="/user/sms-service"
              className="flex items-center text-primary w-fit"
            >
              <IoIosArrowRoundBack className="w-4 h-4 mr-2" />
              Back to SMS Service
            </NavLink>
          </div>

          <div className="flex justify-end gap-2 items-center">
            {/* Country */}
            <div className="w-[40%]">
              <p className="text-gray-400 mb-2">Select a country</p>
              <Select
                options={countryOptions}
                value={country}
                onChange={setCountry}
                styles={customSelectStyles}
                placeholder={loadingCountries ? "Loading..." : "Search country..."}
                isLoading={loadingCountries}
                isDisabled={loadingCountries}
                formatOptionLabel={(e) => (
                  <div className="flex items-center gap-2">
                    {e.code && (
                      <img
                        src={`https://flagcdn.com/w40/${e.code.toLowerCase()}.png`}
                        alt={e.label}
                        className="w-5 h-5 rounded-full object-fill"
                      />
                    )}
                    {e.label}
                  </div>
                )}
                getOptionValue={(e) => String(e.value)}
              />
            </div>

            {/* Service */}
            <div className="w-[40%] border-gray-600 p-3">
              <p className="text-gray-400 mb-2">Select a service</p>
              <Select
                options={serviceOptions}
                value={service}
                onChange={setService}
                styles={customSelectStyles}
                placeholder={loadingServices ? "Loading..." : "Search..."}
                isLoading={loadingServices}
                isDisabled={loadingServices}
                isClearable
              />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-6">
          <div className="flex-wrap flex gap-4 items-center justify-start">
            {loadingServicesWithPrices ? (
              <p className="text-gray-400">Loading services...</p>
            ) : displayedServices.length === 0 ? (
              <p className="text-gray-400">
                No services available for the selected filters.
              </p>
            ) : (
              displayedServices.map((svc) => (
                <div
                  key={`${svc.code}-${svc.id || svc.name}`}
                  className="space-y-2 border border-gray-600 rounded-md px-4 py-3 pc:w-[32%] mobile:w-full"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={`/images/services/${svc.code}.png`}
                      alt={svc.name}
                      className="w-7 h-7 rounded-full object-fill"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="text-gray-300 w-full">
                      <h1 className="font-semibold">{svc.name}</h1>
                      <p className="text-[12px] text-gray-500">{country?.label}</p>
                      <div className="flex justify-between items-center mt-2 text-[12px]">
                        <span>Price: ${svc.cost}</span>
                        <span>Available: {svc.available ?? svc.numbers}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary-600 text-white py-1 w-full rounded-md hover:bg-primary-700 transition duration-200"
                    onClick={() => {
                      console.log("Get Number clicked", {
                        country,
                        service: svc,
                      });
                    }}
                  >
                    Get Number
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetNumber;
