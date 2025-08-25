import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "flowbite-react";
import { IoIosPersonAdd } from "react-icons/io";
import { LuLock } from "react-icons/lu";
import { AuthContext } from "../../../components/control/authContext";
import { GlobalContext } from "../../../components/control/globalContext";

const Header = () => {
  const { user } = useContext(AuthContext);
   const { webSettings } = useContext(GlobalContext);

  const getDashboardLink = () => {
    if (user?.role === "merchant") return "/user/dashboard";
    if (user?.role === "user") return "/user/marketplace";
    return "/"; 
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-yellow-50 border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-4 mobile:px-2 pc:px-20 py-3">
        {/* Logo */}
        <NavLink to="/">
          <img
            src={webSettings?.logo}
            alt="Logo"
            className="pc:w-36 mobile:w-32 pc:h-12 mobile:h-10"
          />
        </NavLink>

        {/* Conditional Navigation */}
        {user ? (
          <NavLink to={getDashboardLink()}>
            <Button className="bg-primary-600 text-white border-0">
              Dashboard
            </Button>
          </NavLink>
        ) : (
          <div className="flex items-center gap-3">
            <NavLink to="/auth/login">
              <Button className="bg-yellow-50 border-primary-600 text-primary-600">
                <LuLock className="mr-2 mt-1" />
                Sign In
              </Button>
            </NavLink>

            <NavLink to="/auth/register">
              <Button className="bg-primary-600 text-white border-0">
                <IoIosPersonAdd className="mr-2 mt-1" />
                Sign Up
              </Button>
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
