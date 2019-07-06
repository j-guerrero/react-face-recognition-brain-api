BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Tim','tim@gmail.com',5,'2018-01-01');
INSERT into login (hash,email) values ('fakeHash', 'tim@gmail.com');

COMMIT;