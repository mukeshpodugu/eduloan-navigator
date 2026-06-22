-- Database Schema for EduLoan Navigator
CREATE DATABASE IF NOT EXISTS eduloan_navigator;
USE eduloan_navigator;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Loans Table
CREATE TABLE IF NOT EXISTS loans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    principal DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    tenure_months INT NOT NULL,
    moratorium_months INT NOT NULL DEFAULT 0,
    moratorium_interest_type VARCHAR(30) NOT NULL DEFAULT 'COMPOUND', -- SIMPLE, COMPOUND, DEFERRED
    monthly_emi DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Prepayments Table
CREATE TABLE IF NOT EXISTS prepayments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_id BIGINT NOT NULL,
    prepayment_amount DECIMAL(15, 2) NOT NULL,
    prepayment_month INT NOT NULL, -- The month index (e.g. month 12) the payment is made
    type VARCHAR(20) NOT NULL DEFAULT 'ONE_TIME', -- ONE_TIME, RECURRING
    CONSTRAINT fk_prepayment_loan FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Contact Queries Table
CREATE TABLE IF NOT EXISTS contact_queries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, RESOLVED
    reply_message TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. System Configurations Table
CREATE TABLE IF NOT EXISTS system_configs (
    config_key VARCHAR(50) PRIMARY KEY,
    config_value VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default configs and mock admin account
INSERT INTO system_configs (config_key, config_value, description) VALUES
('base_lending_rate', '8.75', 'RBI Repo-linked base education loan lending rate (%)'),
('max_loan_limit', '15000000', 'Maximum education loan amount allowed on simulator (INR)'),
('min_interest_rate', '6.50', 'Minimum benchmark interest rate allowed (%)')
ON DUPLICATE KEY UPDATE config_value=VALUES(config_value);

-- Note: The admin user will be seeded via backend database initialization logic if missing.
