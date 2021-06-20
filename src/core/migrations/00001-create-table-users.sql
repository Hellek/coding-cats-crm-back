CREATE TABLE users (
	id serial NOT NULL,
	active boolean NOT NULL DEFAULT FALSE,
	email character varying(50) UNIQUE,
	"firstName" character varying(50),
	"lastName" character varying(50),
	password character varying(80),
	phone character varying(11),
	created timestamp with time zone DEFAULT now(),
	"TIRealToken" character varying(800),
	"TISandboxToken" character varying(800),
	PRIMARY KEY(id)
);