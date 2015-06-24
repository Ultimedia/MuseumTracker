-- phpMyAdmin SQL Dump
-- version 4.4.8
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Gegenereerd op: 12 jun 2015 om 09:56
-- Serverversie: 5.5.40-MariaDB-cll-lve
-- PHP-versie: 5.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `deb31925_watm`
--

-- --------------------------------------------------------


--
-- Tabelstructuur voor tabel `mercury_beacons`
--

CREATE TABLE IF NOT EXISTS `mercury_beacons` (
  `mercury_beacon_id` int(11) NOT NULL,
  `mercury_beacon_identifier` varchar(200) NOT NULL,
  `mercury_beacon_device_id` int(11) NOT NULL,
  `mercury_exhibit_id` int(11) NOT NULL,
  `mercury_beacon_uuid` varchar(200) NOT NULL,
  `mercury_room_id` int(11) DEFAULT '0',
  `mercury_media_id` int(11) NOT NULL DEFAULT '0',
  `mercury_museum_id` int(1) NOT NULL,
  `mercury_beacon_visible` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `mercury_exhibits`
--

CREATE TABLE IF NOT EXISTS `mercury_exhibits` (
  `exhibit_id` int(11) NOT NULL,
  `exhibit_museum_id` int(11) NOT NULL,
  `exhibit_title` varchar(200) NOT NULL,
  `exhibit_description` varchar(1000) NOT NULL,
  `exhibit_hash` varchar(200) NOT NULL,
  `exhibit_website` varchar(200) NOT NULL,
  `exhibiti_twitter` varchar(200) NOT NULL,
  `exhibit_facebook` varchar(200) NOT NULL,
  `exhibit_subtitle` varchar(200) NOT NULL,
  `exhibit_cover_image` varchar(300) NOT NULL,
  `exhibit_twitter_enabled` int(11) NOT NULL DEFAULT '1',
  `exhibit_facebook_enabled` int(11) NOT NULL DEFAULT '1',
  `exhibit_adres` varchar(400) NOT NULL,
  `exhibit_opening` varchar(300) NOT NULL,
  `exhibit_visible` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `mercury_feedback`
--

CREATE TABLE IF NOT EXISTS `mercury_feedback` (
  `feedback_id` int(11) NOT NULL,
  `feedback_score` int(11) NOT NULL,
  `feedback_text` varchar(300) NOT NULL,
  `exhibit_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `mercury_museums`
--

CREATE TABLE IF NOT EXISTS `mercury_museums` (
  `museum_id` int(11) NOT NULL,
  `museum_cover` varchar(200) NOT NULL,
  `museum_title` varchar(200) NOT NULL,
  `museum_address` varchar(600) NOT NULL,
  `museum_open` varchar(400) NOT NULL,
  `museum_description` varchar(1000) NOT NULL,
  `museum_website` varchar(300) NOT NULL,
  `museum_twitter` varchar(200) NOT NULL,
  `museum_facebook` varchar(200) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `museum_visible` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `mercury_rooms`
--

CREATE TABLE IF NOT EXISTS `mercury_rooms` (
  `mercury_room_id` int(11) NOT NULL,
  `mercury_room_exhibit_id` int(11) NOT NULL,
  `mercury_room_type` varchar(30) NOT NULL,
  `mercury_room_title` varchar(200) NOT NULL,
  `mercury_room_description` varchar(800) NOT NULL,
  `mercury_room_order` int(200) NOT NULL,
  `mercury_room_visible` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `mercury_rooms_media`
--

CREATE TABLE IF NOT EXISTS `mercury_rooms_media` (
  `mercury_room_media_id` int(11) NOT NULL,
  `mercury_room_id` int(11) NOT NULL,
  `mercury_room_media_caption` varchar(1000) NOT NULL,
  `mercury_room_media_url` varchar(500) NOT NULL,
  `mercury_room_media_type` varchar(300) NOT NULL,
  `mercury_room_media_visible` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `mercury_rooms_social`
--

CREATE TABLE IF NOT EXISTS `mercury_rooms_social` (
  `mercury_room_social_id` int(11) NOT NULL,
  `mercury_room_id` int(11) NOT NULL,
  `mercury_room_social_type` varchar(300) NOT NULL,
  `mercury_room_social_data` varchar(1000) NOT NULL,
  `mercury_user_id` int(11) NOT NULL,
  `mercury_room_social_url` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `mercury_users`
--

CREATE TABLE IF NOT EXISTS `mercury_users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(300) NOT NULL,
  `user_password` varchar(300) NOT NULL,
  `user_email` varchar(200) NOT NULL,
  `user_image` varchar(300) NOT NULL,
  `user_twitterhandle` varchar(200) NOT NULL,
  `user_facebookid` varchar(200) NOT NULL,
  `user_active` int(11) NOT NULL DEFAULT '1',
  `user_admin` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `museum_exhibit_rooms`
--

CREATE TABLE IF NOT EXISTS `museum_exhibit_rooms` (
  `musuem_exhibit_room_id` int(11) NOT NULL,
  `musuem_exhibit_room_title` varchar(200) NOT NULL,
  `musuem_exhibit_id` int(11) NOT NULL,
  `museum_room_title` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Indexen voor tabel `mercury_exhibits`
--
ALTER TABLE `mercury_exhibits`
  ADD PRIMARY KEY (`exhibit_id`);

--
-- Indexen voor tabel `mercury_feedback`
--
ALTER TABLE `mercury_feedback`
  ADD PRIMARY KEY (`feedback_id`);

--
-- Indexen voor tabel `mercury_rooms`
--
ALTER TABLE `mercury_rooms`
  ADD PRIMARY KEY (`mercury_room_id`);

--
-- Indexen voor tabel `mercury_rooms_media`
--
ALTER TABLE `mercury_rooms_media`
  ADD PRIMARY KEY (`mercury_room_media_id`);

--
-- Indexen voor tabel `mercury_rooms_social`
--
ALTER TABLE `mercury_rooms_social`
  ADD PRIMARY KEY (`mercury_room_social_id`);

--
-- AUTO_INCREMENT voor een tabel `mercury_exhibits`
--
ALTER TABLE `mercury_exhibits`
  MODIFY `exhibit_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT voor een tabel `mercury_feedback`
--
ALTER TABLE `mercury_feedback`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT voor een tabel `mercury_rooms`
--
ALTER TABLE `mercury_rooms`
  MODIFY `mercury_room_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT voor een tabel `mercury_rooms_media`
--
ALTER TABLE `mercury_rooms_media`
  MODIFY `mercury_room_media_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT voor een tabel `mercury_rooms_social`
--
ALTER TABLE `mercury_rooms_social`
  MODIFY `mercury_room_social_id` int(11) NOT NULL AUTO_INCREMENT;
