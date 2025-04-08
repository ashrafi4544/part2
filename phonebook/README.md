# Exercise 2.6-2.17: Phonebook App

In this exercise, you build a Phonebook App where users can manage a list of contacts. The app allows users to add new contacts, update existing ones, and delete contacts. It also includes a filtering feature to search through contacts and displays notifications for successful operations or errors.

## Key Features:
- Add, update, and delete contacts.
- Filter contacts by name.
- Display notifications for successful or failed operations.
- Interact with a backend server using Axios (e.g., via a JSON Server).

## Technologies Used:
- React (for the user interface)
- Axios (for HTTP requests)
- A backend API for storing and managing contacts (using a JSON Server)

## Setup Instructions

### 1. Start the Backend Server
Make sure you have the **JSON Server** installed globally or as a project dependency.  
Run the following command in your project directory to start the JSON Server on port 3001 using the `db.json` file as your data source:
```bash
npx json-server --port 3001 db.json


2. Start the Frontend
In a separate terminal window, run the following command to start the development server for your React app:

npm run dev
