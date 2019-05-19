-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 
-- サーバのバージョン： 10.1.38-MariaDB
-- PHP Version: 7.3.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `twitredb`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `twitter_api_tbl`
--

DROP TABLE IF EXISTS `twitter_api_tbl`;
CREATE TABLE `twitter_api_tbl` (
  `id` bigint(100) NOT NULL,
  `id_str` varchar(100) DEFAULT NULL,
  `screen_name` varchar(100) DEFAULT NULL,
  `created_at` varchar(200) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `text` varchar(1000) DEFAULT NULL,
  `trend` varchar(100) NOT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `user_id_str` varchar(100) DEFAULT NULL,
  `use_name` varchar(100) DEFAULT NULL,
  `sys_create_date` datetime DEFAULT NULL,
  `hidden_flag` tinyint(1) NOT NULL,
  `delete_flag` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- テーブルの構造 `twitter_sysid_tbl`
--

DROP TABLE IF EXISTS `twitter_sysid_tbl`;
CREATE TABLE `twitter_sysid_tbl` (
  `sys_id` int(255) NOT NULL,
  `created_at` varchar(100) NOT NULL,
  `as_of` varchar(100) NOT NULL,
  `delete_flag` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- テーブルの構造 `twitter_trends_tbl`
--

DROP TABLE IF EXISTS `twitter_trends_tbl`;
CREATE TABLE `twitter_trends_tbl` (
  `sys_id` int(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `tweet_volume` int(255) DEFAULT NULL,
  `query` varchar(1000) NOT NULL,
  `delete_flag` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `twitter_api_tbl`
--
ALTER TABLE `twitter_api_tbl`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `twitter_sysid_tbl`
--
ALTER TABLE `twitter_sysid_tbl`
  ADD PRIMARY KEY (`sys_id`);

--
-- Indexes for table `twitter_trends_tbl`
--
ALTER TABLE `twitter_trends_tbl`
  ADD PRIMARY KEY (`sys_id`,`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `twitter_sysid_tbl`
--
ALTER TABLE `twitter_sysid_tbl`
  MODIFY `sys_id` int(255) NOT NULL AUTO_INCREMENT;

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `twitter_trends_tbl`
--
ALTER TABLE `twitter_trends_tbl`
  ADD CONSTRAINT `twitter_trends_tbl_ibfk_1` FOREIGN KEY (`sys_id`) REFERENCES `twitter_sysid_tbl` (`sys_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
