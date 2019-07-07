BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Test','test@test.com',5,'2018-01-01');
INSERT into login (hash,email) values ('$2a$10$CJF/kecG92YYTyj1Ohs1S.evbruyyLiYyeS53eBbGK2m3tlP7i/VK', 'test@test.com');

COMMIT;