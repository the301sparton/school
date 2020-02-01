DROP TABLE classlist;


CREATE TABLE `classlist` (
  `className` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacherid` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `schoolId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classlist`
--

INSERT INTO `classlist` (`className`, `section`, `teacherid`, `schoolId`) VALUES
('10th', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 3),
('10th', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 3),
('1st', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('1st', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('2nd', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('2nd', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('3rd', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('3rd', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('4th', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('4th', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('5th', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('5th', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('6th', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('6th', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('7th', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('7th', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 2),
('8th', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 3),
('8th', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 3),
('9th', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 3),
('9th', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 3),
('KG1', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 1),
('KG1', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 1),
('KG2', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 1),
('KG2', 'B', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 1),
('Nursery', 'A', 'bctYSOfFnmYkdXSN70njjYMEYxx2', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classlist`
--
ALTER TABLE `classlist`
  ADD PRIMARY KEY (`className`,`section`);
COMMIT;





CREATE TABLE `schoolId` (
  `schoolId` int(11) NOT NULL,
  `schoolName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schoolId`
--

INSERT INTO `schoolId` (`schoolId`, `schoolName`) VALUES
(1, 'Bengali Balak Mandir'),
(2, 'Bengali Middle (Granted)'),
(3, 'Bengali High');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `schoolId`
--
ALTER TABLE `schoolId`
  ADD PRIMARY KEY (`schoolId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `schoolId`
--
ALTER TABLE `schoolId`
  MODIFY `schoolId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

DROP VIEW classlistview;

CREATE VIEW `classlistview` AS select `classlist`.`className` AS `className`,`classlist`.`section` AS `section`,`users`.`displayName` AS `displayName`,`users`.`uid` AS `uid`, `schoolId`.`schoolName` AS `schoolName`, `schoolId`.`schoolId` AS `schoolId` from (`classlist` INNER join `users` on(`classlist`.`teacherid` = `users`.`uid`)) LEFT join `schoolId` on(`classlist`.`schoolId` = `schoolId`.`schoolId`);