-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  127.0.0.1
-- Généré le :  Lun 05 Juin 2017 à 17:57
-- Version du serveur :  5.7.14
-- Version de PHP :  7.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `itineraris`
--

-- --------------------------------------------------------

--
-- Structure de la table `itinerary`
--

CREATE TABLE `itinerary` (
  `id` int(10) NOT NULL,
  `id_User` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `itinerary`
--

INSERT INTO `itinerary` (`id`, `id_User`, `name`, `country`, `description`, `date`) VALUES
(1, 8, 'Vacance au Pérou', 'Peru', 'wahouuuuu', '2017-02-23 15:28:55');

-- --------------------------------------------------------

--
-- Structure de la table `picture`
--

CREATE TABLE `picture` (
  `id` int(10) NOT NULL,
  `id_Step` int(10) DEFAULT NULL,
  `id_Stop` int(10) DEFAULT NULL,
  `url` text NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `date` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `picture`
--

INSERT INTO `picture` (`id`, `id_Step`, `url`, `caption`, `date`) VALUES
(59, 20, '1488630966522-Australie (11).JPG.jpg', 'jour 4', '2017-03-04 13:36:06'),
(57, 19, '1488630896492-Australie (9).JPG.jpg', 'jour 22', '2017-03-04 13:34:56'),
(58, 20, '1488630966420-Australie (10).JPG.jpg', 'jour 3', '2017-03-04 13:36:06'),
(56, 19, '1488630896436-Australie (1).JPG.jpg', 'jour 11', '2017-03-04 13:34:56'),
(60, 21, '1488631691695-Australie (21).JPG.jpg', 'jour 5', '2017-03-04 13:48:11'),
(61, 21, '1488631691788-Australie (22).JPG.jpg', 'jour 6', '2017-03-04 13:48:11'),
(62, 22, '1488631842053-Australie (51).JPG.jpg', 'photo 10', '2017-03-04 13:50:42'),
(63, 22, '1488631842149-Australie (52).JPG.jpg', '1231e g', '2017-03-04 13:50:42');

-- --------------------------------------------------------

--
-- Structure de la table `step`
--

CREATE TABLE `step` (
  `id` int(10) NOT NULL,
  `id_Itinerary` int(10) NOT NULL,
  `city` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `type` varchar(100) NOT NULL DEFAULT 'DRIVING',
  `position` int(10) NOT NULL DEFAULT '0',
  `date` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `step`
--

INSERT INTO `step` (`id`, `id_Itinerary`, `city`, `description`, `lat`, `lng`, `type`, `position`, `date`) VALUES
(20, 1, 'Huancayo', 'Capitale tu trekking ! on va v\'oir ça !', -12.0686357, -75.21029759999999, 'DRIVING', 6, '2017-08-28 00:00:00'),
(19, 1, 'Lima', 'la capitale ! Sympa!', -12.046374, -77.0427934, 'DRIVING', 5, '2017-08-24 00:00:00'),
(21, 1, 'Paracas', 'Un peu de mer et de désert :D', -13.8409149, -76.25083039999998, 'DRIVING', 7, '2017-08-31 00:00:00'),
(22, 1, 'Matucana', 'oasis de fou', -11.8407317, -76.37964529999999, 'DRIVING', 4, '2017-09-05 00:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `step details`
--

CREATE TABLE `stepDetail` (
  `id` int(10) NOT NULL,
  `id_Step` int(10) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'restaurant',
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `description` text DEFAULT NULL,
  `date` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Structure de la table `stop`
--

CREATE TABLE `stop` (
  `id` int(10) NOT NULL,
  `id_Itinerary` int(10) NOT NULL,
  `city` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `position` int(10) NOT NULL DEFAULT '0',
  `date` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `date`) VALUES
(8, 'titou', 'titou@titou.titou', '593229a2563091ade6af3c5623a49e31a574ded1', '2017-02-22 15:48:27'),
(13, 'juju', 'juju@juju.juju', '7fdfe229fce69a4d7f38653f3755ccbae5703f88', '2017-02-28 14:11:54');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `itinerary`
--
ALTER TABLE `itinerary`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `picture`
--
ALTER TABLE `picture`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `step`
--
ALTER TABLE `step`
  ADD PRIMARY KEY (`id`);
  
--
-- Index pour la table `step`
--
ALTER TABLE `stepDetail`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `stop`
--
ALTER TABLE `stop`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `itinerary`
--
ALTER TABLE `itinerary`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT pour la table `picture`
--
ALTER TABLE `picture`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;
--
-- AUTO_INCREMENT pour la table `step`
--
ALTER TABLE `step`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
  
ALTER TABLE `stepDetail`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
  
--
-- AUTO_INCREMENT pour la table `stop`
--
ALTER TABLE `stop`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
