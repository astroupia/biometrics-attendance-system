# Attendance Tracking System

## Overview

The Attendance Tracking System is a web application designed to manage and track attendance using facial recognition. It combines a Flask backend for handling the facial recognition processes and a Node.js backend for managing user interactions and data.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Folder Structure](#folder-structure)
4. [Running the Application](#running-the-application)
5. [Deployment](#deployment)
6. [Environment Variables](#environment-variables)
7. [Usage](#usage)
8. [Contributing](#contributing)
9. [License](#license)

## Prerequisites

- Python 3.9 or later
- Node.js 14.x or later
- MongoDB
- Vercel CLI (for deployment)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/attendance-tracking-system.git
   cd attendance-tracking-system
   ```

2. Install Python dependencies:

   ```sh
   pip install -r requirements.txt
   ```

3. Install Node.js dependencies:
   ```sh
   npm install
   ```

## Folder Structure

├── app.py # Flask application entry point
├── main.py # Main script for facial recognition
├── config # Configuration files for Flask
├── models # MongoDB models for user and attendance data
├── routes # Express routes
│ ├── index.js
│ ├── user.js
│ └── classroom.js
├── templates # HTML templates for Flask
│ └── main.html
├── public # Public assets
│ ├── css
│ └── js
├── views # Handlebars views for Express
│ ├── layout.hbs
│ └── ...
├── vercel.json # Vercel configuration
├── Dockerfile # Docker configuration
├── package.json # Node.js dependencies and scripts
└── requirements.txt # Python dependencies

## Running the Application

1. Start the Flask server:

   ```sh
   python app.py
   ```

2. Start the Node.js server:
   ```sh
   npm start
   ```

## Deployment

### Vercel

1. Install the Vercel CLI:

   ```sh
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```sh
   vercel
   ```

### Docker

1. Build the Docker image:

   ```sh
   docker build -t attendance-tracking-system .
   ```

2. Run the Docker container:
   ```sh
   docker run -p 3000:3000 -p 5000:5000 attendance-tracking-system
   ```

## Environment Variables

Set the following environment variables in your `.env` file or Vercel dashboard:

- `PYTHONUNBUFFERED=1`
- `MONGO_URI=mongodb://localhost:27017/attendance_portal`

## Usage

1. Access the Node.js frontend at `http://localhost:3000`.
2. The Flask backend for facial recognition runs at `http://localhost:5000`.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
