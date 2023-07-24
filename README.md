# Miami-Kev-Store
# Miami Kev Merch

## Description
Miami Kev Merch, a social media and e-commerce platform, is a website for social media creators to manage their merchandise, update their fans, and enhance their social media presence. This MVP showcases the Admin Experience.

## Deployed Live Link
[Deployed Application](https://miamikevmerch.onrender.com/)

## Technologies/Frameworks Used
### Frontend
- React
- CSS

### Backend
- Flask
- AWS (for images)

## Core Features of MVP
- New account creation, login, logout
- Product Management
- Order Management
- Creator Blog/Community

## Future Implementation Goals
- Promo Code Management
- Comprehensive Dashboard
- Customer Management
- Product Variants
- Real-time Notifications

## Screenshots
(Replace this placeholder with your images)

## Contact Information
[LinkedIn Profile](https://www.linkedin.com/in/scarlettrobe/)

## API Endpoints

| Routes  | HTTP Methods | Description |
|---|---|---|
| `/auth`  | GET, POST | Authenticate a user, Log a user in |
| `/auth/logout`  | GET | Logs a user out |
| `/auth/signup`  | POST | Creates a new user and logs them in |
| `/auth/unauthorized`  | GET | Returns unauthorized JSON when flask-login authentication fails |
| `/blog`  | GET, POST | Fetch all blog posts, create a new blog post |
| `/blog/<int:id>`  | GET, PUT, PATCH, DELETE | Fetch, update or delete a blog post by id |
| `/orders`  | GET, POST | Fetch all orders, create a new order |
| `/orders/<int:id>`  | GET, PUT, DELETE | Fetch, update or delete an order by id |
| `/orders/<int:id>/status`  | PUT | Update order status |
| `/orders/<int:orderId>/products`  | DELETE | Delete order items associated with the order |
| `/orders/<int:orderId>/products/<int:productId>`  | POST, DELETE | Add or remove a product from an order |
| `/products`  | GET, POST | Fetch all products, create a new product |
| `/products/<int:id>`  | GET, PUT, DELETE | Fetch, update or delete a product by id |
| `/users`  | GET | Fetch all users |
| `/users/<int:id>`  | GET | Fetch a user by id |

