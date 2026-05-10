-- Quotely Database Schema

CREATE DATABASE IF NOT EXISTS quotely CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quotely;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS quotes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(150) NOT NULL DEFAULT 'Unknown',
    user_id INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quotes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS likes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    quote_id INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_quote (user_id, quote_id),
    CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_likes_quote FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed some default quotes (submitted by a system user).
-- This account uses a deliberately invalid password hash ('!locked') so it can
-- never be authenticated via password_verify(), acting as a locked system account.
INSERT INTO users (username, email, password_hash) VALUES
    ('quotely', 'system@quotely.local', '!locked');

INSERT INTO quotes (text, author, user_id) VALUES
    ('The only way to do great work is to love what you do.', 'Steve Jobs', 1),
    ('In the middle of every difficulty lies opportunity.', 'Albert Einstein', 1),
    ('It does not matter how slowly you go as long as you do not stop.', 'Confucius', 1),
    ('Life is what happens when you''re busy making other plans.', 'John Lennon', 1),
    ('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 1),
    ('Spread love everywhere you go. Let no one ever come to you without leaving happier.', 'Mother Teresa', 1),
    ('When you reach the end of your rope, tie a knot in it and hang on.', 'Franklin D. Roosevelt', 1),
    ('Always remember that you are absolutely unique. Just like everyone else.', 'Margaret Mead', 1),
    ('Do not go where the path may lead, go instead where there is no path and leave a trail.', 'Ralph Waldo Emerson', 1),
    ('You will face many defeats in life, but never let yourself be defeated.', 'Maya Angelou', 1);
