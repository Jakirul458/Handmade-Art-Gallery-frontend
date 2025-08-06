<<<<<<< HEAD
# Handmade-Art-Gallery
=======
# Handmade Art Gallery - E-commerce Website

A professional e-commerce website for a painting artist, built with React and JavaScript. This platform showcases handmade products including bottle paintings, sketches, portraits, and other artwork for home decoration. All prices are displayed in Indian Rupees (₹).

## Features

### 🎨 **Product Showcase**
- Beautiful product gallery with responsive grid layout
- Category filtering (Bottle Painting, Portrait, Canvas Painting, Sketch, Ceramic, Watercolor)
- Product cards with images, descriptions, and pricing
- Sample products included for demonstration

### 🛒 **Shopping Cart**
- Add products to cart functionality
- Cart management with quantity controls
- Real-time cart total calculation
- Persistent cart state using localStorage

### 📋 **Admin Panel**
- Secure admin login (Username: ``, Password: ``)
- Add new products with images, descriptions, and pricing
- Edit existing products
- Delete products with confirmation
- Product management dashboard

### 📱 **Responsive Design**
- Mobile-first responsive design
- Works seamlessly on desktop, tablet, and mobile devices
- Professional and artistic styling
- Modern UI/UX with smooth animations

### 💳 **Checkout Process**
- Complete booking form with customer details
- Order summary display
- Form validation and error handling
- Order confirmation system

## Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Styling**: CSS3 with responsive design
- **Icons**: Lucide React
- **Data Storage**: localStorage (can be extended to backend)

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173` to view the website

## Usage

### For Customers
1. **Browse Products**: Visit the homepage to see all available artwork
2. **Filter by Category**: Use the category buttons to filter products
3. **Add to Cart**: Click "Add to Cart" on any product
4. **View Cart**: Click the cart icon in the header to view your cart
5. **Checkout**: Proceed to checkout and fill in your details
6. **Place Order**: Submit your order to complete the purchase

### For Admin
1. **Login**: Navigate to `/admin` and use the credentials:
   - Username: `admin`
   - Password: `admin123`
2. **Add Products**: Click "Add New Product" and fill in the details
3. **Edit Products**: Click the edit icon on any product card
4. **Delete Products**: Click the delete icon to remove products
5. **Logout**: Use the logout button when finished

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Footer component
│   └── ProductCard.jsx # Product display card
├── pages/              # Main page components
│   ├── HomePage.jsx    # Product showcase
│   ├── Cart.jsx        # Shopping cart
│   ├── Booking.jsx     # Checkout form
│   ├── AdminLogin.jsx  # Admin authentication
│   └── AdminDashboard.jsx # Product management
├── context/            # React Context providers
│   ├── CartContext.jsx # Shopping cart state
│   └── AdminContext.jsx # Admin and product state
├── data/               # Sample data and utilities
│   └── sampleProducts.js # Sample product data
├── styles/             # CSS styling
│   └── App.css         # Main stylesheet
└── App.jsx             # Main application component
```

## Customization

### Adding New Categories
1. Update the `categories` array in `src/data/sampleProducts.js`
2. Add the new category option in the admin dashboard form
3. Update the CSS if needed for styling

### Styling Changes
- Main styles are in `src/styles/App.css`
- Responsive breakpoints are defined for mobile and tablet
- Color scheme can be modified in the CSS variables

### Backend Integration
The current version uses localStorage for data persistence. To integrate with a backend:

1. Replace localStorage calls with API calls
2. Add authentication for admin login
3. Implement image upload functionality
4. Add payment processing integration

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **Firebase**: Use Firebase Hosting
- **Traditional Hosting**: Upload the `dist` folder to your web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a demo version with sample data. For production use, integrate with a proper backend system and implement security measures.
>>>>>>> a151af0 (initial)
