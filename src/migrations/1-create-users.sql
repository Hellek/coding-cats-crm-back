CREATE TABLE users (
	phone character varying(11),
	password character varying(80),
	lastName character varying(50),
	firstName character varying(50),
	email character varying(50),
	id serial NOT NULL,
	PRIMARY KEY(id)
);

-- password is "123"
INSERT INTO users(
	email,
	firstName,
	lastName,
	password,
	phone,
	active
) VALUES (
	'admin@admin.notreal',
	'AdminFirstName',
	'AdminLastName',
	'$2a$05$shw2v5WHOVD8VZHLMhu33OHDa5XIRLXeyyTKVgJDlT1R9g6f0nXZG',
	'81112223344',
	'true'
);

-- ALTER TABLE users OWNER to "cat-user";

-- CREATE TABLE catabase.users (
-- 	`id` MEDIUMINT(8) UNSIGNED NOT NULL AUTO_INCREMENT,
-- 	`email` VARCHAR(50) NULL,
-- 	`firstName` VARCHAR(50) NULL,
-- 	`lastName` VARCHAR(50) NULL,
-- 	`password` VARCHAR(75) NULL,
-- 	`phone` VARCHAR(11) NULL,
-- 	`registered` DATETIME NULL,
-- 	`role` SMALLINT(5) UNSIGNED NOT NULL DEFAULT 2,
-- 	`active` TINYINT(1) NOT NULL DEFAULT 0,
-- 	PRIMARY KEY (`id`)
-- ) ENGINE = InnoDB COLLATE=utf8mb4_unicode_ci;

-- ALTER TABLE `users` ADD FOREIGN KEY (`role`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- ALTER TABLE catabase.users ADD UNIQUE `usersEmail` (`email`);