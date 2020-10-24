-- Orders statuses
CREATE TABLE catabase.orders_statuses (
	`id` TINYINT(2) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(45) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `name` (`name`)
) ENGINE = InnoDB;

-- Orders comments
CREATE TABLE catabase.orders_comments (
  `order_id` mediumint(8) UNSIGNED NOT NULL,
  `time` DATETIME NULL DEFAULT current_timestamp(),
  `user_id` mediumint(5) UNSIGNED,
  `text` varchar(5000) NOT NULL,
  PRIMARY KEY (`order_id`,`time`)
) ENGINE=InnoDB;

ALTER TABLE catabase.orders_comments ADD KEY `user_id` (`user_id`);
ALTER TABLE catabase.orders_comments ADD CONSTRAINT `orders_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

-- Orders
CREATE TABLE catabase.orders (
  `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT,
  `status` tinyint(2) UNSIGNED NOT NULL DEFAULT '1',
  `registered` DATETIME NULL DEFAULT current_timestamp(),
  `recall` DATETIME NULL DEFAULT current_timestamp(),
  `creator` mediumint(5) UNSIGNED NOT NULL,
  `responsible` mediumint(5) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

ALTER TABLE catabase.orders
  ADD KEY `creator` (`creator`),
  ADD KEY `manager` (`responsible`),
  ADD KEY `status` (`status`);

ALTER TABLE catabase.orders
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`responsible`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_5` FOREIGN KEY (`status`) REFERENCES `orders_statuses` (`id`);

-- Orders comments after Orders creation
ALTER TABLE catabase.orders_comments ADD KEY `order_id` (`order_id`);
ALTER TABLE catabase.orders_comments ADD CONSTRAINT `orders_comments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

INSERT INTO catabase.orders_statuses (`name`) VALUES ('Новый'), ('В работе'), ('Отложен'), ('Закрыт'), ('Исполнен');
