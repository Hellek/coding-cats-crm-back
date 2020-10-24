CREATE TABLE catabase.roles (
	`id` SMALLINT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
	`label` VARCHAR(150) NOT NULL,
	`rights` VARCHAR(5000) NOT NULL DEFAULT '{}',
	PRIMARY KEY (`id`)
) ENGINE = InnoDB COLLATE=utf8mb4_unicode_ci;

ALTER TABLE catabase.roles ADD UNIQUE `rolesLabel` (`label`);
