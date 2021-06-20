CREATE TABLE operations (
	userId integer NOT NULL,
	id text,
	status statuses,
	figi text,
	"operationType" operationTypes,
	payment real,
	currency currencies,
	quantity integer,
	"quantityExecuted" integer,
	price real,
	"instrumentType" instrumentTypes,
	date timestamp with time zone,
	"isMarginCall" boolean,
	commission json,
	trades json[],
	FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);