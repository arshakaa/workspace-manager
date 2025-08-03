-- Workspace Manager Database Schema
-- Run this file to create the database and tables manually

-- Create database
CREATE DATABASE IF NOT EXISTS workspace_manager;
USE workspace_manager;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_workspaces_userid ON workspaces(userId);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces(slug);

-- Insert sample data (optional)
-- INSERT INTO users (fullName, email, password) VALUES 
-- ('John Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8e'),
-- ('Jane Smith', 'jane@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8e');

-- INSERT INTO workspaces (userId, name, slug) VALUES 
-- (1, 'My First Workspace', 'my-first-workspace'),
-- (1, 'Project Alpha', 'project-alpha'),
-- (2, 'Design Studio', 'design-studio'); 