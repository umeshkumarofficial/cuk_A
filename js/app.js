
// ==========================================
// BookHub - Main JavaScript
// ==========================================


// ==========================================
// 1. Category Icons
// ==========================================

const CATEGORY_ICONS = {
    "Fiction": "📖",
    "Technology": "💻",
    "Science": "🔬",
    "Self Help": "🌱",
    "Finance": "💰",
    "Biography": "👤"
};


// ==========================================
// 2. Utility Functions
// ==========================================

// Format price in Indian Rupees
const money = value =>
    `₹${Number(value).toLocaleString("en-IN")}`;

// Get cart data from localStorage
const getCart = () =>
    JSON.parse(localStorage.getItem("bookhub_cart") || "[]");

// Save cart data to localStorage
const saveCart = cart => {
    localStorage.setItem("bookhub_cart", JSON.stringify(cart));
    updateCartCount();
};


// ==========================================
// 3. Cart Count and Notifications
// ==========================================

// Update cart item count
function updateCartCount() {
    const count = getCart().reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    document.querySelectorAll("[data-cart-count]").forEach(el => {
        el.textContent = count;
    });
}

// Display toast notification
function toast(message) {
    const el = document.getElementById("toast");

    if (!el) return;

    el.textContent = message;
    el.classList.add("show");

    setTimeout(() => el.classList.remove("show"), 2200);
}


// ==========================================
// 4. Book and Category Cards
// ==========================================

// Add book to cart
function addToCart(id) {
    const cart = getCart();
    const item = cart.find(entry => entry.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            id,
            quantity: 1
        });
    }

    saveCart(cart);
    toast("Book added to your cart!");
}

// Generate book card
function bookCard(book) {
    return `
        <article class="book-card">

            <img
                class="book-cover"
                src="${book.cover}"
                alt="Cover of ${book.title}"
            >

            <h3>${book.title}</h3>

            <p class="book-author">
                by ${book.author}
            </p>

            <div class="book-meta">
                <span class="price">${money(book.price)}</span>
                <span class="rating">★ ${book.rating}</span>
            </div>

            <button
                class="btn"
                type="button"
                onclick="addToCart('${book.id}')"
            >
                Add to cart
            </button>

        </article>
    `;
}

// Generate category card
function categoryCard(category) {
    const count = BOOKS.filter(
        book => book.category === category
    ).length;

    return `
        <a
            class="category-card"
            href="books.html?category=${encodeURIComponent(category)}"
        >

            <div class="category-icon">
                ${CATEGORY_ICONS[category] || "📚"}
            </div>

            <strong>${category}</strong>

            <small>${count} books</small>

        </a>
    `;
}


// ==========================================
// 5. Home Page Rendering
// ==========================================

function renderHome() {

    // Render categories
    const categories = [
        ...new Set(BOOKS.map(book => book.category))
    ];

    const cat = document.getElementById("homeCategories");

    if (cat) {
        cat.innerHTML = categories.map(categoryCard).join("");
    }

    // Render featured books
    const featured = document.getElementById("featuredBooks");

    if (featured) {
        featured.innerHTML = BOOKS
            .slice(0, 8)
            .map(bookCard)
            .join("");
    }
}


// ==========================================
// 6. Categories Page Rendering
// ==========================================

function renderCategories() {
    const el = document.getElementById("allCategories");

    if (el) {
        el.innerHTML = [
            ...new Set(BOOKS.map(book => book.category))
        ]
            .map(categoryCard)
            .join("");
    }
}


// ==========================================
// 7. Books Page Rendering
// ==========================================

function renderBooks() {
    const grid = document.getElementById("allBooks");

    if (!grid) return;

    const search = document.getElementById("bookSearch");
    const filter = document.getElementById("categoryFilter");
    const sort = document.getElementById("sortBooks");

    const categories = [
        ...new Set(BOOKS.map(book => book.category))
    ];

    // Populate category dropdown
    filter.innerHTML =
        '<option value="all">All categories</option>' +
        categories
            .map(c => `<option value="${c}">${c}</option>`)
            .join("");

    // Read category from URL
    const requested = new URLSearchParams(location.search)
        .get("category");

    if (requested && categories.includes(requested)) {
        filter.value = requested;
    }

    // Update book list
    function update() {
        let list = BOOKS.filter(book =>
            (
                filter.value === "all" ||
                book.category === filter.value
            ) &&
            (
                `${book.title} ${book.author}`
                    .toLowerCase()
                    .includes(search.value.toLowerCase())
            )
        );

        // Sorting options
        if (sort.value === "price-low") {
            list.sort((a, b) => a.price - b.price);
        }

        if (sort.value === "price-high") {
            list.sort((a, b) => b.price - a.price);
        }

        if (sort.value === "title") {
            list.sort((a, b) =>
                a.title.localeCompare(b.title)
            );
        }

        // Display books
        grid.innerHTML = list.length
            ? list.map(bookCard).join("")
            : `
                <div
                    class="empty-state"
                    style="grid-column: 1 / -1"
                >
                    No books found. Try another search.
                </div>
            `;

        // Display result count
        document.getElementById("bookResultCount").textContent =
            `Showing ${list.length} of ${BOOKS.length} books`;
    }

    // Search, filter and sorting events
    [search, filter, sort].forEach(el => {
        el.addEventListener("input", update);
    });

    update();
}


// ==========================================
// 8. Shopping Cart Functions
// ==========================================

