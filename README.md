# BookHub - Online Bookstore Demo

A responsive multi-page bookstore project built with **HTML, CSS and vanilla JavaScript**.

## Features
- Home, Books, Categories, About, Contact, Login, Register and Cart pages.
- **120 books** across **6 categories**.
- 120 locally generated SVG book-cover images (works offline).
- Search by book title or author, filter by category and sort by price/title.
- Add books to cart, increase/decrease quantity, remove items and calculate totals.
- Demo registration/login and cart data saved in browser `localStorage`.
- Responsive layout for mobile and desktop.

## Folder structure
```text
BookHub_Project/
├── index.html
├── books.html
├── categories.html
├── about.html
├── contact.html
├── login.html
├── register.html
├── cart.html
├── README.md
├── PROJECT_INFO.txt
├── css/style.css
├── js/app.js
├── js/books.js
└── assets/images/covers/ (120 SVG book covers)
```

## Run it
1. Extract `BookHub_Project.zip`.
2. Open the folder in VS Code.
3. Open `index.html` in your browser, or use the VS Code Live Server extension.
4. Use the navigation menu to explore all pages.

## Important
This is a frontend student demo. Login/register uses browser `localStorage` and is **not secure for real users**. No backend, database, real order processing, email sending or payment gateway is connected. Sample book prices are in INR and can be changed in `js/books.js`.
