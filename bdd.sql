CREATE DATABASE cinehub;

use cinehub;

CREATE USER 'cine_user'@'%' IDENTIFIED BY 'cine_pass';

GRANT SELECT,UPDATE,INSERT,DELETE ON cinehub.* TO 'cine_user'@'%';

FLUSH PRIVILEGES;

CREATE TABLE users (
us_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
us_username VARCHAR(255) NOT NULL UNIQUE,
us_password TEXT NOT NULL,
us_email VARCHAR(255) NOT NULL UNIQUE,
us_role ENUM('user','admin') NOT NULL DEFAULT 'user')
ENGINE=InnoDB;

CREATE TABLE films (
fi_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
fi_title VARCHAR(255) NOT NULL,
fi_description TEXT,
fi_duration INT NOT NULL,
fi_genre VARCHAR(100),
fi_release_date DATE,
fi_is_showing TINYINT(1) NOT NULL DEFAULT 1)
ENGINE=InnoDB;

CREATE TABLE rooms (
ro_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
ro_name VARCHAR(100) NOT NULL UNIQUE,
ro_capacity INT NOT NULL)
ENGINE=InnoDB;

CREATE TABLE screenings (
sc_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
sc_film INT NOT NULL,
sc_room INT NOT NULL,
sc_datetime DATETIME NOT NULL,
sc_price DECIMAL(6,2) NOT NULL,
CONSTRAINT sc_film FOREIGN KEY (sc_film) REFERENCES films(fi_id),
CONSTRAINT sc_room FOREIGN KEY (sc_room) REFERENCES rooms(ro_id))
ENGINE=InnoDB;

CREATE TABLE reservations (
re_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
re_user INT NOT NULL,
re_screening INT NOT NULL,
re_seats INT NOT NULL DEFAULT 1,
re_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
UNIQUE (re_user, re_screening),
CONSTRAINT re_user FOREIGN KEY (re_user) REFERENCES users(us_id),
CONSTRAINT re_screening FOREIGN KEY (re_screening) REFERENCES screenings(sc_id))
ENGINE=InnoDB;

INSERT INTO users(us_username, us_password, us_email, us_role) VALUES
('admin', '$2b$10$Bb5.g/UjCGHv1S5OYqF19OviuDsdk62u0KFfMQySBUqxjIOxGKNTy', 'admin@cinehub.fr', 'admin');

INSERT INTO films(fi_title, fi_description, fi_duration, fi_genre, fi_release_date, fi_is_showing) VALUES
('Inception', 'Un voleur entre dans les reves des gens.', 148, 'Science-fiction', '2010-07-21', 1),
('Le Parrain', 'Une famille de la mafia.', 175, 'Drame', '1972-10-18', 1);

INSERT INTO rooms(ro_name, ro_capacity) VALUES
('Salle 1', 120),
('Salle 2', 80);

INSERT INTO screenings(sc_film, sc_room, sc_datetime, sc_price) VALUES
(1, 1, '2026-12-01 20:30:00', 9.50),
(1, 2, '2026-12-02 18:00:00', 8.00),
(2, 1, '2026-12-03 21:00:00', 9.50);