// Change book quantity
function changeQuantity(id, change) {
    let cart = getCart();

    const item = cart.find(entry => entry.id === id);

    if (item) {
        item.quantity += change;
    }

    cart = cart.filter(item => item.quantity > 0);

    saveCart(cart);
    renderCart();
}

// Remove book from cart
function removeFromCart(id) {
    saveCart(
        getCart().filter(item => item.id !== id)
    );

    renderCart();
    toast("Book removed from cart.");
}

// Render shopping cart
function renderCart() {
    const host = document.getElementById("cartItems");

    if (!host) return;

    const cart = getCart();

    let total = 0;
    let count = 0;

    // Empty cart message
    if (!cart.length) {

        host.innerHTML = `
            <div class="empty-state">

                <h3>Your cart is empty</h3>

                <p>Find a book that catches your eye.</p>

                <a class="btn" href="books.html">
                    Browse books
                </a>

            </div>
        `;

    } else {

        // Display cart items
        host.innerHTML = cart.map(item => {

            const book = BOOKS.find(
                entry => entry.id === item.id
            );

            if (!book) return "";

            total += book.price * item.quantity;
            count += item.quantity;

            return `
                <div class="cart-row">

                    <img
                        src="${book.cover}"
                        alt="${book.title}"
                    >

                    <div>
                        <h3>${book.title}</h3>

                        <p>${book.author}</p>

                        <strong class="price">
                            ${money(book.price)}
                        </strong>
                    </div>

                    <div class="quantity">

                        <button
                            aria-label="Decrease quantity"
                            onclick="changeQuantity('${book.id}', -1)"
                        >
                            −
                        </button>

                        <strong>${item.quantity}</strong>

                        <button
                            aria-label="Increase quantity"
                            onclick="changeQuantity('${book.id}', 1)"
                        >
                            +
                        </button>

                    </div>

                    <button
                        class="remove-btn"
                        onclick="removeFromCart('${book.id}')"
                    >
                        Remove
                    </button>

                </div>
            `;

        }).join("");
    }

    // Update order summary
    document.getElementById("summaryItems").textContent = count;

    document.getElementById("summarySubtotal").textContent =
        money(total);

    document.getElementById("summaryTotal").textContent =
        money(total);
}


// ==========================================
// 9. Form Notification
// ==========================================

function showNotice(id, message) {
    const el = document.getElementById(id);

    if (el) {
        el.textContent = message;
        el.style.display = "block";
    }
}


// ==========================================
// 10. Login, Registration and Contact Forms
// ==========================================

function setupForms() {

    // Registration Form
    const register = document.getElementById("registerForm");

    if (register) {
        register.addEventListener("submit", event => {
            event.preventDefault();

            const name = document
                .getElementById("registerName")
                .value.trim();

            const email = document
                .getElementById("registerEmail")
                .value.trim()
                .toLowerCase();

            const password =
                document.getElementById("registerPassword").value;

            const confirm =
                document.getElementById("confirmPassword").value;

            if (password !== confirm) {
                showNotice(
                    "registerNotice",
                    "Passwords do not match."
                );
                return;
            }

            const users = JSON.parse(
                localStorage.getItem("bookhub_users") || "[]"
            );

            if (users.some(user => user.email === email)) {
                showNotice(
                    "registerNotice",
                    "An account with this email already exists."
                );
                return;
            }

            users.push({
                name,
                email,
                password
            });

            localStorage.setItem(
                "bookhub_users",
                JSON.stringify(users)
            );

            showNotice(
                "registerNotice",
                "Account created successfully. You can now login."
            );

            register.reset();
        });
    }


    // Login Form
    const login = document.getElementById("loginForm");

    if (login) {
        login.addEventListener("submit", event => {
            event.preventDefault();

            const email = document
                .getElementById("loginEmail")
                .value.trim()
                .toLowerCase();

            const password =
                document.getElementById("loginPassword").value;

            const users = JSON.parse(
                localStorage.getItem("bookhub_users") || "[]"
            );

            const user = users.find(entry =>
                entry.email === email &&
                entry.password === password
            );

            if (!user) {
                showNotice(
                    "loginNotice",
                    "Email or password is incorrect. Please register first."
                );
                return;
            }

            localStorage.setItem(
                "bookhub_user",
                JSON.stringify({
                    name: user.name,
                    email: user.email
                })
            );

            showNotice(
                "loginNotice",
                `Welcome back, ${user.name}!`
            );
        });
    }


    // Contact Form
    const contact = document.getElementById("contactForm");

    if (contact) {
        contact.addEventListener("submit", event => {
            event.preventDefault();

            showNotice(
                "contactNotice",
                "Thanks! Your demo message has been recorded on this page."
            );

            contact.reset();
        });
    }


    // Checkout Button
    const checkout = document.getElementById("checkoutButton");

    if (checkout) {
        checkout.addEventListener("click", () => {
            toast(
                getCart().length
                    ? "Demo checkout: payment is not connected."
                    : "Your cart is empty."
            );
        });
    }
}


// ==========================================
// 11. Mobile Navigation
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();

    renderHome();
    renderCategories();
    renderBooks();
    renderCart();

    setupForms();

    // Mobile menu toggle
    const toggle = document.getElementById("menuToggle");

    if (toggle) {
        toggle.addEventListener("click", () => {
            document
                .getElementById("navLinks")
                .classList.toggle("open");
        });
    }

});
