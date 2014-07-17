
-- 
-- Table structure for table `categories`
-- 

CREATE TABLE `categories` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `priority` mediumint(9) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

-- --------------------------------------------------------

-- 
-- Table structure for table `todos`
-- 

CREATE TABLE `todos` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `message` tinytext NOT NULL,
  `created` datetime NOT NULL,
  `due` datetime NOT NULL,
  `priority` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `user_id` (`user_id`,`category_id`),
  KEY `priority` (`priority`)
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=latin1 AUTO_INCREMENT=51 ;

-- --------------------------------------------------------

-- 
-- Table structure for table `users`
-- 

CREATE TABLE `users` (
  `id` int(11) NOT NULL auto_increment,
  `display` varchar(12) NOT NULL,
  `user` varchar(12) NOT NULL,
  `password` varchar(12) NOT NULL,
  `email` varchar(50) NOT NULL,
  `logged_in` tinyint(4) NOT NULL,
  `session_id` varchar(27) NOT NULL,
  `twitter_user` varchar(12) NOT NULL,
  `twitter_pass` varchar(12) NOT NULL,
  `joined` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;
