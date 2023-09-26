CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    tomato_number INTEGER DEFAULT 0
);

CREATE TABLE TimerLogs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    memo TEXT
);

CREATE TABLE Items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    scale FLOAT,
    position FLOAT[]
);


CREATE TABLE UserItems (
    user_item_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    item_id INTEGER REFERENCES Items(item_id),
    quantity INTEGER DEFAULT 0
);
