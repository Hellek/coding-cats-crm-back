CREATE TABLE roles (
	id serial NOT NULL,
	label text NOT NULL,
	rights json NOT NULL,
	PRIMARY KEY(id),
	UNIQUE(label)
);