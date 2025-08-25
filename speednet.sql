-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:9030
-- Generation Time: Aug 24, 2025 at 12:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `speednet`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `platform` varchar(255) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `recovery_email` varchar(100) DEFAULT NULL,
  `recoveryEmailpassword` varchar(255) DEFAULT NULL,
  `additionalEmail` varchar(100) DEFAULT NULL,
  `additionalPassword` varchar(255) DEFAULT NULL,
  `previewLink` varchar(255) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `category` varchar(100) NOT NULL DEFAULT 'Other',
  `subscription_status` varchar(50) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `two_factor_description` varchar(255) DEFAULT NULL,
  `status` enum('approved','under reviewing','sold','rejected') NOT NULL DEFAULT 'under reviewing',
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `user_id`, `title`, `platform`, `logo_url`, `email`, `recovery_email`, `recoveryEmailpassword`, `additionalEmail`, `additionalPassword`, `previewLink`, `username`, `password`, `description`, `price`, `category`, `subscription_status`, `expiry_date`, `two_factor_enabled`, `two_factor_description`, `status`, `create_at`, `updated_at`) VALUES
(3, 4, 'Twitter Account with 100+ followers. Direct login access (no email). Registered from mixed IP addresses, between 2015–2021.', 'Facebook', 'https://sendshort.ai/wp-content/uploads/2024/08/Facebook-1536x861.jpeg', 'N/A', 'itodogabriel40@gmail.com', '1234567', 'itodogabriel40@gmail.com', '123565r', 'https://f99a-105-119-0-65.ngrok-free.app/user/add-product', 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 20.00, 'Other', 'expired', NULL, 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 'approved', '2025-05-11 15:12:49', '2025-08-21 20:12:56'),
(4, 4, 'Twitter Account with 100+ followers. Direct login access (no email). Registered from mixed IP addresses, between 2015–2021.', 'Facebook', 'https://sendshort.ai/wp-content/uploads/2024/08/Facebook-1536x861.jpeg', 'N/A', 'itodogabriel40@gmail.com', '1234567', 'itodogabriel40@gmail.com', '123565r', 'https://f99a-105-119-0-65.ngrok-free.app/user/add-product', 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 20.00, 'Other', 'expired', NULL, 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 'approved', '2025-05-11 15:24:37', '2025-08-21 20:13:02'),
(5, 4, 'Twitter Account with 100+ followers. Direct login access (no email). Registered from mixed IP addresses, between 2015–2021.', 'Facebook', 'https://sendshort.ai/wp-content/uploads/2024/08/Facebook-1536x861.jpeg', 'N/A', 'itodogabriel40@gmail.com', '1234567', 'itodogabriel40@gmail.com', '123565r', 'https://f99a-105-119-0-65.ngrok-free.app/user/add-product', 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 20.00, 'Other', 'expired', NULL, 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 'approved', '2025-05-11 15:29:14', '2025-08-21 20:13:09'),
(6, 4, 'hbdgv,jkbg sYV A', 'Facebook', 'https://sendshort.ai/wp-content/uploads/2024/08/Facebook-1536x861.jpeg', 'N/A', 'itodogabriel40@gmail.com', 'udfe8fefidjof', 'itodogabriel40@gmail.com', 'sdvbeberge', 'https://f99a-105-119-0-65.ngrok-free.app/user/add-product', 'Alphat', '14424', 'ADVABSFBFSS', 20.00, 'Other', 'none', NULL, 1, 'ugvduivvjv', 'sold', '2025-05-11 15:38:27', '2025-07-06 21:46:30'),
(7, 4, 'dfdgfddgf', 'X-App', '/uploads/platform-1750271652237.png', 'text@gmail.com', 'text@gmail.com', '465465y5', 'text@gmail.com', '57y7676', 'ffgfhgfhgfh', 'N/A', '465trytytytyt', 'gdgffrgfgfgfggdfgfg', 20.00, 'Other', 'active', '2025-06-19', 1, 'rgrgryryytuhyhghhjhjgyjghhghrtjkyjgfhthjgfjfgjhfgkiyuokuhkghjyfjyf', 'sold', '2025-06-18 18:42:45', '2025-07-06 17:32:47'),
(10, 4, '3534667787667', 'Express', '/uploads/platform-1751416249974.png', 'itodogabriel40@gmail.com', 'itodogabriel40@gmail.com', 'retfgerwfcvdefwrfre', 'itodogabriel40@gmail.com', 'regtretgfgds', 'https://f99a-105-119-0-65.ngrok-free.app/user/add-product', 'N/A', 'refgerferfsw', 'tretreterffewfcwefcvwedcfvdcc sxdc xd szs', 20.00, 'Other', 'none', NULL, 0, 'N/A', 'sold', '2025-07-03 14:40:17', '2025-07-06 21:46:30'),
(11, 4, '436ftghgfhnghbgfbgf', 'Facebook', '/uploads/platform-1751416173996.png', 'itodogabriel40@gmail.com', 'itodogabriel40@gmail.com', 'trhytrutu6truhry', 'itodogabriel40@gmail.com', 'ertyytygtgyrtg', 'https://f99a-105-119-0-65.ngrok-free.app/user/add-product', 'N/A', 'dfhgfthfhgfhbfd', 'gfgfhbfhbdgvfdgfrdvgsd', 20.00, 'Other', 'none', NULL, 0, 'N/A', 'sold', '2025-07-03 14:45:08', '2025-07-06 17:14:16'),
(12, 4, 'oiploi;liio;loi', 'Facebook', '/uploads/platform-1751416173996.png', 'test@gmail.com', 'itodogabriel40@gmail.com', 'sdfdsfdsf', 'itodogabriel40@gmail.com', 'ddffd', 'https://f99a-105-119-0-65.ngrok-free.app/user/add-product', 'Gabjdjhdffgf', '332143432', 'o9ppo;o', 20.00, 'Other', 'none', NULL, 0, 'N/A', 'sold', '2025-08-13 12:06:41', '2025-08-13 13:28:43');

-- --------------------------------------------------------

--
-- Table structure for table `account_order`
--

