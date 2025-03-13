# ShopSync

**ShopSync** is a cutting-edge **inventory management** and **sales tracking** solution tailored for small to medium-sized businesses. Developed using React, Node.js, Express, and MongoDB, it empowers retailers and entrepreneurs to efficiently manage products, monitor sales, and generate insightful reports.

## Features
- Secure user authentication with email verification
- Comprehensive inventory management with barcode generation and printing
- Real-time sales tracking with low stock alerts
- Detailed business reporting for actionable insights
- Responsive design optimized for both desktop and mobile devices

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Barcode Generation**: bwip-js

## Installation

### Prerequisites
- Node.js (v18.x or later)
- MongoDB
- npm or yarn
- Git

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/Somshubhro07/ShopSync.git
   cd shop-sync
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the `server` directory:
   ```text
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/shopsync
   JWT_SECRET=your_jwt_secret_key
   SENDGRID_API_KEY=your_sendgrid_api_key
   EMAIL_FROM=your_email@example.com
   ```

5. **Run the Application**
   Start the server:
   ```bash
   cd server
   node app.js
   ```

   Start the client (in a new terminal):
   ```bash
   cd client
   npm start
   ```

   Visit [http://localhost:3000](http://localhost:3000).

## Usage
- **Login/Signup**: Access via `/`
- **Dashboard**: View sales at `/dashboard`
- **Inventory**: Manage products at `/inventory` (update/delete) or add at `/add-product`
- **Sell**: Process sales at `/sell`
- **Reporting**: Analyze data at `/reporting`

## API Endpoints

### Auth:
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - User profile (protected)

### Products:
- `POST /api/products` - Add product
- `GET /api/products` - List products
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales:
- `GET /api/sales/dashboard` - Dashboard data

## Contributing
We welcome contributions from the community!

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact
Author: [Somshubro Guha]  
Email: guha.somshubhro07@gmail.com  
GitHub: [Somshubro Guha's GitHub Profile](https://github.com/Somshubhro07)

## Keywords
Inventory management, sales tracking, small business, medium business, React, Node.js, Express, MongoDB, JWT, barcode generation, business insights, responsive design