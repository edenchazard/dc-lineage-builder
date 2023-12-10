SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `saved_lineages` (
  `id` int(10) UNSIGNED NOT NULL,
  `hash` char(40) NOT NULL,
  `last_view` date NOT NULL,
  `hits` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `saved_lineages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hash` (`hash`);

ALTER TABLE `saved_lineages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
COMMIT;