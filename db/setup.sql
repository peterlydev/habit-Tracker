DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    username VARCHAR (30) NOT NULL,
    password VARCHAR (200) NOT NULL
);

DROP TABLE IF EXISTS habits;

CREATE TABLE habits (
    habit_id SERIAL PRIMARY KEY,
    user_id INT,
    habit_name VARCHAR,
    current_streak INT DEFAULT 0,
    frequency VARCHAR,
    curr_repetitions INT DEFAULT 0,
    repetitions INT,
    date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO users (first_name, surname, username, password)
VALUES
    ('Nowshad', 'Ahmed', 'nowshad10', '$2a$10$0ml3qHkeSA9jRUUMmOj7Oein4xdPFEIFMrIxaF3Se9NpTQDm12nxm'),
    -- password is password99
    ('Ousama', 'Bousba', 'ousama1234', '$2a$10$kSSPdH9UPnoVo3vbYDX8u.i0c2gm8d5thuZ3bTP0hsMRi/rtEdTtu'),
    -- password is fcbarca
    ('Peter', 'Ly', 'peterlydev', '$2a$10$FUchlNezmuO8aeHFORv4weW2zkMJTM/OTP3W234YJme7s.HueUe1i'),
    -- password is chelsea
    ('Ikenna', 'Agada', 'ikenna98', '$2a$10$9vq8y9dG.ZR39QbzRF4.IenTtSqOUKWHDckzGxdvTxCH6iwjcdgIi');
    -- password is buildings

INSERT INTO habits (user_id, habit_name, frequency, repetitions)
VALUES
    (1, 'drink a glass of water', 'daily', 4),
    (1, 'take vitamins', 'daily', 1),
    (2, 'drink a glass of water', 'daily', 5),
    (2, 'go running', 'weekly', 3),
    (2, 'go bike riding', 'monthly', 2),
    (3, 'walk the dog', 'daily', 1);
