import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import { FaInstagram, FaXTwitter, FaTelegram, FaTiktok } from "react-icons/fa6";
import { GlobalContext } from "../../../components/control/globalContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { webSettings } = useContext(GlobalContext);

  return (
    <div className="flex flex-col bg-secondary text-white w-full">
      {/* Top Section */}
      <div className="flex flex-col gap-8 pc:flex-row tab:flex-row justify-between items-start pc:px-20 tab:px-14 mobile:px-7 py-10">

        {/* Logo & Description */}
        <div className="pc:w-[30%] tab:w-[40%] w-full">
          <img
            src="/image/user-logo.png"
            alt="footer-logo"
            className="w-48 h-12 object-fill mobile:w-36"
          />
          <p className="mt-4 text-[16px]  mobile:text-sm">
            Unlock the power of digital freedom with Speednet. Buy verified accounts, access virtual numbers, secure VPNs, and more all with safety, speed, and transparency. Connect globally, thrive locally, and take control of your online experience today.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col justify-start items-start gap-2 pc:w-[15%] tab:w-[25%] w-full">
          <h1 className="text-[20px] tab:text-[18px] mobile:text-[17px] font-semibold pb-2 text-primary-600">
            Links
          </h1>

          {[
            "/become-merchant",
            "/about",
            "/page/terms-of-use",
            "/page/privacy-policy",
          ].map((link, i) => {
            // Remove leading `/` or `/page/`, then format remaining slug to readable title
            const label = link
              .replace(/^\/(page\/)?/, '')               // remove leading / or /page/
              .split('-')                                // split by dash
              .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
              .join(' ');                                // join with space

            return (
              <NavLink
                key={i}
                to={link}
                className="relative inline-block pb-1 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-primary-600 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100"
              >
                {label}
              </NavLink>
            );
          })}
        </div>


        {/* Contact Info & Socials */}
        <div className="flex flex-col justify-start items-start gap-2 pc:w-[20%] tab:w-[25%] w-full">
          <h1 className="text-[20px] tab:text-[18px] mobile:text-[17px] font-semibold pb-2 text-primary-600">Contact</h1>
          <a href={`mailto:${webSettings?.support_email}`} className="break-words">{webSettings?.support_email}</a>
          <div className="flex gap-4 items-center mt-2">
            <a href={webSettings?.instagram_url || '#'} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <FaInstagram className='text-[27px] tab:text-[22px] mobile:text-[19px]' />
            </a>
            <a href={webSettings?.twitter_url || '#'} aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className='text-[27px] tab:text-[22px] mobile:text-[19px]' />
            </a>
            <a href={webSettings?.telegram_url || '#'} aria-label="Telegram" target="_blank" rel="noopener noreferrer">
              <FaTelegram className='text-[27px] tab:text-[22px] mobile:text-[19px]' />
            </a>
            <a href={webSettings?.tiktok_url || '#'} aria-label="TikTok" target="_blank" rel="noopener noreferrer">
              <FaTiktok className='text-[27px] tab:text-[22px] mobile:text-[19px]' />
            </a>
          </div>
        </div>

        {/* Address & Phone */}
        <div className="flex flex-col justify-start items-start gap-2 pc:w-[25%] tab:w-[30%] w-full">
          <h1 className="text-[20px] tab:text-[18px] mobile:text-[17px] font-semibold pb-2 text-primary-600">Find Us</h1>
          <p className='text-[16px] tab:text-[15px] mobile:text-[14px] flex items-start gap-3'>
            {webSettings?.address}
          </p>
          <p className='text-[16px] tab:text-[15px] mobile:text-[14px] flex items-start gap-3'>
            {webSettings?.contact_number}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center py-4 text-sm text-white bg-secondary border-t border-primary-600">
        <p>&copy; {currentYear} {webSettings?.site_name}™. All rights reserved.</p>
        {/*
        <p className="text-center text-sm text-white/50 mt-1">
          <a
            href="https://wa.me/2349129079450"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block pb-1 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-primary-600 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100"
          >
            Developed by Alphatech Multimedia Technologies
          </a>
        </p>
         */}
      </div>


      {webSettings?.footer_code && (
        <div dangerouslySetInnerHTML={{ __html: webSettings.footer_code }} />
      )}
    </div>
  );
};

export default Footer;
