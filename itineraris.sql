-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  127.0.0.1
-- Généré le :  Jeu 02 Mars 2017 à 13:36
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
  `url` text NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `date` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `step`
--

CREATE TABLE `step` (
  `id` int(10) NOT NULL,
  `id_Itinerary` int(10) NOT NULL,
  `city` varchar(255) NOT NULL,
  `description` text NOT NULL,
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
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;
--
-- AUTO_INCREMENT pour la table `step`
--
ALTER TABLE `step`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