CREATE TABLE `account_order` (
  `id` bigint(20) NOT NULL,
  `account_id` bigint(20) NOT NULL,
  `seller_id` bigint(20) NOT NULL,
  `buyer_id` bigint(20) NOT NULL,
  `order_no` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `platform` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `recovery_email` varchar(100) DEFAULT NULL,
  `recovery_email_password` varchar(255) DEFAULT NULL,
  `additional_email` varchar(255) DEFAULT NULL,
  `additional_password` varchar(255) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `two_factor_description` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_status` varchar(20) NOT NULL,
  `escrow_expires_at` varchar(19) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account_order`
--

INSERT INTO `account_order` (`id`, `account_id`, `seller_id`, `buyer_id`, `order_no`, `title`, `platform`, `email`, `recovery_email`, `recovery_email_password`, `additional_email`, `additional_password`, `username`, `password`, `description`, `two_factor_enabled`, `two_factor_description`, `price`, `create_at`, `payment_status`, `escrow_expires_at`) VALUES
(293, 3, 4, 4, '959791', 'lasugduysvcdas jk', 'Facebook', 'N/A', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 20.00, '2025-07-07 21:55:07', 'Completed', '2025-07-07 22:56:07'),
(294, 3, 4, 4, '809111', 'lasugduysvcdas jk', 'Facebook', 'N/A', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 20.00, '2025-07-07 21:59:55', 'Completed', '2025-07-07 23:00:55'),
(295, 3, 4, 4, '270679', 'lasugduysvcdas jk', 'Facebook', 'N/A', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 20.00, '2025-07-07 22:06:39', 'Completed', '2025-07-07 23:07:38'),
(296, 4, 4, 4, '368195', 'lasugduysvcdas jk', 'Facebook', 'N/A', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 20.00, '2025-07-07 22:23:13', 'Completed', '2025-07-07 23:24:13'),
(297, 5, 4, 4, '368195', 'lasugduysvcdas jk', 'Facebook', 'N/A', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 20.00, '2025-07-07 22:23:13', 'Completed', '2025-07-07 23:24:13'),
(298, 3, 4, 4, '792472', 'lasugduysvcdas jk', 'Facebook', 'N/A', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 20.00, '2025-07-07 22:35:30', 'Completed', '2025-07-07 23:36:30'),
(299, 3, 4, 26, '661521', 'lasugduysvcdas jk', 'Facebook', 'N/A', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 20.00, '2025-07-16 00:14:05', 'Completed', '2025-07-16 01:15:05'),
(300, 3, 4, 26, '187184', 'lasugduysvcdas jk', 'Facebook', 'N/A', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 20.00, '2025-07-16 00:23:07', 'Completed', '2025-07-16 01:24:07'),
(301, 3, 4, 26, '937395', 'lasugduysvcdas jk', 'Facebook', 'N/A', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 20.00, '2025-07-16 00:25:16', 'Completed', '2025-07-16 01:26:16'),
(302, 3, 4, 26, '821984', 'lasugduysvcdas jk', 'Facebook', 'N/A', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Alphatech', '1234', 'grhethbdftrjryrntewethryjrfgsdvafdfgrb', 1, 'wfwegtrhdgfsvacddrtyujyhgfbdvcs', 20.00, '2025-07-16 00:31:55', 'Completed', '2025-07-16 01:32:55'),
(303, 12, 4, 4, '961518', 'oiploi;liio;loi', 'Facebook', 'test@gmail.com', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Gabjdjhdffgf', '332143432', 'o9ppo;o', 0, 'N/A', 20.00, '2025-08-13 12:57:56', 'Completed', '2025-08-13 13:58:56'),
(304, 12, 4, 4, '476294', 'oiploi;liio;loi', 'Facebook', 'test@gmail.com', 'itodogabriel40@gmail.com', NULL, NULL, NULL, 'Gabjdjhdffgf', '332143432', 'o9ppo;o', 0, 'N/A', 20.00, '2025-08-13 13:17:08', 'Completed', '2025-08-13 14:18:08'),
(305, 12, 4, 4, '980411', 'oiploi;liio;loi', 'Facebook', 'test@gmail.com', 'itodogabriel40@gmail.com', 'sdfdsfdsf', NULL, 'ddffd', 'Gabjdjhdffgf', '332143432', 'o9ppo;o', 0, 'N/A', 20.00, '2025-08-13 13:25:16', 'Completed', '2025-08-13 14:26:16'),
(306, 12, 4, 4, '508841', 'oiploi;liio;loi', 'Facebook', 'test@gmail.com', 'itodogabriel40@gmail.com', 'sdfdsfdsf', 'itodogabriel40@gmail.com', 'ddffd', 'Gabjdjhdffgf', '332143432', 'o9ppo;o', 0, 'N/A', 20.00, '2025-08-13 13:28:43', 'Completed', '2025-08-13 14:29:43');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `uid` bigint(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `balance` decimal(12,2) DEFAULT 0.00,
  `commission` decimal(12,2) DEFAULT 0.00,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`uid`, `full_name`, `username`, `email`, `balance`, `commission`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Speednet Multimedia Technologies', 'Admin', 'test@gmail.com', 210.00, 0.00, '$2b$10$mNOSujgjrAg8ZXxG5xYVaeu/4MYemru8LOqd/WlbD1g0VJRhiMYnO', '2025-05-24 22:17:50', '2025-08-06 00:06:37');

-- --------------------------------------------------------

--
-- Table structure for table `merchant_history`
--

CREATE TABLE `merchant_history` (
  `id` bigint(20) NOT NULL,
  `seller_id` bigint(20) NOT NULL,
  `transaction_id` varchar(50) NOT NULL,
  `transaction_type` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','refunded','credited','completed','system') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `merchant_history`
--

INSERT INTO `merchant_history` (`id`, `seller_id`, `transaction_id`, `transaction_type`, `amount`, `status`, `created_at`) VALUES
(210, 4, '9413435427088', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 16:44:21'),
(211, 4, '9413435427088', 'Commission Deduction', 2.00, 'system', '2025-07-06 16:45:19'),
(212, 4, '9413435427088', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 16:45:20'),
(213, 4, '4438977975826', 'To Escrow Wallet', 20.00, 'pending', '2025-07-06 16:49:27'),
(214, 4, '6014825650727', 'To Escrow Wallet', 20.00, 'pending', '2025-07-06 16:50:50'),
(215, 4, '6658428163902', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 16:53:24'),
(216, 4, '6658428163902', 'Commission Deduction', 2.00, 'system', '2025-07-06 16:54:22'),
(217, 4, '6658428163902', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 16:54:23'),
(218, 4, '4730718001520', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 17:05:31'),
(219, 4, '4730718001520', 'Commission Deduction', 2.00, 'system', '2025-07-06 17:06:28'),
(220, 4, '4730718001520', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 17:06:29'),
(221, 4, '4666550531074', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 17:08:09'),
(222, 4, '1757007797187', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 17:08:41'),
(223, 4, '1757007797187', 'Commission Deduction', 2.00, 'system', '2025-07-06 17:09:07'),
(224, 4, '1757007797187', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 17:09:08'),
(225, 4, '4666550531074', 'Commission Deduction', 2.00, 'system', '2025-07-06 17:09:38'),
(226, 4, '4666550531074', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 17:09:39'),
(227, 4, '9977852149141', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 17:14:19'),
(228, 4, '9192371816392', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 17:14:19'),
(229, 4, '9977852149141', 'Commission Deduction', 2.00, 'system', '2025-07-06 17:15:16'),
(230, 4, '9192371816392', 'Commission Deduction', 2.00, 'system', '2025-07-06 17:15:16'),
(231, 4, '9192371816392', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 17:15:17'),
(232, 4, '9977852149141', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 17:15:17'),
(233, 4, '2543104241866', 'To Escrow Wallet', 40.00, 'completed', '2025-07-06 17:28:02'),
(234, 4, '2543104241866', 'Commission Deduction', 4.00, 'system', '2025-07-06 17:28:59'),
(235, 4, '2543104241866', 'From Escrow to Merchant Wallet', 36.00, 'credited', '2025-07-06 17:29:00'),
(236, 4, '7012647318609', 'To Escrow Wallet', 40.00, 'completed', '2025-07-06 17:32:49'),
(237, 4, '7012647318609', 'Commission Deduction', 4.00, 'system', '2025-07-06 17:33:47'),
(238, 4, '7012647318609', 'From Escrow to Merchant Wallet', 36.00, 'credited', '2025-07-06 17:33:48'),
(239, 4, '7300218349497', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 17:39:47'),
(240, 4, '7300218349497', 'Commission Deduction', 2.00, 'system', '2025-07-06 17:40:45'),
(241, 4, '7300218349497', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 17:40:46'),
(242, 4, '1745417690069', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 18:19:38'),
(243, 4, '1745417690069', 'Commission Deduction', 2.00, 'system', '2025-07-06 18:20:35'),
(244, 4, '1745417690069', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 18:20:36'),
(245, 4, '5254534376772', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 21:24:12'),
(246, 4, '5254534376772', 'Commission Deduction', 2.00, 'system', '2025-07-06 21:24:13'),
(247, 4, '5254534376772', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 21:24:14'),
(248, 4, '8317672022000', 'To Escrow Wallet', 20.00, 'pending', '2025-07-06 21:38:34'),
(249, 4, '1211028827874', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 21:41:13'),
(250, 4, '1211028827874', 'Commission Deduction', 2.00, 'system', '2025-07-06 21:42:11'),
(251, 4, '1211028827874', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 21:42:12'),
(252, 4, '6349273026641', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 21:44:42'),
(253, 4, '6349273026641', 'Commission Deduction', 2.00, 'system', '2025-07-06 21:45:39'),
(254, 4, '6349273026641', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 21:45:40'),
(255, 4, '3043916811184', 'To Escrow Wallet', 40.00, 'completed', '2025-07-06 21:46:32'),
(256, 4, '3043916811184', 'Commission Deduction', 4.00, 'system', '2025-07-06 21:47:30'),
(257, 4, '3043916811184', 'From Escrow to Merchant Wallet', 36.00, 'credited', '2025-07-06 21:47:31'),
(258, 4, '2005493569047', 'To Escrow Wallet', 20.00, 'completed', '2025-07-06 21:51:06'),
(259, 4, '2005493569047', 'Commission Deduction', 2.00, 'system', '2025-07-06 21:52:04'),
(260, 4, '2005493569047', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-06 21:52:05'),
(261, 4, '8975165522300', 'To Escrow Wallet', 20.00, 'pending', '2025-07-06 23:24:10'),
(262, 4, '2096616953333', 'To Escrow Wallet', 20.00, 'pending', '2025-07-06 23:39:47'),
(263, 4, '9039993670585', 'To Escrow Wallet', 20.00, 'pending', '2025-07-06 23:44:14'),
(264, 4, '9257594054926', 'To Escrow Wallet', 20.00, 'pending', '2025-07-06 23:54:11'),
(265, 4, '4619527102755', 'To Escrow Wallet', 20.00, 'pending', '2025-07-07 00:21:56'),
(266, 4, '2663255554973', 'To Escrow Wallet', 20.00, 'pending', '2025-07-07 00:25:03'),
(267, 4, '3720837937926', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 14:33:28'),
(268, 4, '3720837937926', 'Commission Deduction', 2.00, 'system', '2025-07-07 14:33:28'),
(269, 4, '3720837937926', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 14:33:29'),
(270, 4, '7720482349638', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 14:36:50'),
(271, 4, '7720482349638', 'Commission Deduction', 2.00, 'system', '2025-07-07 14:37:48'),
(272, 4, '7720482349638', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 14:37:49'),
(273, 4, '1637903303189', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 16:54:57'),
(274, 4, '1637903303189', 'Commission Deduction', 2.00, 'system', '2025-07-07 16:55:00'),
(275, 4, '1637903303189', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 16:55:00'),
(276, 4, '9183937899702', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 16:56:12'),
(277, 4, '9183937899702', 'Commission Deduction', 2.00, 'system', '2025-07-07 16:56:14'),
(278, 4, '9183937899702', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 16:56:14'),
(279, 4, '2493648818975', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 17:01:12'),
(280, 4, '2493648818975', 'Commission Deduction', 2.00, 'system', '2025-07-07 17:01:15'),
(281, 4, '2493648818975', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 17:01:15'),
(282, 4, '7207688623551', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 17:15:35'),
(283, 4, '7207688623551', 'Commission Deduction', 2.00, 'system', '2025-07-07 17:15:40'),
(284, 4, '7207688623551', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 17:15:40'),
(285, 4, '6135786230308', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 17:20:43'),
(286, 4, '6135786230308', 'Commission Deduction', 2.00, 'system', '2025-07-07 17:20:46'),
(287, 4, '6135786230308', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 17:20:46'),
(288, 4, '7674644542781', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 17:25:42'),
(289, 4, '7674644542781', 'Commission Deduction', 2.00, 'system', '2025-07-07 17:25:50'),
(290, 4, '7674644542781', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 17:25:50'),
(291, 4, '6078474511670', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 20:22:25'),
(292, 4, '6078474511670', 'Commission Deduction', 2.00, 'system', '2025-07-07 20:22:27'),
(293, 4, '6078474511670', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 20:22:27'),
(294, 4, '9114906358596', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 21:55:09'),
(295, 4, '9114906358596', 'Commission Deduction', 2.00, 'system', '2025-07-07 21:55:12'),
(296, 4, '9114906358596', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 21:55:12'),
(297, 4, '4749454107077', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 21:59:58'),
(298, 4, '4749454107077', 'Commission Deduction', 2.00, 'system', '2025-07-07 21:59:58'),
(299, 4, '1139867413809', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 22:06:41'),
(300, 4, '1139867413809', 'Commission Deduction', 2.00, 'system', '2025-07-07 22:07:38'),
(301, 4, '1139867413809', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 22:07:38'),
(302, 4, '9286904381394', 'To Escrow Wallet', 40.00, 'completed', '2025-07-07 22:23:16'),
(303, 4, '9286904381394', 'Commission Deduction', 4.00, 'system', '2025-07-07 22:24:13'),
(304, 4, '9286904381394', 'From Escrow to Merchant Wallet', 36.00, 'credited', '2025-07-07 22:24:13'),
(305, 4, '2744940172986', 'To Escrow Wallet', 20.00, 'completed', '2025-07-07 22:35:32'),
(306, 4, '2744940172986', 'Commission Deduction', 2.00, 'system', '2025-07-07 22:36:30'),
(307, 4, '2744940172986', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-07 22:36:30'),
(308, 4, '8448780187581', 'To Escrow Wallet', 20.00, 'completed', '2025-07-16 00:14:07'),
(309, 4, '8448780187581', 'Commission Deduction', 2.00, 'system', '2025-07-16 00:15:05'),
(310, 4, '8448780187581', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-16 00:15:05'),
(311, 4, '6235770478690', 'To Escrow Wallet', 20.00, 'completed', '2025-07-16 00:23:09'),
(312, 4, '6235770478690', 'Commission Deduction', 2.00, 'system', '2025-07-16 00:24:07'),
(313, 4, '6235770478690', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-16 00:24:07'),
(314, 4, '4045733333805', 'To Escrow Wallet', 20.00, 'completed', '2025-07-16 00:25:18'),
(315, 4, '4045733333805', 'Commission Deduction', 2.00, 'system', '2025-07-16 00:26:16'),
(316, 4, '4045733333805', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-16 00:26:16'),
(317, 4, '5712829476718', 'To Escrow Wallet', 20.00, 'completed', '2025-07-16 00:31:57'),
(318, 4, '5712829476718', 'Commission Deduction', 2.00, 'system', '2025-07-16 00:32:55'),
(319, 4, '5712829476718', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-07-16 00:32:55'),
(320, 4, '5135199771291', 'To Escrow Wallet', 20.00, 'completed', '2025-08-13 12:57:58'),
(321, 4, '5135199771291', 'Commission Deduction', 2.00, 'system', '2025-08-13 12:58:56'),
(322, 4, '5135199771291', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-08-13 12:58:56'),
(323, 4, '6022538467916', 'To Escrow Wallet', 20.00, 'completed', '2025-08-13 13:17:10'),
(324, 4, '6022538467916', 'Commission Deduction', 2.00, 'system', '2025-08-13 13:18:08'),
(325, 4, '6022538467916', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-08-13 13:18:08'),
(326, 4, '7160109264442', 'To Escrow Wallet', 20.00, 'completed', '2025-08-13 13:25:18'),
(327, 4, '7160109264442', 'Commission Deduction', 2.00, 'system', '2025-08-13 13:26:16'),
(328, 4, '7160109264442', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-08-13 13:26:16'),
(329, 4, '3870298378304', 'To Escrow Wallet', 20.00, 'completed', '2025-08-13 13:28:46'),
(330, 4, '3870298378304', 'Commission Deduction', 2.00, 'system', '2025-08-13 13:29:43'),
(331, 4, '3870298378304', 'From Escrow to Merchant Wallet', 18.00, 'credited', '2025-08-13 13:29:43');

-- --------------------------------------------------------

--
-- Table structure for table `nord_history`
--

CREATE TABLE `nord_history` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `plan_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nord_history`
--

INSERT INTO `nord_history` (`id`, `user_id`, `email`, `full_name`, `country`, `zip_code`, `plan_id`, `amount`, `status`, `created_at`) VALUES
(7, 4, 'itodogabriel40@gmail.com', 'ITODO GABRIEL EJEH', 'Nigeria', '230001', 1, 10.99, 'pending', '2025-08-05 14:51:53');

-- --------------------------------------------------------

--
-- Table structure for table `nord_plan`
--

CREATE TABLE `nord_plan` (
  `id` int(11) NOT NULL,
  `package_name` varchar(100) NOT NULL,
  `duration` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nord_plan`
--

INSERT INTO `nord_plan` (`id`, `package_name`, `duration`, `amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Standard', 30, 10.99, 1, '2025-08-02 23:59:20', '2025-08-02 23:59:20'),
(2, 'Professional', 30, 12.99, 1, '2025-08-02 23:59:20', '2025-08-02 23:59:20');

-- --------------------------------------------------------

--
-- Table structure for table `notice`
--

CREATE TABLE `notice` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `role` enum('user','merchant') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_history`
--

CREATE TABLE `order_history` (
  `id` bigint(20) NOT NULL,
  `seller_id` bigint(20) NOT NULL,
  `order_no` varchar(100) NOT NULL,
  `order_type` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(50) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_history`
--

INSERT INTO `order_history` (`id`, `seller_id`, `order_no`, `order_type`, `amount`, `status`, `updated_at`) VALUES
(155, 4, '959791', 'Account Relinquished', 20.00, 'Completed', '2025-07-07 21:55:07'),
(156, 4, '809111', 'Account Relinquished', 20.00, 'Completed', '2025-07-07 21:59:55'),
(157, 4, '270679', 'Account Relinquished', 20.00, 'Completed', '2025-07-07 22:06:39'),
(158, 4, '368195', 'Account Relinquished', 40.00, 'Completed', '2025-07-07 22:23:14'),
(159, 4, '792472', 'Account Relinquished', 20.00, 'Completed', '2025-07-07 22:35:30'),
(160, 4, '661521', 'Account Relinquished', 20.00, 'Completed', '2025-07-16 00:14:05'),
(161, 4, '187184', 'Account Relinquished', 20.00, 'Completed', '2025-07-16 00:23:07'),
(162, 4, '937395', 'Account Relinquished', 20.00, 'Completed', '2025-07-16 00:25:16'),
(163, 4, '821984', 'Account Relinquished', 20.00, 'Completed', '2025-07-16 00:31:55'),
(164, 4, '961518', 'Account Relinquished', 20.00, 'Completed', '2025-08-13 12:57:56'),
(165, 4, '476294', 'Account Relinquished', 20.00, 'Completed', '2025-08-13 13:17:08'),
(166, 4, '980411', 'Account Relinquished', 20.00, 'Completed', '2025-08-13 13:25:16'),
(167, 4, '508841', 'Account Relinquished', 20.00, 'Completed', '2025-08-13 13:28:43');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `title`, `slug`, `content`, `created_at`) VALUES
(3, 'About Us', 'about-us', 'gfbngfjhfghbghggfhbfbngbfbgfb', '2025-07-18 14:16:36'),
(4, 'Terms and Condition', 'terms-and-condition', 'dfsfggfdhghghbfgjhfjnhjnhghfgdfbbgfbbgbgngfngf', '2025-07-18 21:30:39'),
(6, 'Privacy Policy', 'privacy-policy', 'Privacy Policy for SpeedNet\n\nEffective Date: 19th July 2025\n\nSpeedNet (“we,” “our,” or “us”) is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and protect the information you provide to us when using our website and services.\n1. Who We Are\n\nSpeedNet is a P2P platform providing social services, VTU (Virtual Top-Up) solutions, VPN access, and e-commerce services. We are based at:\n\n    Rond Point Bastos, en face d’un grand immeuble, 2ème étage\n\nOur website: https://speednet.ng\nContact email: support@gmail.com\n2. What Information We Collect\n\nWhen you interact with our website or services, we may collect the following personal data:\n\n    Full Name\n\n    Email Address\n\n    Phone Number\n\n    Residential/Delivery Address\n\nWe do not collect sensitive financial data such as credit card numbers or bank information directly.\n3. How We Collect Data\n\nWe collect data through the following means:\n\n    Registration or contact forms on our website\n\n    Voluntary submissions by users while using our platform\n\nWe do not use cookies or third-party tracking scripts.\n4. Purpose of Data Collection\n\nWe use your personal data to:\n\n    Provide and manage access to our services\n\n    Deliver customer support\n\n    Analyze usage patterns for service improvement\n\n    Comply with legal obligations and prevent fraud\n\n5. Data Sharing and Disclosure\n\nWe do not sell, rent, or share your data with any third parties for marketing purposes.\n6. User Rights\n\nYou have access to the personal data you have provided; however, you currently cannot edit or delete this data from your account. If you wish to make changes or request deletion, please contact us at support@gmail.com.\n7. Data Protection\n\nWe implement strict technical and organizational measures to safeguard your data, including:\n\n    SSL encryption for secure transmission\n\n    Tokenization of sensitive identifiers\n\n    Secure servers with limited access\n\n8. Children’s Privacy\n\nOur platform is not intended for users under 18. We do not knowingly collect data from minors.\n9. International Users\n\nAlthough SpeedNet primarily serves users in Africa, your data may be stored on secure servers in compliance with global data protection standards.\n10. Policy Updates\n\nWe reserve the right to update this Privacy Policy at any time. All changes will be posted on this page with a revised “Effective Date.” Continued use of our platform indicates acceptance of the updated terms.\n11. Contact Us\n\nIf you have questions or concerns about this Privacy Policy or your data, contact us at:\n\nsupport@speednet.ng\nhttps://speednet.ng', '2025-07-19 02:10:55');

-- --------------------------------------------------------

--
-- Table structure for table `platforms`
--

CREATE TABLE `platforms` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `platforms`
--

INSERT INTO `platforms` (`id`, `name`, `image_path`) VALUES
(8, 'X-App 3', '/uploads/platform-1750843864445.jpeg'),
(9, 'Facebook', '/uploads/platform-1751416173996.png'),
(10, 'Instagram', '/uploads/platform-1751416225839.png'),
(11, 'Express', '/uploads/platform-1751416249974.png'),
(14, 'Bank', '/uploads/platform-1751416348685.png'),
(15, 'X-App', '/uploads/platform-1752962616292.png');

-- --------------------------------------------------------

--
-- Table structure for table `referrals`
--

CREATE TABLE `referrals` (
  `id` bigint(20) NOT NULL,
  `referral1_id` bigint(20) NOT NULL,
  `referral2_id` bigint(20) NOT NULL,
  `referral_amount` decimal(25,19) DEFAULT 0.0000000000000000000,
  `first_deposit` tinyint(4) DEFAULT 0,
  `first_order` tinyint(4) DEFAULT 0,
  `referral_status` tinyint(4) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `referrals`
--

INSERT INTO `referrals` (`id`, `referral1_id`, `referral2_id`, `referral_amount`, `first_deposit`, `first_order`, `referral_status`, `created_at`, `updated_at`) VALUES
(4, 4, 26, 25.0000000000000000000, 1, 1, 1, '2025-07-15 22:29:06', '2025-07-16 00:23:07');

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `id` bigint(20) NOT NULL,
  `reporter_id` bigint(20) NOT NULL,
  `defendant_id` bigint(20) NOT NULL,
  `target_id` bigint(20) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('pending','reviewed','resolved') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`id`, `reporter_id`, `defendant_id`, `target_id`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 4, 4, 758789, '45trdfgfdgdfvnb nvdhdsbvjfsd\njj nghbmnvbnf nvc cnbmc vnm vmn,xc\n,kjvbfkjv bkvf mvn v bmnvfmvmn,vfd\nfv nfm,vb vf fn vvmn v fmnvfndgfgkj,gnbfgfdgm fgmnfbfd\nfkmvbfkjf vmfm,njkgngkgjnkjh m ,bg ngb mbngmbgf,fb\n,m. m,', 'resolved', '2025-07-05 14:49:45', '2025-07-06 00:46:20');

-- --------------------------------------------------------

--
-- Table structure for table `sms_service`
--

CREATE TABLE `sms_service` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `country` int(11) NOT NULL,
  `amount` decimal(10,4) NOT NULL,
  `service` varchar(100) NOT NULL,
  `number` varchar(20) NOT NULL,
  `code` varchar(20) DEFAULT NULL,
  `tzid` bigint(20) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `time` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_uid` bigint(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_type` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `transaction_no` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_uid`, `amount`, `transaction_type`, `status`, `transaction_no`, `created_at`) VALUES
(245, 4, 100.00, 'Fund from Admin', 'Completed', '3182881604539', '2025-07-15 03:05:34'),
(246, 4, 2000.00, 'Fund from Admin', 'Completed', '7043218694039', '2025-07-15 03:07:48'),
(247, 4, 100.00, 'Fund from Admin', 'Completed', '3809329758268', '2025-07-15 03:09:42'),
(248, 4, 100.00, 'Fund from Admin', 'Completed', '5055864215559', '2025-07-15 03:09:51'),
(249, 4, 10000.00, 'Fund from Admin', 'Completed', '2518154516898', '2025-07-15 03:33:31'),
(250, 4, 5.00, 'Momo/Orange Deposit', 'completed', '2016779099171', '2025-07-15 03:47:29'),
(251, 4, 10.00, 'Momo/Orange Deposit', 'completed', '8993178565900', '2025-07-15 04:07:32'),
(263, 26, 25.00, 'Momo/Orange Deposit', 'completed', '9037172362420', '2025-07-16 00:12:52'),
(264, 26, 30.00, 'Account Purchased', 'Completed', '1957019181459', '2025-07-16 00:14:05'),
(265, 26, 30.00, 'Account Purchased', 'Completed', '3478542808458', '2025-07-16 00:23:07'),
(266, 26, 30.00, 'Account Purchased', 'Completed', '5560456014136', '2025-07-16 00:25:16'),
(267, 26, 30.00, 'Account Purchased', 'Completed', '2983346234975', '2025-07-16 00:31:55'),
(268, 4, 16.49, 'Nordvpn_Standard', 'completed', '1401687934495', '2025-08-04 00:17:05'),
(269, 4, 16.49, 'Nordvpn_Standard', 'completed', '3692942061782', '2025-08-04 11:53:51'),
(270, 4, 16.49, 'Nordvpn_Standard', 'completed', '9594041980695', '2025-08-04 11:53:52'),
(271, 4, 16.49, 'Nordvpn_Standard', 'completed', '5386421705099', '2025-08-04 12:00:11'),
(272, 4, 16.49, 'Nordvpn_Standard', 'completed', '3797435902513', '2025-08-04 12:00:21'),
(273, 4, 19.49, 'Nordvpn_Professional', 'completed', '6943690645915', '2025-08-04 12:00:52'),
(274, 4, 16.49, 'Nordvpn_Standard', 'completed', '3944915980785', '2025-08-04 20:03:27'),
(275, 4, 16.49, 'Nordvpn_Standard', 'completed', '7331030520751', '2025-08-04 20:18:00'),
(276, 4, 16.49, 'Nordvpn_Standard', 'completed', '4373721619214', '2025-08-04 20:29:24'),
(277, 4, 16.49, 'Nordvpn_Standard', 'completed', '4255613499909', '2025-08-04 20:29:24'),
(278, 4, 16.49, 'Nordvpn_Standard', 'completed', '5750477428475', '2025-08-04 20:29:44'),
(279, 4, 16.49, 'Nordvpn_Standard', 'completed', '4540701139958', '2025-08-04 20:45:02'),
(280, 4, 16.49, 'Nordvpn_Standard', 'completed', '2150834971778', '2025-08-04 20:54:07'),
(281, 4, 16.49, 'Nordvpn_Standard', 'completed', '6718827288438', '2025-08-04 20:59:43'),
(282, 4, 16.49, 'Nordvpn_Standard', 'completed', '4427392714187', '2025-08-05 12:54:35'),
(283, 4, 16.49, 'Nordvpn_Standard', 'completed', '5402174396558', '2025-08-05 13:14:52'),
(284, 4, 16.49, 'Nordvpn_Standard', 'completed', '3153082246037', '2025-08-05 13:31:05'),
(285, 4, 16.49, 'Nordvpn_Standard', 'completed', '8456979363103', '2025-08-05 13:49:38'),
(286, 4, 16.49, 'Nordvpn_Standard', 'completed', '7461215955446', '2025-08-05 13:51:53'),
(287, 4, 30.00, 'Account Purchased', 'Completed', '1367968434872', '2025-08-13 12:57:56'),
(288, 4, 30.00, 'Account Purchased', 'Completed', '7850691647365', '2025-08-13 13:17:08'),
(289, 4, 30.00, 'Account Purchased', 'Completed', '7143373890520', '2025-08-13 13:25:16'),
(290, 4, 30.00, 'Account Purchased', 'Completed', '8723312722796', '2025-08-13 13:28:43'),
(291, 4, -0.06, 'Sms Service Purchase', 'completed', '7088123597906', '2025-08-16 21:14:55'),
(292, 4, 0.06, 'Sms Service Purchase', 'completed', '3234811596051', '2025-08-16 21:17:45'),
(293, 4, 0.06, 'Sms Service Purchase', 'completed', '6340652788091', '2025-08-16 21:19:12'),
(294, 4, 0.06, 'Sms Service Purchase', 'completed', '3936703077323', '2025-08-16 21:27:33'),
(295, 4, 0.93, 'Sms Service Purchase', 'completed', '3686621960989', '2025-08-17 11:31:12'),
(296, 4, 0.93, 'Sms Service Purchase', 'completed', '1286270146619', '2025-08-17 12:15:34'),
(297, 4, 0.93, 'Sms Service Purchase', 'completed', '5075625888434', '2025-08-17 12:49:38'),
(298, 4, 0.93, 'Sms Service Purchase', 'completed', '9097017443165', '2025-08-17 19:28:45'),
(299, 4, 0.93, 'Sms Service Purchase', 'completed', '5971091229553', '2025-08-17 19:34:22'),
(300, 4, 0.93, 'Sms Service Purchase', 'completed', '3665100951087', '2025-08-17 19:44:40'),
(301, 4, 0.93, 'Sms Service Purchase', 'completed', '8105222524008', '2025-08-17 21:29:10'),
(302, 4, 0.93, 'Refund for Unused SMS service', 'completed', '7690687782934', '2025-08-17 21:44:20'),
(303, 4, 0.93, 'Sms Service Purchase', 'completed', '5410933683488', '2025-08-17 22:14:13'),
(304, 4, 0.06, 'Sms Service Purchase', 'completed', '2461382712597', '2025-08-17 22:44:03'),
(305, 4, 0.06, 'Sms Service Purchase', 'completed', '1582348867291', '2025-08-17 23:17:27'),
(306, 4, 0.06, 'Sms Service Purchase', 'completed', '7974846377513', '2025-08-17 23:29:05'),
(307, 4, 0.06, 'Sms Service Purchase', 'completed', '5680370362821', '2025-08-17 23:33:10'),
(308, 4, 0.06, 'Sms Service Purchase', 'completed', '7890199872174', '2025-08-17 23:50:24'),
(309, 4, 1.86, 'Sms Service Purchase', 'completed', '4909203180366', '2025-08-18 22:46:04'),
(310, 4, 1.86, 'Refund for Unused SMS service', 'completed', '4979378817414', '2025-08-18 23:01:15'),
(311, 4, 0.04, 'Purchased SMS service', 'completed', '6246381404725', '2025-08-23 16:21:25');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` bigint(20) NOT NULL,
  `full_name` varchar(250) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT '/uploads/platform-1750273911062.png',
  `country` varchar(100) DEFAULT 'None',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role` enum('user','merchant') NOT NULL DEFAULT 'user',
  `pin` varchar(255) DEFAULT NULL,
  `account_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `merchant_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `referral_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `escrow_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `notice` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `full_name`, `username`, `email`, `password`, `phone_number`, `avatar`, `country`, `status`, `created_at`, `updated_at`, `role`, `pin`, `account_balance`, `merchant_balance`, `referral_balance`, `escrow_balance`, `notice`) VALUES
(4, 'Itodo Gabriel Ejeh', 'Alphatech', 'itodogabriel40@gmail.com', '$2b$10$m21lej4aSPSFjbesAHIELOkaI5fv7cLOHOujIoWG0e29lv./DJDKK', '2349129079450', '/uploads/platform-1750847396963.png', 'Nigeria', 1, '2025-05-07 00:07:51', '2025-08-23 16:21:25', 'merchant', '$2b$10$SCBnCBRKZJ5FAnAKuYazGu8JfMVn9PMamdC2NANMp7jdtoJpIlrUO', 19871.98, 612.00, 50.00, 120.00, 0),
(26, 'rrfgrgrg', 'dfdfdf', 'itodogabriel59@gmail.com', '$2b$10$Tnm0rZfpTVwaEsT.vcg4DO5eQOuyYLTm0dErTkJHoc6gBBj3mD6bC', '234755545454', '/uploads/platform-1750273911062.png', 'South Africa', 1, '2025-07-15 22:29:06', '2025-07-16 00:31:55', 'user', NULL, 80.00, 0.00, 0.00, 0.00, 0);

-- --------------------------------------------------------

--
-- Table structure for table `web_settings`
--

CREATE TABLE `web_settings` (
  `id` int(11) NOT NULL,
  `site_name` varchar(255) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `web_description` text DEFAULT NULL,
  `merchant_activation_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `vat` decimal(5,2) NOT NULL DEFAULT 0.00,
  `referral_commission` decimal(10,2) NOT NULL DEFAULT 0.00,
  `commission` decimal(5,2) NOT NULL DEFAULT 0.00,
  `escrow_time` int(11) DEFAULT NULL,
  `support_email` varchar(255) DEFAULT NULL,
  `admin_alert_email` varchar(255) DEFAULT NULL,
  `smtp_service` varchar(100) DEFAULT NULL,
  `smtp_port` int(11) DEFAULT NULL,
  `smtp_user` varchar(255) DEFAULT NULL,
  `smtp_pass` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `telegram_url` varchar(255) DEFAULT NULL,
  `twitter_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `tiktok_url` varchar(255) DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT '$',
  `web_url` varchar(255) DEFAULT NULL,
  `fapshi_user` varchar(255) DEFAULT NULL,
  `fapshi_key` varchar(255) DEFAULT NULL,
  `fapshi_url` varchar(255) DEFAULT NULL,
  `xaf_rate` decimal(10,2) DEFAULT NULL,
  `naira_rate` decimal(10,2) DEFAULT NULL,
  `cryptomus_merchant_uuid` varchar(255) DEFAULT NULL,
  `cryptomus_api_key` varchar(255) DEFAULT NULL,
  `cryptomus_url` varchar(255) DEFAULT NULL,
  `vtpass_api_key` varchar(255) DEFAULT NULL,
  `vtpass_pk` varchar(255) DEFAULT NULL,
  `vtpass_sk` varchar(255) DEFAULT NULL,
  `vtpass_url` varchar(255) DEFAULT NULL,
  `onlinesim_api_url` varchar(255) DEFAULT NULL,
  `onlinesim_api_key` varchar(255) DEFAULT NULL,
  `onlinesim_rate` decimal(10,4) NOT NULL DEFAULT 0.0000,
  `logo` varchar(255) DEFAULT NULL,
  `favicon` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `header_code` text DEFAULT NULL,
  `footer_code` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_settings`
--

INSERT INTO `web_settings` (`id`, `site_name`, `tagline`, `web_description`, `merchant_activation_fee`, `vat`, `referral_commission`, `commission`, `escrow_time`, `support_email`, `admin_alert_email`, `smtp_service`, `smtp_port`, `smtp_user`, `smtp_pass`, `contact_number`, `telegram_url`, `twitter_url`, `instagram_url`, `tiktok_url`, `currency`, `web_url`, `fapshi_user`, `fapshi_key`, `fapshi_url`, `xaf_rate`, `naira_rate`, `cryptomus_merchant_uuid`, `cryptomus_api_key`, `cryptomus_url`, `vtpass_api_key`, `vtpass_pk`, `vtpass_sk`, `vtpass_url`, `onlinesim_api_url`, `onlinesim_api_key`, `onlinesim_rate`, `logo`, `favicon`, `address`, `header_code`, `footer_code`, `created_at`, `updated_at`) VALUES
(1, 'Speednet', 'Earn. Engage. Enjoy', 'Take Control of Your Online Presence: Discover, Verify, and Purchase Genuine Accounts on Speednet', 50.00, 50.00, 25.00, 10.00, 1, 'support@speednet.ng', 'aalphatechmultimedia@gmail.com', 'gmail', 465, 'afrovilla01@gmail.com', 'lzzx fuqi oznb wigx', '+2349129079450', NULL, NULL, NULL, NULL, '$', 'https://8792c1375a6f.ngrok-free.app', '8b2c8c3a-84eb-422b-95f7-1ad4ef8a95f1', 'FAK_TEST_928a381db9fdb209d725', 'https://sandbox.fapshi.com', 700.00, 1550.20, '249bf843-81e1-444f-aabf-73145c6e4912', '1WcAr2ZFQ3aLWBJPy6wmkF2sM5LTmdBJ4nEtzo5lrVsfmYyQAwVcn5F4EV5CNvKW5eZufDGoMIgy8yH6d3MmDxW1csQ8brkrZvlOMXlJvevJJrRWaJuxF6cNt8xqRqrE', 'https://api.cryptomus.com', '7ee505ad468915cb9132267521bc6ba2', 'PK_998a8212b23bbbbb4c26e9e6f964a74602a0f0f07a6', 'SK_2266a6c77a4ba09b3f34e618da83ecb65795fa59286', 'https://www.vtpass.com', 'https://api.smspool.net', 'l5CINDe7XE0lU3YyZpJZZIMvNMZ6AMQi', 0.0000, '/uploads/platform-1751285204347.png', '/uploads/platform-1751285254734.png', 'International Marché Central - Rond point Intendance Face aux ets NZIKO 2ème étage', '&lt;meta name=\"cryptomus\" content=\"c370df9a\" />', NULL, '2025-03-27 22:19:19', '2025-08-23 14:47:34');

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal`
--

CREATE TABLE `withdrawal` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `method` varchar(50) NOT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `account_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `wallet_address` varchar(255) DEFAULT NULL,
  `wallet_network` varchar(50) DEFAULT NULL,
  `coin_name` varchar(50) DEFAULT NULL,
  `momo_number` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `withdrawal`
--

INSERT INTO `withdrawal` (`id`, `user_id`, `method`, `reference`, `bank_name`, `account_name`, `account_number`, `wallet_address`, `wallet_network`, `coin_name`, `momo_number`, `amount`, `status`, `created_at`, `updated_at`) VALUES
(26, 4, 'Bank', '9342801900477', 'OPay Digital Services Limited (OPay)', 'GABRIEL EJEH ITODO', '9129079450', NULL, NULL, NULL, NULL, 10.00, 'completed', '2025-07-04 00:53:00', '2025-07-04 01:05:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `account_order`
--
ALTER TABLE `account_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `seller_id` (`seller_id`),
  ADD KEY `buyer_id` (`buyer_id`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `merchant_history`
--
ALTER TABLE `merchant_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seller_id` (`seller_id`),
  ADD KEY `transaction_id` (`transaction_id`) USING BTREE;

--
-- Indexes for table `nord_history`
--
ALTER TABLE `nord_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- Indexes for table `nord_plan`
--
ALTER TABLE `nord_plan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notice`
--
ALTER TABLE `notice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_history`
--
ALTER TABLE `order_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `platforms`
--
ALTER TABLE `platforms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `referrals`
--
ALTER TABLE `referrals`
  ADD UNIQUE KEY `r_id` (`id`),
  ADD KEY `referral1_id` (`referral1_id`),
  ADD KEY `referral2_id` (`referral2_id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reporter_id` (`reporter_id`),
  ADD KEY `defendant_id` (`defendant_id`);

--
-- Indexes for table `sms_service`
--
ALTER TABLE `sms_service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_no` (`transaction_no`),
  ADD KEY `user_uid` (`user_uid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `phone_number` (`phone_number`) USING BTREE,
  ADD UNIQUE KEY `pin` (`pin`);

--
-- Indexes for table `web_settings`
--
ALTER TABLE `web_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `withdrawal`
--
ALTER TABLE `withdrawal`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `account_order`
--
ALTER TABLE `account_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=307;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `uid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `merchant_history`
--
ALTER TABLE `merchant_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=332;

--
-- AUTO_INCREMENT for table `nord_history`
--
ALTER TABLE `nord_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `nord_plan`
--
ALTER TABLE `nord_plan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notice`
--
ALTER TABLE `notice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_history`
--
ALTER TABLE `order_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=168;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `platforms`
--
ALTER TABLE `platforms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `referrals`
--
ALTER TABLE `referrals`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sms_service`
--
ALTER TABLE `sms_service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=312;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `web_settings`
--
ALTER TABLE `web_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `withdrawal`
--
ALTER TABLE `withdrawal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE;

--
-- Constraints for table `account_order`
--
ALTER TABLE `account_order`
  ADD CONSTRAINT `account_order_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `account_order_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE,
  ADD CONSTRAINT `account_order_ibfk_3` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE;

--
-- Constraints for table `merchant_history`
--
ALTER TABLE `merchant_history`
  ADD CONSTRAINT `merchant_history_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE;

--
-- Constraints for table `nord_history`
--
ALTER TABLE `nord_history`
  ADD CONSTRAINT `nord_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE,
  ADD CONSTRAINT `nord_history_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `nord_plan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_history`
--
ALTER TABLE `order_history`
  ADD CONSTRAINT `order_history_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `account_order` (`seller_id`) ON DELETE CASCADE;

--
-- Constraints for table `referrals`
--
ALTER TABLE `referrals`
  ADD CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`referral1_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `referrals_ibfk_2` FOREIGN KEY (`referral2_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE,
  ADD CONSTRAINT `report_ibfk_2` FOREIGN KEY (`defendant_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE;

--
-- Constraints for table `sms_service`
--
ALTER TABLE `sms_service`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`uid`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE;

--
-- Constraints for table `withdrawal`
--
ALTER TABLE `withdrawal`
  ADD CONSTRAINT `withdrawal_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
