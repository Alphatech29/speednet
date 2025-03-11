import { Button } from "flowbite-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  return (
    <div className="header px-20 py-2 bg-white">
      <div className="flex w-full justify-between items-center pb-1 border-b-2 border-gray-200">
        <img src="" alt="Company Logo" />

        <ul className="flex space-x-10 text-base font-semibold font-sans">
          <li>
            <NavLink to="/" className="text-gray-700 hover:text-primary-600">
              Home
            </NavLink>
          </li>
          <li>
            <button
              onClick={() => handleScroll("about-us")}
              className="text-gray-700 hover:text-primary-600"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScroll("features")}
              className="text-gray-700 hover:text-primary-600"
            >
              Features
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScroll("how-it-works")}
              className="text-gray-700 hover:text-primary-600"
            >
              How it Works
            </button>
          </li>
          <li>
            <NavLink
              to="/become-a-merchant"
              className="text-gray-700 hover:text-primary-600"
            >
              Become a Merchant
            </NavLink>
          </li>
        </ul>

        <NavLink to="/login">
          <Button className="bg-primary-600 text-pay px-7 rounded-md">
            Login
          </Button>
        </NavLink>
      </div>
    </div>
  );
};

export default Header;
