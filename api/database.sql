-- RFI Generator Database Schema
-- Run this SQL file on your MySQL database to create the required tables

CREATE DATABASE IF NOT EXISTS rfi_generator;
USE rfi_generator;

-- Main RFI table
CREATE TABLE IF NOT EXISTS rfis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inspection_no INT NOT NULL UNIQUE,
    ref_drawing VARCHAR(255) DEFAULT '',
    work_site VARCHAR(255) DEFAULT '',
    location VARCHAR(255) DEFAULT '',
    inspection_date DATE NULL,
    inspection_time VARCHAR(10) DEFAULT '',
    weather_condition VARCHAR(255) DEFAULT '',
    
    -- Arrange Inspection items (up to 5)
    inspection_item_1 VARCHAR(500) DEFAULT '',
    inspection_item_2 VARCHAR(500) DEFAULT '',
    inspection_item_3 VARCHAR(500) DEFAULT '',
    inspection_item_4 VARCHAR(500) DEFAULT '',
    inspection_item_5 VARCHAR(500) DEFAULT '',
    
    -- Pre-Inspection checked by Contractor
    pre_inspection_name VARCHAR(255) DEFAULT '',
    pre_inspection_designation VARCHAR(255) DEFAULT '',
    pre_inspection_date DATE NULL,
    
    -- Received by Client
    received_by_name VARCHAR(255) DEFAULT '',
    received_by_designation VARCHAR(255) DEFAULT '',
    received_by_date DATE NULL,
    
    -- Comments (URBANCO USE ONLY)
    comments TEXT DEFAULT '',
    relevant_subclause TEXT DEFAULT '',
    
    -- Client Representative
    client_rep_name VARCHAR(255) DEFAULT '',
    client_rep_designation VARCHAR(255) DEFAULT '',
    client_rep_date DATE NULL,
    
    -- Contractor Representative (Page 1)
    contractor_rep_name VARCHAR(255) DEFAULT '',
    contractor_rep_designation VARCHAR(255) DEFAULT '',
    contractor_rep_date DATE NULL,
    
    -- Page 2 - Comments on completed works
    completed_works_comments TEXT DEFAULT '',
    
    -- Page 2 - Contractor Representative
    page2_contractor_name VARCHAR(255) DEFAULT '',
    page2_contractor_designation VARCHAR(255) DEFAULT '',
    
    -- Page 2 - Client Representative
    page2_client_name VARCHAR(255) DEFAULT '',
    page2_client_designation VARCHAR(255) DEFAULT '',
    
    status ENUM('draft', 'submitted', 'completed') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Checklist items for Page 2
CREATE TABLE IF NOT EXISTS rfi_checklist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rfi_id INT NOT NULL,
    item_order INT NOT NULL,
    description TEXT NOT NULL,
    result ENUM('pass', 'fail', 'na', '') DEFAULT '',
    item_comments TEXT DEFAULT '',
    FOREIGN KEY (rfi_id) REFERENCES rfis(id) ON DELETE CASCADE
);

-- Set starting inspection number to 1937
ALTER TABLE rfis AUTO_INCREMENT = 1;

-- Insert a counter tracker
CREATE TABLE IF NOT EXISTS rfi_counter (
    id INT PRIMARY KEY DEFAULT 1,
    next_inspection_no INT NOT NULL DEFAULT 1937
);

INSERT INTO rfi_counter (id, next_inspection_no) VALUES (1, 1937)
ON DUPLICATE KEY UPDATE next_inspection_no = next_inspection_no;

-- Default checklist items for cladding inspection
CREATE TABLE IF NOT EXISTS default_checklist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_order INT NOT NULL,
    description TEXT NOT NULL
);

INSERT INTO default_checklist_items (item_order, description) VALUES
(1, 'Cladding panels installed as per approved shop drawings and specifications'),
(2, 'Cladding type, color, pattern, and material match approved samples'),
(3, 'Panels are level, plumb, and evenly spaced'),
(4, 'Joints are uniform, consistent, and properly aligned'),
(5, 'All protective films removed from panels & Panels cleaned and free from dust, adhesive marks, and scratches'),
(6, 'Edge finishes and corner details are neat and professionally executed'),
(7, 'Cladding is securely fixed to the frame & All fasteners (screws, rivets, anchors) are of correct type and properly installed'),
(8, 'Joints and gaps sealed using approved sealant materials & No visible gaps that can cause water ingress'),
(9, 'All edge trims, corner profiles, and expansion joints properly installed'),
(10, 'Sealant application is clean and continuous');
