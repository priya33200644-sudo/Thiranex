CREATE DATABASE IF NOT EXISTS personal_portfolio
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE personal_portfolio;

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    technologies VARCHAR(255) NOT NULL,
    project_link VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects (title, description, technologies, project_link)
SELECT 'Project Vault',
       'A secure platform for organizing projects and ideas in one place.',
       'Java, JavaScript, MySQL', NULL
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Project Vault');

INSERT INTO projects (title, description, technologies, project_link)
SELECT 'ExamNavigator',
       'A competitive exam learning platform for study materials and exam preparation.',
       'HTML, CSS, JavaScript, Java, MySQL', NULL
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'ExamNavigator');

INSERT INTO projects (title, description, technologies, project_link)
SELECT 'AI-Generated Localized Educational Content Creator',
       'Adapts educational content to regional languages and familiar local examples.',
       'HTML, CSS, JavaScript, AI', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM projects
    WHERE title = 'AI-Generated Localized Educational Content Creator'
);
