// cart.js


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
 * @param {Object} product - The product object to add.
 * Expected properties: id, name, price, image.
 * @param {number} quantity - The quantity to add.
 */
function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        // Item already in cart, update quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // New item, add to cart
        cart.push({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image // Use mobile image for cart thumbnail
        });
    }
    saveCart(cart);
    alert(`${quantity}x ${product.name} added to cart`)
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
}

// Initialize cart display when the script loads
document.addEventListener('DOMContentLoaded', updateCartDisplay);

// Add these functions to your existing cart.js file

/**
 * Renders the cart items and totals on the cart page.
 * This function should be called when the cart page loads and after any cart modification.
 */
function renderCartPage() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-modal-items') || document.getElementById('cart-page-items');
    const cartSummaryTotal = document.getElementById('cart-summary-total');
    const cartSummaryShipping = document.getElementById('cart-summary-shipping');
    const cartSummaryVAT = document.getElementById('cart-summary-vat');
    const cartSummaryGrandTotal = document.getElementById('cart-summary-grand-total');
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const checkoutButton = document.getElementById('cart-checkout-button');
    const removeAllButton = document.getElementById('cart-remove-all'); // For the "Remove All" button

    if (!cartItemsContainer) {
        console.warn("Cart rendering elements not found on this page.");
        return; // Exit if elements aren't present (e.g., on product page)
    }

    cartItemsContainer.innerHTML = ''; // Clear existing items

    let subtotal = 0;
    const shippingCost = 50; // Example fixed shipping cost
    const vatRate = 0.20; // 20% VAT (adjust as needed)

    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
        if (checkoutButton) checkoutButton.disabled = true; // Disable checkout if cart is empty
        if (removeAllButton) removeAllButton.style.display = 'none'; // Hide remove all
        // Hide total breakdown elements
        if (cartSummaryTotal) cartSummaryTotal.closest('.total-row').style.display = 'none';
        if (cartSummaryShipping) cartSummaryShipping.closest('.total-row').style.display = 'none';
        if (cartSummaryVAT) cartSummaryVAT.closest('.total-row').style.display = 'none';
        if (cartSummaryGrandTotal) cartSummaryGrandTotal.closest('.total-row').style.display = 'none';
        document.querySelector('.cart-summary').style.display = 'none'; // Hide the entire summary section if empty
    } else {
        cartEmptyMessage.style.display = 'none';
        if (checkoutButton) checkoutButton.disabled = false;
        if (removeAllButton) removeAllButton.style.display = 'inline-block'; // Show remove all
        // Show total breakdown elements
        if (cartSummaryTotal) cartSummaryTotal.closest('.total-row').style.display = 'flex';
        if (cartSummaryShipping) cartSummaryShipping.closest('.total-row').style.display = 'flex';
        if (cartSummaryVAT) cartSummaryVAT.closest('.total-row').style.display = 'flex';
        if (cartSummaryGrandTotal) cartSummaryGrandTotal.closest('.total-row').style.display = 'flex';
        document.querySelector('.cart-summary').style.display = 'block'; // Show the entire summary section

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item'); // Use 'cart-item' for individual items
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$ ${item.price.toLocaleString()}</span>
                </div>
                <div class="cart-item-quantity-control">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);

            subtotal += item.price * item.quantity;
        });

        const vatAmount = subtotal * vatRate;
        const grandTotal = subtotal + shippingCost + vatAmount;

        if (cartSummaryTotal) cartSummaryTotal.textContent = `$ ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        if (cartSummaryShipping) cartSummaryShipping.textContent = `$ ${shippingCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        if (cartSummaryVAT) cartSummaryVAT.textContent = `$ ${vatAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        if (cartSummaryGrandTotal) cartSummaryGrandTotal.textContent = `$ ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

        cartItemsContainer.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.id, 10);
                const currentItem = cart.find(item => item.id === productId);
                if (!currentItem) return; // Should not happen

                let newQuantity = currentItem.quantity;
                if (event.target.classList.contains('increase-btn')) {
                    newQuantity++;
                } else if (event.target.classList.contains('decrease-btn')) {
                    newQuantity--;
                }

                updateCartItemQuantity(productId, newQuantity); // This calls saveCart and updateCartDisplay
                renderCartPage(); // Re-render the cart page to reflect changes
            });
        });

        if (removeAllButton) {
            removeAllButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to remove all items from your cart?')) {
                    clearCart();
                    renderCartPage(); // Re-render after clearing
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', updateCartDisplay); // Keeps cart icon updated on all pages