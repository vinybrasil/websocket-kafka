-- Create a new user
CREATE USER 'debezium'@'%' IDENTIFIED BY 'dbz';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON *.* TO 'debezium'@'%' WITH GRANT OPTION;

-- Apply the changes
FLUSH PRIVILEGES;


CREATE DATABASE IF NOT EXISTS gameodds;

-- Step 2: Use the database
USE gameodds;

-- Step 3: Create the 'customers' table
CREATE TABLE IF NOT EXISTS game_123121 (
    row_id INT AUTO_INCREMENT PRIMARY KEY,
    game_id VARCHAR(50) NOT NULL,
    odd1 VARCHAR(50),
    odd2 VARCHAR(50),
    odd3 VARCHAR(50),
    odd4 VARCHAR(50),
    odd5 VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_123122 (
    row_id INT AUTO_INCREMENT PRIMARY KEY,
    game_id VARCHAR(50) NOT NULL,
    odd1 VARCHAR(50),
    odd2 VARCHAR(50),
    odd3 VARCHAR(50),
    odd4 VARCHAR(50),
    odd5 VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Insert random sample values
INSERT INTO game_123121 (game_id, odd1, odd2, odd3, odd4, odd5) VALUES
('123121', '2.01',  '2.01', '2.01', '2.01', '2.01'),
('123121', '2.02',  '2.00', '2.05', '2.06', '2.00');
