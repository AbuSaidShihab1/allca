# EasyPay

## Prerequisites

Before starting, make sure you have the following installed:

- **Node.js**: [Download Node.js](https://nodejs.org/) (includes NPM).
- **NPM**: Installed with Node.js, required for dependency management.

## Getting Started

Follow these steps to set up and start the project.

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
https://github.com/visiongrp8/Eassypay.git
cd Eassypay
```

### 2. Install Dependancy

This project has dependencies in both the `client` and `server` folders. You’ll need to install them separately:

```
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to the root directory
cd ..
```

### 3. Run the Project with Concurrently

you can use it to start both the client and server at the same time.

Run the following command from the root directory:

```
npm run dev
```

This command will:

* Start the client application on its default port (typically `http://localhost:3000`)
* Start the server application on its specified port (e.g., `http://localhost:6001`)

### Available Scripts

* `npm run client`: Starts the client only.
* `npm run server`: Starts the server only.
* `npm run dev`: Starts both the client and server concurrently.
# allca
