ALTER TABLE operations DROP CONSTRAINT operations_id_key;
ALTER TABLE operations ADD UNIQUE (id, userId);