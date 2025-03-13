# ShopSync

Welcome to **ShopSync**, a modern inventory and sales management system designed to streamline your shop operations. Built with React, Node.js, Express, and MongoDB, ShopSync provides an intuitive interface for managing products, tracking sales, and generating reports. This project is designed for small to medium-sized businesses looking to digitize their operations.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- **User Authentication**: Secure login and signup with email verification.
- **Inventory Management**: Add, update, and delete products with barcode generation and printing.
- **Sales Tracking**: Monitor total sales and view recent transactions.
- **Low Stock Alerts**: Get notified about products with low stock levels.
- **Reporting**: Generate sales reports for better business insights.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Customizable Dashboard**: Overview of key metrics with a user-friendly interface.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Barcode Generation**: bwip-js (alternative to canvas for compatibility)
- **Other Tools**: Axios (HTTP requests), bcrypt (password hashing), nodemailer (email verification)

## Installation

### Prerequisites
- Node.js (v18.x or later recommended)
- MongoDB (local or remote instance)
- npm or yarn
- Git

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/Somshubhro07/shop-sync.git
   cd shop-sync