// cart.js

const CART_STORAGE_KEY = 'audiophileCart';

/**
 * Retrieves the current cart from localStorage.
 * @returns {Array} An array of cart items, or an empty array if no cart exists.
 */
function getCart() {
    const cartString = localStorage.getItem(CART_STORAGE_KEY);
    return cartString ? JSON.parse(cartString) : [];
}

/**
 * Saves the cart array to localStorage.
 * @param {Array} cart - The cart array to save.
 */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartDisplay(); // Call a function to update UI after saving
}

/**
 * Adds a product to the cart or updates its quantity if it already exists.
 * @param {Object} productToAdd - The product object to add.
 * Expected properties: id, name, price, image.
 * @param {number} quantity - The quantity to add.
 */
function addToCart(productToAdd, quantity = 1) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === productToAdd.id);

    if (existingItemIndex > -1) {
        // Item already in cart, update quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // New item, add to cart
        cart.push({
            id: productToAdd.id,
            name: productToAdd.name,
            price: productToAdd.price,
            image: productToAdd.image, // Ensure you have a small image for the cart
            quantity: quantity
        });
    }
    saveCart(cart);
    showCartModal(); // Optional: show a mini-cart modal
}

/**
 * Updates the quantity of a specific item in the cart.
 * @param {string} productId - The ID of the product to update.
 * @param {number} newQuantity - The new quantity for the product.
 */
function updateCartItemQuantity(productId, newQuantity) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = newQuantity;
        }
    }
    saveCart(cart);
}

/**
 * Removes a specific item from the cart.
 * @param {string} productId - The ID of the product to remove.
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

/**
 * Clears the entire cart.
 */
function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartDisplay(); // Update UI
    hideCartModal(); // If applicable
}

// --- UI Update Functions (Examples - you'll adapt these to your specific HTML) ---

/**
 * Updates the cart icon count in the header.
 */
function updateCartDisplay() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartIconCountElement = document.querySelector('.cart-icon .count') || document.querySelector('.cart-icon span'); // Adjust selector as needed

    if (cartIconCountElement) {
        cartIconCountElement.textContent = totalItems;
        if (totalItems > 0) {
            cartIconCountElement.style.display = 'inline-flex'; // Show if items exist
        } else {
            cartIconCountElement.style.display = 'none'; // Hide if no items
        }
    }
}

/**
 * Shows a mini-cart modal (placeholder function).
 */
function showCartModal() {
    // Implement logic to show your mini-cart/sidebar
    console.log("Mini cart modal would show here!");
    // Example: document.getElementById('mini-cart-modal').classList.add('active');
}

/**
 * Hides a mini-cart modal (placeholder function).
 */
function hideCartModal() {
    // Implement logic to hide your mini-cart/sidebar
    console.log("Mini cart modal would hide here!");
    // Example: document.getElementById('mini-cart-modal').classList.remove('active');
}

// Initialize cart display when the script loads
document.addEventListener('DOMContentLoaded', updateCartDisplay);