DROP TABLE IF EXISTS offer_categories;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  avatar VARCHAR(50) NOT NULL
);

CREATE TABLE offers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description text NOT NULL,
  sum INTEGER NOT NULL,
  type VARCHAR(5) NOT NULL,
  picture VARCHAR(50),
  user_id INTEGER NOT NULL,
  date TIMESTAMP DEFAULT current_timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  offer_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  text text NOT NULL,
  date TIMESTAMP DEFAULT current_timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (offer_id) REFERENCES offers(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE offer_categories (
  offer_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  CONSTRAINT offer_categories_pk PRIMARY KEY (offer_id, category_id),
  FOREIGN KEY (offer_id) REFERENCES offers(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX ON offers(title);
