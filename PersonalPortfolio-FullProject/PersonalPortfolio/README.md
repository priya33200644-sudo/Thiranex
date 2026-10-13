# Personal Portfolio Website

A full-stack portfolio using HTML, CSS, vanilla JavaScript, Node.js, Express, and MySQL.

## Requirements
- Node.js LTS and npm
- MySQL Server (MySQL Workbench is optional)
- VS Code

## 1. Configure the database
1. Open MySQL Workbench and connect to your local MySQL server.
2. Open `schema.sql`, then execute the whole file (lightning bolt).
3. This creates `personal_portfolio`, `projects`, and `contacts`, and inserts three sample projects.

## 2. Configure environment variables
1. Copy `.env.example` and rename the copy to `.env`.
2. Open `.env` and set `DB_USER` and `DB_PASSWORD` to your actual MySQL credentials.
3. Do not share `.env` or upload it to a public repository.

## 3. Install and run
Open a terminal in the main `PersonalPortfolio` folder:

```bash
npm install
npm start
```

Open `http://localhost:3000` in your browser. Keep the terminal open while using the site.

## 4. Test
- `http://localhost:3000` — portfolio website
- `http://localhost:3000/api/health` — API and database connection check
- `http://localhost:3000/api/projects` — projects from MySQL

Submit the contact form, then run in MySQL Workbench:

```sql
USE personal_portfolio;
SELECT * FROM contacts ORDER BY id DESC;
```

## Folder structure
```text
PersonalPortfolio/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env                 (create from .env.example; never commit it)
├── .env.example
├── .gitignore
├── db.js
├── package.json
├── schema.sql
├── server.js
└── README.md
```

## Common problems
- `node is not recognized`: install Node.js LTS, reopen VS Code, and run `node -v`.
- MySQL access denied: check the username/password in `.env`.
- `ECONNREFUSED`: start the MySQL service.
- Missing module: run `npm install` in the project root.
- Projects not visible: execute `schema.sql` in MySQL Workbench and inspect the terminal for errors.

## Before deployment
Use a managed MySQL database and configure secrets using your hosting provider's environment-variable settings. Do not expose database credentials in frontend files. Deploy the Express backend to a Node.js-compatible host; static hosting alone will not run `server.js`.
