import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import { FaInstagram, FaXTwitter, FaTelegram, FaTiktok } from "react-icons/fa6";
import { GlobalContext } from "../../../components/control/globalContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { webSettings } = useContext(GlobalContext);

  return (
    <div className="flex flex-col bg-secondary text-white">
      <div className="pc:flex tab:flex justify-between mobile:gap-4 items-start px-20 mobile:px-7 mobile:py-10">
        {/* Logo & Description */}
        <div className="w-[350px] mb-6 pc:mb-0">
          <img
            src="/image/user-logo.png"
            alt="footer-logo"
            className="w-48 h-12 object-fill mobile:w-36"
          />
          <p className="mt-4 text-[19px] mobile:text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et harum
            excepturi soluta necessitatibus saepe.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col justify-start items-start gap-2 w-40 mobile:mt-6">
          <h1 className="text-[20px] mobile:text-[17px] font-semibold pb-2 text-primary-600">Links</h1>
          <NavLink to="/become-merchant" className="relative inline-block pb-1 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-primary-600 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
            Become Merchant
          </NavLink>
          <NavLink to="/about" className="relative inline-block pb-1 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-primary-600 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
            About
          </NavLink>
          <NavLink to="/terms-of-use" className="relative inline-block pb-1 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-primary-600 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
            Terms of Use
          </NavLink>
          <NavLink to="/privacy-policy" className="relative inline-block pb-1 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-primary-600 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
            Privacy Policy
          </NavLink>
        </div>

        {/* Contact Info & Socials */}
        <div className="flex flex-col justify-start items-start w-40 mobile:mt-6 gap-2">
          <h1 className="text-[20px] mobile:text-[17px] font-semibold pb-2 text-primary-600">Contact</h1>
          <a href={`mailto:${webSettings?.support_email}`}>{webSettings?.support_email}</a>
          <div className="flex gap-4 items-center mt-2">
            <a href={webSettings?.instagram_url || '#'} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <FaInstagram className='text-[27px] mobile:text-[19px]' />
            </a>
            <a href={webSettings?.twitter_url || '#'} aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className='text-[27px] mobile:text-[19px]' />
            </a>
            <a href={webSettings?.telegram_url || '#'} aria-label="Telegram" target="_blank" rel="noopener noreferrer">
              <FaTelegram className='text-[27px] mobile:text-[19px]' />
            </a>
            <a href={webSettings?.tiktok_url || '#'} aria-label="TikTok" target="_blank" rel="noopener noreferrer">
              <FaTiktok className='text-[27px] mobile:text-[19px]' />
            </a>
          </div>

        </div>

        {/* Extra Logo & Description */}
        <div className="w-40 mobile:mt-6">
          <img
            src="/image/favicon.png"
            alt="footer-icon"
            className="w-10 h-5 object-fill"
          />
          <p className="mt-4 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus culpa
            perspiciatis sequi.
          </p>
        </div>
      </div>

      <div>
        <div className="text-center py-4 text-sm text-white bg-secondary border-t border-primary-600">
          <p>&copy; {currentYear} Speednet™. All rights reserved.</p>
          <p className="text-center text-sm text-white/50">
            <a
              href="https://wa.me/2349129079450"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block pb-1 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-primary-600 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100"
            >
              Developed by Alphatech Multimedia Technologies
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
