CREATE TABLE ideas (
	id serial NOT NULL,
	userId integer NOT NULL,
	figi text NOT NULL,
	active boolean NOT NULL DEFAULT TRUE,
	created timestamp with time zone DEFAULT now(),
	FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
	PRIMARY KEY(id)
);

CREATE TABLE ideasComments (
	id serial NOT NULL,
	ideaId integer NOT NULL,
	text text NOT NULL,
	posted timestamp with time zone DEFAULT now(),
	FOREIGN KEY (ideaId) REFERENCES ideas (id) ON DELETE CASCADE,
	PRIMARY KEY(id)
);