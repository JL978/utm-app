-- psql -U postgres

CREATE DATABASE utm_app;

-- \c utm_app

CREATE TABLE users(
    store_id VARCHAR(100) PRIMARY KEY,
    plan VARCHAR(50),
    trial BOOLEAN
);

CREATE TABLE links(
    link_id VARCHAR(16) PRIMARY KEY,
    store_id VARCHAR(100),
    resource_type VARCHAR(50),
    resource_link VARCHAR(255),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    discount_code VARCHAR(50)
);