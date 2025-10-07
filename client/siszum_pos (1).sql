-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 08, 2025 at 04:52 AM
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
-- Database: `siszum_pos`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_type` enum('admin','customer') NOT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `user_type`, `action`, `table_name`, `record_id`, `old_values`, `new_values`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 'admin', 'CREATE', 'orders', 1, NULL, '{\"order_code\": \"ORD20250817001\", \"status\": \"completed\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(2, 1, 'admin', 'UPDATE', 'orders', 1, '{\"status\": \"confirmed\"}', '{\"status\": \"completed\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(3, 1, 'admin', 'CREATE', 'customers', 11, NULL, '{\"customer_name\": \"Walk-in Customer\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(4, 1, 'admin', 'CREATE', 'refill_requests', 1, NULL, '{\"table_code\": \"00001\", \"status\": \"pending\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(5, 1, 'admin', 'UPDATE', 'refill_requests', 3, '{\"status\": \"pending\"}', '{\"status\": \"on-going\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(6, 1, 'admin', 'CREATE', 'customer_timers', 1, NULL, '{\"table_id\": 1, \"customer_name\": \"Maria Santos\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(7, 1, 'admin', 'UPDATE', 'restaurant_tables', 1, '{\"status\": \"available\"}', '{\"status\": \"occupied\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(8, 1, 'admin', 'CREATE', 'transactions', 1, NULL, '{\"transaction_code\": \"TXN20250817001\", \"amount\": 445.76}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(9, 1, 'admin', 'CREATE', 'orders', 2, NULL, '{\"order_code\": \"ORD20250817002\", \"status\": \"completed\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(10, 1, 'admin', 'UPDATE', 'orders', 2, '{\"status\": \"confirmed\"}', '{\"status\": \"completed\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(11, 1, 'admin', 'CREATE', 'reservations', 1, NULL, '{\"reservation_code\": \"RES20250818001\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(12, 1, 'admin', 'UPDATE', 'menu_items', 8, '{\"quantity_in_stock\": 20}', '{\"quantity_in_stock\": 15}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(13, 1, 'admin', 'CREATE', 'customer_feedback', 1, NULL, '{\"rating\": 5, \"feedback_type\": \"compliment\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(14, 1, 'admin', 'UPDATE', 'customer_timers', 8, '{\"elapsed_seconds\": 7200}', '{\"status\": \"overtime\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(15, 1, 'admin', 'CREATE', 'refill_requests', 7, NULL, '{\"table_code\": \"00007\", \"status\": \"pending\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(16, 1, 'admin', 'UPDATE', 'reservations', 13, '{\"status\": \"confirmed\"}', '{\"status\": \"cancelled\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(17, 1, 'admin', 'CREATE', 'orders', 16, NULL, '{\"order_code\": \"ORD20250817003\", \"status\": \"preparing\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(18, 1, 'admin', 'UPDATE', 'menu_items', 9, '{\"quantity_in_stock\": 10}', '{\"quantity_in_stock\": 8}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(19, 1, 'admin', 'CREATE', 'customer_timers', 12, NULL, '{\"table_id\": 11, \"customer_name\": \"Walk-in Customer\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41'),
(20, 1, 'admin', 'UPDATE', 'refill_requests', 2, '{\"status\": \"pending\"}', '{\"status\": \"completed\"}', '127.0.0.1', NULL, '2025-08-17 09:56:41');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `role` enum('super_admin','admin','manager') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `avatar_url`, `date_of_birth`, `city`, `country`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@siszumpos.com', '$2b$12$1F3Fic5Im2afY/h08p46.eExcDgi6aHgaTtkx/1R9KnRBecZeSWCu', 'System', 'Administrator', NULL, NULL, NULL, NULL, NULL, 'super_admin', 1, '2025-09-08 02:49:17', '2025-08-17 09:56:41', '2025-09-08 02:49:17');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `customer_code` varchar(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_code`, `first_name`, `last_name`, `email`, `phone`, `date_of_birth`, `address`, `city`, `country`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'CUST0001', 'Mar', 'Santos', 'maria.santos@email.com', '09171234567', NULL, NULL, 'Manila', 'Philippines', 1, '2025-08-17 09:56:41', '2025-08-25 09:04:49'),
(2, 'CUST0002', 'Jun', 'Dela Cruz', 'juan.delacruz@email.com', '09281234567', NULL, NULL, 'Quezon City', 'Philippines', 1, '2025-08-17 09:56:41', '2025-08-25 08:47:50'),
(3, 'CUST0003', 'Ana', 'Garcia', 'ana.garcia@email.com', '09391234567', NULL, NULL, 'Makati', 'Philippines', 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(4, 'CUST0004', 'Pedro', 'Rodriguez', 'pedro.rodriguez@email.com', '09401234567', NULL, NULL, 'Pasig', 'Philippines', 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(5, 'CUST0005', 'Carmen', 'Lopez', 'carmen.lopez@email.com', '09511234567', NULL, NULL, 'Cavite', 'Philippines', 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(6, 'CUST0006', 'Roberto', 'Mendoza', 'roberto.mendoza@email.com', '09621234567', NULL, NULL, 'Pampanga', 'Philippines', 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(7, 'CUST0007', 'Rosa', 'Fernandez', 'rosa.fernandez@email.com', '09731234567', NULL, NULL, 'Taguig', 'Philippines', 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(8, 'CUST0008', 'Miguel', 'Torres', 'miguel.torres@email.com', '09841234567', NULL, NULL, 'Muntinlupa', 'Philippines', 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(9, 'CUST0009', 'Elena', 'Ramos', 'elena.ramos@email.com', '09951234567', NULL, NULL, 'Marikina', 'Philippines', 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(10, 'CUST0010', 'Jose', 'Morales', 'jose.morales@email.com', '09061234567', NULL, NULL, 'Mandaluyong', 'Philippines', 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(11, 'CUST0011', 'Andrei', 'Gallanosa', 'gallanosa.andrei.bsit@gmail.com', '09913114847', NULL, '2283 Ruby Street\nRocka Village Tabang', 'Plaridel', 'Philippines', 1, '2025-09-01 12:54:57', '2025-09-01 12:54:57');

-- --------------------------------------------------------

--
-- Table structure for table `customer_feedback`
--

CREATE TABLE `customer_feedback` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `feedback_type` enum('compliment','complaint','suggestion','general') DEFAULT 'general',
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `feedback_text` text NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `status` enum('pending','reviewed','responded','resolved') DEFAULT 'pending',
  `admin_response` text DEFAULT NULL,
  `responded_by` int(11) DEFAULT NULL,
  `responded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_feedback`
--

INSERT INTO `customer_feedback` (`id`, `customer_id`, `customer_name`, `email`, `feedback_type`, `rating`, `feedback_text`, `order_id`, `status`, `admin_response`, `responded_by`, `responded_at`, `created_at`, `updated_at`) VALUES
(1, 1, '', NULL, 'compliment', 5, 'Excellent food quality and service! The unlimited pork was amazing.', 1, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(2, 2, '', NULL, 'suggestion', 4, 'Good food but service was a bit slow during peak hours.', 2, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(3, 3, '', NULL, 'compliment', 5, 'Love the Korean flavors! Will definitely come back.', 3, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(4, 4, '', NULL, 'suggestion', 3, 'Food was okay but could use more variety in side dishes.', 4, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(5, 5, '', NULL, 'compliment', 5, 'Great value for money! Staff was very friendly.', 5, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(6, 6, '', NULL, 'suggestion', 4, 'Enjoyed the meal but the restaurant was quite noisy.', 6, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(7, 7, '', NULL, 'compliment', 5, 'Perfect place for family dinner. Kids loved the food!', 7, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(8, 8, '', NULL, 'complaint', 2, 'Food took too long to arrive and was cold when served.', 8, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(9, 9, '', NULL, 'compliment', 4, 'Good portion sizes and reasonable prices.', 9, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(10, 10, '', NULL, 'compliment', 5, 'Outstanding service and delicious food. Highly recommended!', 10, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(11, 1, '', NULL, 'suggestion', 4, 'Great atmosphere but could improve the kimchi selection.', 11, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(12, 2, '', NULL, 'compliment', 5, 'Best Korean BBQ experience in the area!', 12, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(13, 3, '', NULL, 'suggestion', 3, 'Average experience. Nothing special but not bad either.', 13, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(14, 4, '', NULL, 'compliment', 5, 'Exceptional quality and presentation. Will bring friends!', 14, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(15, 5, '', NULL, 'suggestion', 4, 'Good food but parking is limited during busy hours.', 15, 'pending', NULL, NULL, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41');

-- --------------------------------------------------------

--
-- Table structure for table `customer_timers`
--

CREATE TABLE `customer_timers` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `table_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `start_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_time` timestamp NULL DEFAULT NULL,
  `elapsed_seconds` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_timers`
--

INSERT INTO `customer_timers` (`id`, `customer_name`, `table_id`, `order_id`, `start_time`, `end_time`, `elapsed_seconds`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Maria Santos', 1, 1, '2025-08-17 11:37:08', '2025-08-17 11:37:08', 7827, 0, '2025-08-17 09:56:41', '2025-08-17 11:37:08'),
(2, 'Juan Dela Cruz', 2, 2, '2025-08-17 11:53:28', '2025-08-17 11:53:28', 7907, 0, '2025-08-17 09:56:41', '2025-08-17 11:53:28'),
(3, 'Ana Garcia', 3, 3, '2025-08-17 11:37:07', '2025-08-17 11:37:07', 8726, 0, '2025-08-17 09:56:41', '2025-08-17 11:37:07'),
(4, 'Pedro Rodriguez', 4, 4, '2025-08-17 11:53:39', '2025-08-17 11:53:39', 10618, 0, '2025-08-17 09:56:41', '2025-08-17 11:53:39'),
(5, 'Carmen Lopez', 5, 5, '2025-08-17 11:36:59', '2025-08-17 11:36:59', 10518, 0, '2025-08-17 09:56:41', '2025-08-17 11:36:59'),
(6, 'Roberto Mendoza', 6, 6, '2025-08-17 11:37:14', '2025-08-17 11:37:14', 11433, 0, '2025-08-17 09:56:41', '2025-08-17 11:37:14'),
(7, 'Rosa Fernandez', 7, 7, '2025-08-17 11:53:28', '2025-08-17 11:53:28', 7607, 0, '2025-08-17 09:56:41', '2025-08-17 11:53:28'),
(8, 'Miguel Torres', 8, 8, '2025-08-17 11:37:03', '2025-08-17 11:37:03', 13222, 0, '2025-08-17 09:56:41', '2025-08-17 11:37:03'),
(9, 'Elena Ramos', 9, 9, '2025-08-17 11:37:05', '2025-08-17 11:37:05', 12324, 0, '2025-08-17 09:56:41', '2025-08-17 11:37:05'),
(10, 'Jose Morales', 10, 10, '2025-08-17 11:53:28', '2025-08-17 11:53:28', 7307, 0, '2025-08-17 09:56:41', '2025-08-17 11:53:28'),
(12, 'Andrei', 1, NULL, '2025-09-03 02:18:38', '2025-09-03 02:18:38', 30, 0, '2025-09-03 02:18:08', '2025-09-03 02:18:38');

-- --------------------------------------------------------

--
-- Table structure for table `discounts`
--

CREATE TABLE `discounts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) DEFAULT NULL,
  `type` enum('percentage','fixed_amount') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `discounts`
--

INSERT INTO `discounts` (`id`, `name`, `code`, `type`, `value`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Senior Citizen Discount', 'SENIOR', 'percentage', 20.00, '20% discount for senior citizens', 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(2, 'PWD Discount', 'PWD', 'percentage', 20.00, '20% discount for persons with disability', 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(3, 'Left Overs Fee', 'LEFTOVER', 'fixed_amount', 25.00, 'Fee for leftover food', 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41');

-- --------------------------------------------------------

--
-- Table structure for table `menu_categories`
--

CREATE TABLE `menu_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_categories`
--

INSERT INTO `menu_categories` (`id`, `name`, `description`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Unlimited Menu', 'All-you-can-eat options', 1, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(2, 'Ala Carte Menu', 'Individual menu items', 2, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(3, 'Side Dishes', 'Complementary dishes', 3, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(4, 'Add Ons', 'Additional items and extras', 4, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41');

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `product_code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `purchase_price` decimal(10,2) DEFAULT NULL,
  `purchase_value` decimal(10,2) DEFAULT NULL,
  `quantity_in_stock` int(11) DEFAULT 0,
  `unit_type` varchar(20) DEFAULT 'piece',
  `availability` enum('available','out_of_stock','discontinued') DEFAULT 'available',
  `image_url` varchar(255) DEFAULT NULL,
  `is_unlimited` tinyint(1) DEFAULT 0,
  `is_premium` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `product_code`, `name`, `description`, `category_id`, `selling_price`, `purchase_price`, `purchase_value`, `quantity_in_stock`, `unit_type`, `availability`, `image_url`, `is_unlimited`, `is_premium`, `created_at`, `updated_at`) VALUES
(1, 'SET-A', 'SET A UNLI PORK', NULL, 1, 299.00, 250.00, 0.00, 996, 'set', 'available', NULL, 1, 0, '2025-08-17 09:56:41', '2025-08-25 09:10:36'),
(2, 'SET-B', 'SET B UNLI PORK & CHICKEN', NULL, 1, 349.00, 300.00, NULL, 999, 'set', 'available', NULL, 1, 0, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(3, 'SET-C', 'SET C UNLI PREMIUM PORK', NULL, 1, 399.00, 350.00, NULL, 999, 'set', 'available', NULL, 1, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(4, 'SET-D', 'SET D UNLI PREMIUM PORK & CHICKEN', NULL, 1, 449.00, 400.00, NULL, 999, 'set', 'available', NULL, 1, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(5, 'SAMG-PORK', 'SAMG PORK ON CUP', NULL, 2, 89.00, 70.00, NULL, 44, 'cup', 'available', NULL, 0, 0, '2025-08-17 09:56:41', '2025-08-17 11:12:59'),
(6, 'SAMG-CHICKEN', 'SAMG CHICKEN ON CUP', NULL, 2, 89.00, 70.00, NULL, 31, 'cup', 'available', NULL, 0, 0, '2025-08-17 09:56:41', '2025-08-17 11:12:59'),
(7, 'SAMG-BEEF', 'SAMG BEEF ON CUP', NULL, 2, 99.00, 80.00, NULL, 27, 'cup', 'available', NULL, 0, 0, '2025-08-17 09:56:41', '2025-08-17 11:12:20'),
(8, 'CHICKEN-POP', 'CHICKEN POPPERS ON CUP', NULL, 2, 79.00, 60.00, NULL, 13, 'cup', 'available', NULL, 0, 0, '2025-08-17 09:56:41', '2025-08-17 11:12:59'),
(9, 'KOREAN-MEET', 'KOREAN MEET ON CUP', NULL, 2, 89.00, 70.00, NULL, NULL, 'cup', 'available', NULL, 0, 0, '2025-08-17 09:56:41', '2025-08-17 09:59:32'),
(10, 'CHEESE', 'CHEESE', NULL, 2, 45.00, 35.00, NULL, 23, 'slice', 'available', NULL, 0, 0, '2025-08-17 09:56:41', '2025-08-17 11:12:59'),
(11, 'FISHCAKE', 'FISHCAKE ON TUB', NULL, 3, 65.00, 50.00, NULL, 21, 'tub', 'available', NULL, 0, 0, '2025-08-17 09:56:41', '2025-09-07 14:04:17'),
(12, 'EGGROLL', 'EGGROLL ON TUB', NULL, 3, 55.00, 40.00, NULL, 18, 'tub', 'available', NULL, 0, 0, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(13, 'BABY-POTATO', 'BABY POTATOES ON TUB', NULL, 3, 60.00, 45.00, NULL, 25, 'tub', 'available', NULL, 0, 0, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(14, 'KIMCHI', 'KIMCHI ON TUB', NULL, 3, 50.00, 35.00, NULL, 11, 'tub', 'available', NULL, 0, 0, '2025-08-17 09:56:41', '2025-09-07 14:04:17'),
(15, 'UNLI-CHEESE', 'UNLI CHEESE', NULL, 4, 75.00, 60.00, NULL, 34, 'serving', 'available', NULL, 0, 0, '2025-08-17 09:56:41', '2025-09-07 14:04:17');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_code` varchar(20) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `table_id` int(11) DEFAULT NULL,
  `order_type` enum('dine_in','takeout','delivery') DEFAULT 'dine_in',
  `subtotal` decimal(10,2) DEFAULT 0.00,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('draft','pending','in_progress','completed','cancelled') DEFAULT 'pending',
  `payment_status` enum('pending','paid','partial','refunded') DEFAULT 'pending',
  `order_date` date NOT NULL,
  `order_time` time NOT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `customer_id`, `customer_name`, `table_id`, `order_type`, `subtotal`, `discount_amount`, `tax_amount`, `total_amount`, `status`, `payment_status`, `order_date`, `order_time`, `completed_at`, `notes`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'ORD20250817001', 1, 'Maria Santos', 1, 'dine_in', 398.00, 0.00, 47.76, 445.76, 'completed', 'paid', '2025-08-16', '12:30:00', '2025-08-16 11:26:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(2, 'ORD20250817002', 2, 'Juan Dela Cruz', 3, 'dine_in', 748.00, 0.00, 89.76, 837.76, 'completed', 'paid', '2025-08-16', '19:15:00', '2025-08-16 11:56:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(3, 'ORD20250816001', 3, 'Ana Garcia', 2, 'dine_in', 233.00, 0.00, 27.96, 260.96, 'completed', 'paid', '2025-08-15', '18:45:00', '2025-08-15 11:21:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(4, 'ORD20250815001', 4, 'Pedro Rodriguez', 4, 'dine_in', 399.00, 0.00, 47.88, 446.88, 'completed', 'paid', '2025-08-14', '20:00:00', '2025-08-14 11:31:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(5, 'ORD20250814001', 5, 'Carmen Lopez', 5, 'dine_in', 164.00, 0.00, 19.68, 183.68, 'completed', 'paid', '2025-08-13', '13:20:00', '2025-08-13 11:11:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(6, 'ORD20250813001', 6, 'Roberto Mendoza', 6, 'dine_in', 578.00, 0.00, 69.36, 647.36, 'completed', 'paid', '2025-08-12', '19:30:00', '2025-08-12 11:46:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(7, 'ORD20250812001', 7, 'Rosa Fernandez', 7, 'dine_in', 349.00, 0.00, 41.88, 390.88, 'completed', 'paid', '2025-08-11', '17:45:00', '2025-08-11 11:41:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(8, 'ORD20250811001', 8, 'Miguel Torres', 8, 'dine_in', 298.00, 0.00, 35.76, 333.76, 'completed', 'paid', '2025-08-10', '21:00:00', '2025-08-10 11:16:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(9, 'ORD20250810001', 9, 'Elena Ramos', 1, 'dine_in', 453.00, 0.00, 54.36, 507.36, 'completed', 'paid', '2025-08-09', '14:15:00', '2025-08-09 11:26:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(10, 'ORD20250809001', 10, 'Jose Morales', 2, 'dine_in', 234.00, 0.00, 28.08, 262.08, 'completed', 'paid', '2025-08-08', '16:30:00', '2025-08-08 11:06:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(11, 'ORD20250808001', 1, 'Maria Santos', 3, 'dine_in', 349.00, 0.00, 41.88, 390.88, 'completed', 'paid', '2025-08-07', '12:00:00', '2025-08-07 11:21:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(12, 'ORD20250807001', 2, 'Juan Dela Cruz', 4, 'dine_in', 567.00, 0.00, 68.04, 635.04, 'completed', 'paid', '2025-08-06', '20:15:00', '2025-08-06 11:51:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(13, 'ORD20250806001', 3, 'Ana Garcia', 5, 'dine_in', 179.00, 0.00, 21.48, 200.48, 'completed', 'paid', '2025-08-05', '18:20:00', '2025-08-05 11:01:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(14, 'ORD20250805001', 4, 'Pedro Rodriguez', 6, 'dine_in', 399.00, 0.00, 47.88, 446.88, 'completed', 'paid', '2025-08-04', '19:45:00', '2025-08-04 11:31:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(15, 'ORD20250804001', 5, 'Carmen Lopez', 7, 'dine_in', 234.00, 0.00, 28.08, 262.08, 'completed', 'paid', '2025-08-03', '15:30:00', '2025-08-03 11:11:41', NULL, 1, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(19, 'ORD20250817019', NULL, 'Walk-in Customer', NULL, 'dine_in', 223.00, 0.00, 20.00, 243.00, 'completed', 'paid', '2025-08-17', '19:12:20', NULL, NULL, 1, '2025-08-17 11:12:20', '2025-08-17 11:12:20'),
(20, 'ORD20250817020', NULL, 'Andrei Gallanosa', 1, 'dine_in', 391.00, 0.00, 20.00, 411.00, 'completed', 'paid', '2025-08-17', '19:12:59', '2025-08-17 11:35:56', NULL, 1, '2025-08-17 11:12:59', '2025-08-18 00:57:36'),
(21, 'ORD20250825001', NULL, 'Andoi Gallanosa', 10, 'dine_in', 897.00, 179.40, 20.00, 737.60, 'completed', 'paid', '2025-08-25', '16:59:51', '2025-08-25 09:00:02', NULL, 1, '2025-08-25 08:59:51', '2025-08-25 09:00:02'),
(22, 'ORD20250907001', NULL, 'Walk-in Customer', NULL, 'dine_in', 1087.00, 0.00, 20.00, 1107.00, 'completed', 'paid', '2025-09-07', '22:04:17', NULL, NULL, 1, '2025-09-07 14:04:17', '2025-09-07 14:04:17');

-- --------------------------------------------------------

--
-- Table structure for table `order_discounts`
--

CREATE TABLE `order_discounts` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `discount_id` int(11) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `special_instructions` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `menu_item_id`, `quantity`, `unit_price`, `total_price`, `special_instructions`, `created_at`) VALUES
(1, 1, 1, 1, 299.00, 299.00, NULL, '2025-08-17 09:56:41'),
(2, 1, 11, 1, 65.00, 65.00, NULL, '2025-08-17 09:56:41'),
(3, 1, 10, 3, 45.00, 135.00, NULL, '2025-08-17 09:56:41'),
(4, 2, 2, 1, 349.00, 349.00, NULL, '2025-08-17 09:56:41'),
(5, 2, 3, 1, 399.00, 399.00, NULL, '2025-08-17 09:56:41'),
(6, 3, 5, 1, 89.00, 89.00, NULL, '2025-08-17 09:56:41'),
(7, 3, 6, 1, 89.00, 89.00, NULL, '2025-08-17 09:56:41'),
(8, 3, 12, 1, 55.00, 55.00, NULL, '2025-08-17 09:56:41'),
(9, 4, 3, 1, 399.00, 399.00, NULL, '2025-08-17 09:56:41'),
(10, 5, 11, 1, 65.00, 65.00, NULL, '2025-08-17 09:56:41'),
(11, 5, 12, 1, 55.00, 55.00, NULL, '2025-08-17 09:56:41'),
(12, 5, 10, 1, 45.00, 45.00, NULL, '2025-08-17 09:56:41'),
(13, 6, 2, 1, 349.00, 349.00, NULL, '2025-08-17 09:56:41'),
(14, 6, 13, 2, 60.00, 120.00, NULL, '2025-08-17 09:56:41'),
(15, 6, 14, 2, 50.00, 100.00, NULL, '2025-08-17 09:56:41'),
(16, 6, 10, 2, 45.00, 90.00, NULL, '2025-08-17 09:56:41'),
(17, 7, 2, 1, 349.00, 349.00, NULL, '2025-08-17 09:56:41'),
(18, 8, 5, 1, 89.00, 89.00, NULL, '2025-08-17 09:56:41'),
(19, 8, 7, 1, 99.00, 99.00, NULL, '2025-08-17 09:56:41'),
(20, 8, 14, 2, 50.00, 100.00, NULL, '2025-08-17 09:56:41'),
(21, 8, 10, 1, 45.00, 45.00, NULL, '2025-08-17 09:56:41'),
(22, 9, 4, 1, 449.00, 449.00, NULL, '2025-08-17 09:56:41'),
(23, 9, 10, 1, 45.00, 45.00, NULL, '2025-08-17 09:56:41'),
(24, 10, 8, 2, 79.00, 158.00, NULL, '2025-08-17 09:56:41'),
(25, 10, 11, 1, 65.00, 65.00, NULL, '2025-08-17 09:56:41'),
(26, 10, 10, 1, 45.00, 45.00, NULL, '2025-08-17 09:56:41'),
(27, 11, 2, 1, 349.00, 349.00, NULL, '2025-08-17 09:56:41'),
(28, 12, 1, 1, 299.00, 299.00, NULL, '2025-08-17 09:56:41'),
(29, 12, 11, 1, 65.00, 65.00, NULL, '2025-08-17 09:56:41'),
(30, 12, 12, 1, 55.00, 55.00, NULL, '2025-08-17 09:56:41'),
(31, 12, 13, 2, 60.00, 120.00, NULL, '2025-08-17 09:56:41'),
(32, 12, 14, 1, 50.00, 50.00, NULL, '2025-08-17 09:56:41'),
(33, 13, 6, 1, 89.00, 89.00, NULL, '2025-08-17 09:56:41'),
(34, 13, 10, 2, 45.00, 90.00, NULL, '2025-08-17 09:56:41'),
(35, 14, 3, 1, 399.00, 399.00, NULL, '2025-08-17 09:56:41'),
(36, 15, 8, 2, 79.00, 158.00, NULL, '2025-08-17 09:56:41'),
(37, 15, 11, 1, 65.00, 65.00, NULL, '2025-08-17 09:56:41'),
(38, 15, 10, 1, 45.00, 45.00, NULL, '2025-08-17 09:56:41'),
(47, 19, 7, 1, 99.00, 99.00, NULL, '2025-08-17 11:12:20'),
(48, 19, 8, 1, 79.00, 79.00, NULL, '2025-08-17 11:12:20'),
(49, 19, 10, 1, 45.00, 45.00, NULL, '2025-08-17 11:12:20'),
(50, 20, 6, 1, 89.00, 89.00, NULL, '2025-08-17 11:12:59'),
(51, 20, 5, 1, 89.00, 89.00, NULL, '2025-08-17 11:12:59'),
(52, 20, 9, 1, 89.00, 89.00, NULL, '2025-08-17 11:12:59'),
(53, 20, 8, 1, 79.00, 79.00, NULL, '2025-08-17 11:12:59'),
(54, 20, 10, 1, 45.00, 45.00, NULL, '2025-08-17 11:12:59'),
(55, 21, 1, 3, 299.00, 897.00, NULL, '2025-08-25 08:59:51'),
(56, 22, 1, 3, 299.00, 897.00, NULL, '2025-09-07 14:04:17'),
(57, 22, 11, 1, 65.00, 65.00, NULL, '2025-09-07 14:04:17'),
(58, 22, 15, 1, 75.00, 75.00, NULL, '2025-09-07 14:04:17'),
(59, 22, 14, 1, 50.00, 50.00, NULL, '2025-09-07 14:04:17');

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `id` int(11) NOT NULL,
  `receipt_number` varchar(20) NOT NULL,
  `order_id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL,
  `generated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `printed_at` timestamp NULL DEFAULT NULL,
  `email_sent_at` timestamp NULL DEFAULT NULL,
  `is_voided` tinyint(1) DEFAULT 0,
  `void_reason` text DEFAULT NULL,
  `voided_at` timestamp NULL DEFAULT NULL,
  `voided_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `receipts`
--

INSERT INTO `receipts` (`id`, `receipt_number`, `order_id`, `transaction_id`, `customer_name`, `subtotal`, `discount_amount`, `tax_amount`, `total_amount`, `generated_at`, `printed_at`, `email_sent_at`, `is_voided`, `void_reason`, `voided_at`, `voided_by`) VALUES
(1, 'RCP20250817001', 1, 1, 'Maria Santos', 398.00, 0.00, 47.76, 445.76, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(2, 'RCP20250817002', 2, 2, 'Juan Dela Cruz', 748.00, 0.00, 89.76, 837.76, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(3, 'RCP20250816001', 3, 3, 'Ana Garcia', 233.00, 0.00, 27.96, 260.96, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(4, 'RCP20250815001', 4, 4, 'Pedro Rodriguez', 399.00, 0.00, 47.88, 446.88, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(5, 'RCP20250814001', 5, 5, 'Carmen Lopez', 164.00, 0.00, 19.68, 183.68, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(6, 'RCP20250813001', 6, 6, 'Roberto Mendoza', 578.00, 0.00, 69.36, 647.36, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(7, 'RCP20250812001', 7, 7, 'Rosa Fernandez', 349.00, 0.00, 41.88, 390.88, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(8, 'RCP20250811001', 8, 8, 'Miguel Torres', 298.00, 0.00, 35.76, 333.76, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(9, 'RCP20250810001', 9, 9, 'Elena Ramos', 453.00, 0.00, 54.36, 507.36, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(10, 'RCP20250809001', 10, 10, 'Jose Morales', 234.00, 0.00, 28.08, 262.08, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(11, 'RCP20250808001', 11, 11, 'Maria Santos', 349.00, 0.00, 41.88, 390.88, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(12, 'RCP20250807001', 12, 12, 'Juan Dela Cruz', 567.00, 0.00, 68.04, 635.04, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(13, 'RCP20250806001', 13, 13, 'Ana Garcia', 179.00, 0.00, 21.48, 200.48, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(14, 'RCP20250805001', 14, 14, 'Pedro Rodriguez', 399.00, 0.00, 47.88, 446.88, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(15, 'RCP20250804001', 15, 15, 'Carmen Lopez', 234.00, 0.00, 28.08, 262.08, '2025-08-17 09:56:41', NULL, NULL, 0, NULL, NULL, NULL),
(16, 'RCP20250817019', 19, NULL, 'Walk-in Customer', 223.00, 0.00, 20.00, 243.00, '2025-08-17 11:12:20', NULL, NULL, 0, NULL, NULL, NULL),
(17, 'RCP20250907001', 22, 19, 'Walk-in Customer', 1087.00, 0.00, 20.00, 1107.00, '2025-09-07 14:04:17', NULL, NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `refill_requests`
--

CREATE TABLE `refill_requests` (
  `id` int(11) NOT NULL,
  `table_code` varchar(20) NOT NULL,
  `table_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
  `request_type` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `processed_by` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `refill_requests`
--

INSERT INTO `refill_requests` (`id`, `table_code`, `table_id`, `customer_id`, `status`, `request_type`, `price`, `requested_at`, `completed_at`, `processed_by`, `notes`) VALUES
(1, '00001', 1, 1, 'completed', 'Pork Kimchi', 200.00, '2025-08-17 09:26:41', '2025-08-17 11:29:58', 1, NULL),
(2, '00002', 2, 2, 'completed', 'Pork Kimchi', 200.00, '2025-08-17 09:41:41', '2025-08-25 09:01:11', 1, NULL),
(3, '00003', 3, 3, 'completed', 'Pork Kimchi', 200.00, '2025-08-17 09:11:41', NULL, 1, NULL),
(4, '00004', 4, 4, 'completed', 'Pork Kimchi', 200.00, '2025-08-17 08:56:41', NULL, 1, NULL),
(5, '00005', 5, 5, 'completed', 'Pork Kimchi', 200.00, '2025-08-17 08:41:41', NULL, 1, NULL),
(6, '00006', 6, 6, 'completed', 'Pork Kimchi', 200.00, '2025-08-17 08:26:41', NULL, 1, NULL),
(7, '00007', 7, 7, 'completed', 'Pork Kimchi', 200.00, '2025-08-17 09:46:41', '2025-08-25 09:01:11', 1, NULL),
(8, '00008', 8, 8, 'completed', 'Pork Kimchi', 200.00, '2025-08-17 07:56:41', NULL, 1, NULL),
(9, '00009', 9, 9, 'completed', 'Pork Kimchi', 200.00, '2025-08-17 08:11:41', NULL, 1, NULL),
(10, '00010', 10, 10, 'completed', 'Pork Kimchi', 200.00, '2025-08-17 09:51:41', '2025-08-25 09:01:08', 1, NULL),
(11, '00011', 11, NULL, 'completed', 'Pork Kimchi', 200.00, '2025-08-17 09:36:41', '2025-08-25 09:01:12', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `reservation_code` varchar(20) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `table_id` int(11) DEFAULT NULL,
  `occasion` varchar(100) DEFAULT NULL,
  `number_of_guests` int(11) NOT NULL,
  `reservation_date` date NOT NULL,
  `reservation_time` time NOT NULL,
  `duration_hours` int(11) DEFAULT 2,
  `payment_amount` decimal(10,2) DEFAULT 0.00,
  `payment_status` enum('pending','paid','cancelled') DEFAULT 'pending',
  `status` enum('pending','confirmed','in_progress','completed','cancelled') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `reservation_code`, `customer_id`, `customer_name`, `phone`, `email`, `table_id`, `occasion`, `number_of_guests`, `reservation_date`, `reservation_time`, `duration_hours`, `payment_amount`, `payment_status`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'RES20250818001', NULL, 'Carlos Rivera', '09171234567', 'carlos.rivera@email.com', 1, 'Birthday celebration', 4, '2025-08-18', '18:00:00', 2, 0.00, 'pending', 'confirmed', 'Requested corner table', '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(2, 'RES20250819001', NULL, 'Lisa Chen', '09281234567', 'lisa.chen@email.com', 7, 'Business dinner', 6, '2025-08-19', '19:30:00', 2, 0.00, 'pending', 'confirmed', 'Large group dinner', '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(3, 'RES20250818002', NULL, 'Mark Johnson', '09391234567', 'mark.johnson@email.com', 5, 'Lunch meeting', 2, '2025-08-18', '12:00:00', 2, 0.00, 'pending', 'pending', 'Lunch meeting', '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(4, 'RES20250820001', NULL, 'Sarah Williams', '09401234567', 'sarah.williams@email.com', 7, 'Anniversary dinner', 8, '2025-08-20', '20:00:00', 2, 0.00, 'pending', 'confirmed', 'Requested romantic setting', '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(5, 'RES20250818003', NULL, 'David Brown', '09511234567', 'david.brown@email.com', 3, 'Family dinner', 3, '2025-08-18', '17:00:00', 2, 0.00, 'pending', 'confirmed', 'Family dinner', '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(6, 'RES20250821001', NULL, 'Emily Dave', '09621234567', 'emily.davis@email.com', 6, 'Team meeting', 5, '2025-08-20', '18:30:00', 2, 0.00, 'pending', 'confirmed', 'Business dinner', '2025-08-17 09:56:41', '2025-09-07 13:55:12'),
(7, 'RES20250819002', NULL, 'Michael Wilson', '09731234567', 'michael.wilson@email.com', 4, 'Regular visit', 4, '2025-08-19', '19:00:00', 2, 0.00, 'pending', 'confirmed', 'Regular customer', '2025-08-17 09:56:41', '2025-08-17 14:22:29'),
(8, 'RES20250822001', NULL, 'Jessica Martin', '09841234567', 'jessica.martinez@email.com', 7, 'Birthday party', 6, '2025-08-20', '20:30:00', 2, 0.00, 'pending', 'confirmed', 'Group celebration', '2025-08-17 09:56:41', '2025-09-03 02:47:03'),
(9, 'RES20250818004', NULL, 'Andrew Taylor', '09951234567', 'andrew.taylor@email.com', 2, 'Business lunch', 2, '2025-08-18', '13:30:00', 2, 0.00, 'pending', 'pending', 'Business lunch', '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(10, 'RES20250820002', NULL, 'Jennifer Garcia', '09061234567', 'jennifer.garcia@email.com', 1, 'Wedding anniversary', 4, '2025-08-20', '18:00:00', 2, 0.00, 'pending', 'confirmed', 'Special occasion', '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(11, 'RES20250816001', NULL, 'Robert Lee', '09171234568', 'robert.lee@email.com', 3, 'Regular dinner', 3, '2025-08-16', '19:00:00', 2, 0.00, 'pending', 'completed', 'Completed reservation', '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(12, 'RES20250815001', NULL, 'Amanda Clark', '09281234568', 'amanda.clark@email.com', 6, 'Birthday dinner', 5, '2025-08-15', '18:30:00', 2, 0.00, 'pending', 'completed', 'Past reservation', '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(13, 'RES20250816002', NULL, 'Daniel Rodriguez', '09391234568', 'daniel.rodriguez@email.com', 5, 'Lunch', 2, '2025-08-16', '12:30:00', 2, 0.00, 'pending', 'cancelled', 'Customer cancelled', '2025-08-17 09:56:41', '2025-08-17 09:56:41');

-- --------------------------------------------------------

--
-- Table structure for table `restaurant_tables`
--

CREATE TABLE `restaurant_tables` (
  `id` int(11) NOT NULL,
  `table_number` varchar(10) NOT NULL,
  `table_code` varchar(20) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 4,
  `status` enum('available','occupied','reserved','maintenance') DEFAULT 'available',
  `location` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restaurant_tables`
--

INSERT INTO `restaurant_tables` (`id`, `table_number`, `table_code`, `capacity`, `status`, `location`, `created_at`, `updated_at`) VALUES
(1, '1', '00001', 4, 'available', NULL, '2025-08-17 09:56:41', '2025-09-03 02:18:38'),
(2, '2', '00002', 4, 'available', NULL, '2025-08-17 09:56:41', '2025-08-17 11:53:28'),
(3, '3', '00003', 6, 'available', NULL, '2025-08-17 09:56:41', '2025-08-17 11:37:07'),
(4, '4', '00004', 4, 'available', NULL, '2025-08-17 09:56:41', '2025-08-17 11:53:39'),
(5, '5', '00005', 2, 'available', NULL, '2025-08-17 09:56:41', '2025-08-17 11:36:59'),
(6, '6', '00006', 4, 'available', NULL, '2025-08-17 09:56:41', '2025-08-17 11:37:14'),
(7, '7', '00007', 8, 'available', NULL, '2025-08-17 09:56:41', '2025-08-17 11:53:28'),
(8, '8', '00008', 4, 'available', NULL, '2025-08-17 09:56:41', '2025-08-17 11:37:03'),
(9, '9', '00009', 4, 'available', NULL, '2025-08-17 09:56:41', '2025-08-17 11:37:05'),
(10, '10', '00010', 4, 'available', NULL, '2025-08-17 09:56:41', '2025-08-17 11:53:28'),
(11, '11', '00011', 4, 'available', NULL, '2025-08-17 09:56:41', '2025-08-17 11:53:36');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `transaction_code` varchar(20) NOT NULL,
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `payment_method` enum('cash','card','gcash','bank_transfer') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed','cancelled') DEFAULT 'pending',
  `reference_number` varchar(100) DEFAULT NULL,
  `payment_date` date NOT NULL,
  `payment_time` time NOT NULL,
  `processed_by` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `transaction_code`, `order_id`, `customer_id`, `payment_method`, `amount`, `status`, `reference_number`, `payment_date`, `payment_time`, `processed_by`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'TXN20250817001', 1, 1, 'cash', 445.76, 'completed', 'CASH001', '2025-08-16', '12:35:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(2, 'TXN20250817002', 2, 2, 'card', 837.76, 'completed', 'CARD002', '2025-08-16', '19:20:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(3, 'TXN20250816001', 3, 3, 'gcash', 260.96, 'completed', 'GCASH003', '2025-08-15', '18:50:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(4, 'TXN20250815001', 4, 4, 'cash', 446.88, 'completed', 'CASH004', '2025-08-14', '20:05:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(5, 'TXN20250814001', 5, 5, 'card', 183.68, 'completed', 'CARD005', '2025-08-13', '13:25:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(6, 'TXN20250813001', 6, 6, 'gcash', 647.36, 'completed', 'GCASH006', '2025-08-12', '19:35:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(7, 'TXN20250812001', 7, 7, 'cash', 390.88, 'completed', 'CASH007', '2025-08-11', '17:50:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(8, 'TXN20250811001', 8, 8, 'card', 333.76, 'completed', 'CARD008', '2025-08-10', '21:05:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(9, 'TXN20250810001', 9, 9, 'gcash', 507.36, 'completed', 'GCASH009', '2025-08-09', '14:20:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(10, 'TXN20250809001', 10, 10, 'cash', 262.08, 'completed', 'CASH010', '2025-08-08', '16:35:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(11, 'TXN20250808001', 1, 1, 'card', 390.88, 'completed', 'CARD011', '2025-08-07', '12:05:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(12, 'TXN20250807001', 2, 2, 'gcash', 635.04, 'completed', 'GCASH012', '2025-08-06', '20:20:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(13, 'TXN20250806001', 3, 3, 'cash', 200.48, 'completed', 'CASH013', '2025-08-05', '18:25:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(14, 'TXN20250805001', 4, 4, 'card', 446.88, 'completed', 'CARD014', '2025-08-04', '19:50:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(15, 'TXN20250804001', 5, 5, 'gcash', 262.08, 'completed', 'GCASH015', '2025-08-03', '15:35:00', 1, NULL, '2025-08-17 09:56:41', '2025-08-17 09:56:41'),
(17, 'TXN20250817020', 20, NULL, 'cash', 411.00, 'completed', 'CASH556333', '2025-08-17', '19:35:56', 1, NULL, '2025-08-17 11:35:56', '2025-08-17 11:35:56'),
(18, 'TXN20250825001', 21, NULL, 'gcash', 737.60, 'completed', 'GCASH402786', '2025-08-25', '17:00:02', 1, NULL, '2025-08-25 09:00:02', '2025-08-25 09:00:02'),
(19, 'TXN20250907001', 22, NULL, 'cash', 1107.00, 'completed', 'CASH857437', '2025-09-07', '22:04:17', 1, NULL, '2025-09-07 14:04:17', '2025-09-07 14:04:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_code` (`customer_code`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_customers_email` (`email`),
  ADD KEY `idx_customers_phone` (`phone`),
  ADD KEY `idx_customers_active` (`is_active`);

--
-- Indexes for table `customer_feedback`
--
ALTER TABLE `customer_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `responded_by` (`responded_by`);

--
-- Indexes for table `customer_timers`
--
ALTER TABLE `customer_timers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `idx_timers_table` (`table_id`),
  ADD KEY `idx_timers_active` (`is_active`),
  ADD KEY `idx_timers_start` (`start_time`);

--
-- Indexes for table `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `menu_categories`
--
ALTER TABLE `menu_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_code` (`product_code`),
  ADD KEY `idx_menu_items_category` (`category_id`),
  ADD KEY `idx_menu_items_availability` (`availability`),
  ADD KEY `idx_menu_items_code` (`product_code`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_orders_customer` (`customer_id`),
  ADD KEY `idx_orders_table` (`table_id`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_date` (`order_date`),
  ADD KEY `idx_orders_code` (`order_code`);

--
-- Indexes for table `order_discounts`
--
ALTER TABLE `order_discounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `discount_id` (`discount_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `menu_item_id` (`menu_item_id`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `receipt_number` (`receipt_number`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `voided_by` (`voided_by`);

--
-- Indexes for table `refill_requests`
--
ALTER TABLE `refill_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `table_id` (`table_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `processed_by` (`processed_by`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reservation_code` (`reservation_code`),
  ADD KEY `idx_reservations_customer` (`customer_id`),
  ADD KEY `idx_reservations_table` (`table_id`),
  ADD KEY `idx_reservations_date` (`reservation_date`),
  ADD KEY `idx_reservations_status` (`status`);

--
-- Indexes for table `restaurant_tables`
--
ALTER TABLE `restaurant_tables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `table_number` (`table_number`),
  ADD UNIQUE KEY `table_code` (`table_code`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_code` (`transaction_code`),
  ADD KEY `processed_by` (`processed_by`),
  ADD KEY `idx_transactions_order` (`order_id`),
  ADD KEY `idx_transactions_customer` (`customer_id`),
  ADD KEY `idx_transactions_date` (`payment_date`),
  ADD KEY `idx_transactions_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `customer_feedback`
--
ALTER TABLE `customer_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `customer_timers`
--
ALTER TABLE `customer_timers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `discounts`
--
ALTER TABLE `discounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `menu_categories`
--
ALTER TABLE `menu_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `order_discounts`
--
ALTER TABLE `order_discounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `receipts`
--
ALTER TABLE `receipts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `refill_requests`
--
ALTER TABLE `refill_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `restaurant_tables`
--
ALTER TABLE `restaurant_tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_feedback`
--
ALTER TABLE `customer_feedback`
  ADD CONSTRAINT `customer_feedback_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_feedback_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_feedback_ibfk_3` FOREIGN KEY (`responded_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_timers`
--
ALTER TABLE `customer_timers`
  ADD CONSTRAINT `customer_timers_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`),
  ADD CONSTRAINT `customer_timers_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `menu_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_discounts`
--
ALTER TABLE `order_discounts`
  ADD CONSTRAINT `order_discounts_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_discounts_ibfk_2` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`);

--
-- Constraints for table `receipts`
--
ALTER TABLE `receipts`
  ADD CONSTRAINT `receipts_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `receipts_ibfk_2` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `receipts_ibfk_3` FOREIGN KEY (`voided_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `refill_requests`
--
ALTER TABLE `refill_requests`
  ADD CONSTRAINT `refill_requests_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`),
  ADD CONSTRAINT `refill_requests_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `refill_requests_ibfk_3` FOREIGN KEY (`processed_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`processed_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
