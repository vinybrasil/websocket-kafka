CREATE USER 'debezium'@'%' IDENTIFIED BY 'dbz';

GRANT ALL PRIVILEGES ON *.* TO 'debezium'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;


CREATE DATABASE IF NOT EXISTS gameodds;

USE gameodds;


CREATE TABLE IF NOT EXISTS available_games (
    row_id INT AUTO_INCREMENT PRIMARY KEY,
    game_id VARCHAR(50) NOT NULL,
    game_id_name VARCHAR(50) NOT NULL,
    connector_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE IF NOT EXISTS game_123121 (
--     row_id INT AUTO_INCREMENT PRIMARY KEY,
--     game_id VARCHAR(50) NOT NULL,
--     odd1 VARCHAR(50),
--     odd2 VARCHAR(50),
--     odd3 VARCHAR(50),
--     odd4 VARCHAR(50),
--     odd5 VARCHAR(50),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS game_123122 (
--     row_id INT AUTO_INCREMENT PRIMARY KEY,
--     game_id VARCHAR(50) NOT NULL,
--     odd1 VARCHAR(50),
--     odd2 VARCHAR(50),
--     odd3 VARCHAR(50),
--     odd4 VARCHAR(50),
--     odd5 VARCHAR(50),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- INSERT INTO game_123121 (game_id, odd1, odd2, odd3, odd4, odd5) VALUES
-- ('123121', '2.01',  '2.01', '2.01', '2.01', '2.01'),
-- ('123121', '2.02',  '2.00', '2.05', '2.06', '2.00');

