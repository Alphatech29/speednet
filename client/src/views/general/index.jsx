import React from 'react';
import { motion } from 'framer-motion';
import { Button } from 'flowbite-react';
import { GrShieldSecurity } from "react-icons/gr";
import { TbSocial } from "react-icons/tb";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { RiP2pFill } from "react-icons/ri";


const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="mobile:px-5 pc:px-20 bg-yellow-50">
        <div className="flex flex-col mobile:h-svh tab:h-[700px] justify-center items-center">
          <motion.div
            className="mobile:w-full pc:px-32 mobile:py-10"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="mobile:text-[27px] pc:text-[3rem] font-bold text-gray-800 text-center">
              Explore Unique Accounts in Our Marketplace – Get Cheap Data & Airtime, Including International Purchases!
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mt-2 text-center">
              Take control of your online presence: Discover, verify, and purchase genuine accounts on Speednet.
            </p>
            <div className="w-full flex justify-center items-center">
              <a href="/auth/register">
                <Button className="bg-primary-600 text-pay px-7 mt-8 md:mt-10 rounded-md border-0">
                  Get Started
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Section 1 */}
      <div className="mobile:px-6 pc:px-20 tab:py-16 mobile:py-20 pc:py-24 bg-primary-600/5 flex mobile:flex-col pc:flex-row tab:flex-row justify-between items-center gap-10">
        <motion.div
          className="mobile:w-full pc:w-1/2 tab:w-1/2"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/image/nord.png"
            alt="Speednet VPN Marketplace"
            className="w-full h-auto object-cover"
          />
        </motion.div>

        <motion.div
          className="mobile:w-full pc:w-1/2 tab:w-1/2 text-[28px] mobile:text-[24px] text-gray-800 font-semibold"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>
            Speednet: Your Trusted Accounts Marketplace – Buy, Sell, and Discover Authentic Accounts with Ease!
          </h2>
          <p className="mt-2 text-gray-700 mobile:text-[16px] font-normal text-[20px]">
            At Speednet, we champion community-driven commerce. Our platform empowers individuals to buy and sell verified digital accounts easily. With a focus on safety, transparency, and user freedom, Speednet is where trust meets opportunity  connecting real people to real value.
          </p>
          <p className="mt-2 text-gray-700 mobile:text-[16px] font-normal text-[20px]">
            Whether you're buying or selling, our seamless system ensures fairness. We provide tools, exposure, and security for users to grow, trade, and thrive in the digital economy.
          </p>
          <div className="flex items-end">
            <a href="/auth/register">
              <Button className="bg-primary-600 text-pay px-7 mt-8 tab:mt-10 pc:mt-10 rounded-md">
                Get Started
              </Button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Consolidated Feature Section: VPNs / SMS / P2P */}
      <motion.div
        className="px-6 sm:px-10 pc:px-20 py-16 sm:py-20 pc:py-24 bg-primary-600/5 border-t-[1px] border-yellow-800/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="flex mobile:flex-col tab:flex-row justify-between items-center pt-8 md:pt-16 gap-6">

          {/* VPNs & Logs */}
          <div className="flex-1">
            <span className="flex flex-col items-center gap-2 text-lg font-semibold text-gray-800">
              <GrShieldSecurity className="text-[40px] text-primary-600" />
              VPNs & Secure Logs
            </span>
            <p className="mt-2 text-gray-700 text-sm text-center ">
              Access premium VPNs and logs for secure browsing, identity protection, and encrypted access—perfect for individuals and teams.
            </p>
          </div>

          {/* Virtual SMS & OTP */}
          <div className="flex-1">
            <span className="flex flex-col items-center gap-2 text-lg font-semibold text-gray-800">
              <MdOutlinePhoneAndroid className="text-[40px] text-primary-600" />
              Virtual SMS & OTP Numbers
            </span>
            <p className="mt-2 text-gray-700 text-sm text-center">
              Instantly receive OTPs and SMS verifications globally. Our virtual numbers and eSIMs work seamlessly across platforms and locations.
            </p>
          </div>

          {/* P2P Platform */}
          <div className="flex-1">
            <span className="flex flex-col items-center gap-2 text-lg font-semibold text-gray-800">
              <RiP2pFill className="text-[40px] text-primary-600" />
              Peer-to-Peer Trading
            </span>
            <p className="mt-2 text-gray-700 text-sm text-center">
              Trade digital assets and accounts securely through Speednet’s P2P system with escrow and dispute resolution included.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Feature Section 2: Virtual Number */}
      <div className="mobile:px-6 pc:px-20 tab:py-16 mobile:py-20 pc:py-24 bg-primary-600/5 flex mobile:flex-col pc:flex-row tab:flex-row justify-between items-center gap-10">
        <motion.div
          className="mobile:w-full pc:w-1/2 tab:w-1/2 text-[28px] mobile:text-[24px] text-gray-800 font-semibold"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>
            Speednet: Global Virtual Numbers – Instantly Receive OTPs and Activate eSIMs Anywhere!
          </h2>
          <p className="mt-2 text-gray-700 mobile:text-[16px] font-normal text-[20px]">
            Simplify global communication with our virtual numbers and eSIM tech. Receive OTPs, SMS verifications, and messages securely across devices and borders.
          </p>
          <p className="mt-2 text-gray-700 mobile:text-[16px] font-normal text-[20px]">
            Whether for travel, business, or security, Speednet gives you control with temporary and long-term eSIM support—trusted by thousands globally.
          </p>
          <div className="flex items-end">
            <a href="/auth/register">
              <Button className="bg-primary-600 text-pay px-7 mt-8 tab:mt-10 pc:mt-10 rounded-md">
                Get Your Number
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
          className="mobile:w-full pc:w-1/2 tab:w-1/2"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/image/nord.png"
            alt="eSIM and Virtual Number Service"
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </div>

      {/* Final Feature Set: Logs / VTU / Payment */}
      <motion.div
        className="px-6 sm:px-10 md:px-20 py-16 sm:py-20 md:py-24 bg-primary-600/5 border-t-[1px] border-yellow-800/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="flex mobile:flex-col tab:flex-row justify-between items-center pt-8 md:pt-16 gap-6">

          {/* Social Media & Logs */}
          <div className="flex-1">
            <span className="flex flex-col items-center gap-2 text-lg font-semibold text-gray-800">
              <TbSocial className="text-[40px] text-primary-600" />
              Social Media & Logs
            </span>
            <p className="mt-2 text-gray-700 text-sm text-center">
              Access verified accounts and clean logs for platforms like Gmail, Facebook, IG, etc.—great for marketers and entrepreneurs.
            </p>
          </div>

          {/* VTU Recharge */}
          <div className="flex-1">
            <span className="flex flex-col items-center gap-2 text-lg font-semibold text-gray-800">
              <MdOutlinePhoneAndroid className="text-[40px] text-primary-600" />
              VTU Recharge (Local & Global)
            </span>
            <p className="mt-2 text-gray-700 text-sm text-center">
              Top-up airtime or data instantly for any network in Nigeria and abroad. Speedy, secure, and reliable virtual top-ups.
            </p>
          </div>

          {/* Payment & Deposit */}
          <div className="flex-1">
            <span className="flex flex-col items-center gap-2 text-lg font-semibold text-gray-800">
              <FaMoneyCheckAlt className="text-[40px] text-primary-600" />
              Payment & Deposit
            </span>
            <p className="mt-2 text-gray-700 text-sm text-center">
              Fund your wallet using flexible methods—cards, crypto, or bank. Enjoy smooth, secured deposits for all your Speednet purchases.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Home;
