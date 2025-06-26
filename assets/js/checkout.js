// assets/script.js (or assets/checkout.js if you create a new file)

document.addEventListener('DOMContentLoaded', () => {

    let cart = getCart();

    const checkoutForm = document.getElementById('checkout-form');
    const cartItemsSummaryDiv = document.getElementById('cart-items-summary');
    const summaryTotalProductsSpan = document.getElementById('summary-total-products');
    const summaryShippingSpan = document.getElementById('summary-shipping');
    const summaryVatSpan = document.getElementById('summary-vat');
    const summaryGrandTotalSpan = document.getElementById('summary-grand-total');
    const eMoneyDetails = document.getElementById('e-money-details');
    const cashOnDeliveryMessage = document.getElementById('cash-on-delivery-message');
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
    const orderConfirmationModal = document.getElementById('order-confirmation-modal');
    const modalGrandTotalSpan = document.getElementById('modal-grand-total');
    const modalSummaryItemsList = document.querySelector('.order-summary-card .summary-items-list');
    const fixedShippingCost = 50; // As per requirements
    const vatRate = 0.20; // 20% VAT


    // --- Render Cart Items in Summary ---
    const renderCartSummary = () => {
        cartItemsSummaryDiv.innerHTML = ''; // Clear existing items
        if (cart.length === 0) {
            cartItemsSummaryDiv.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        let productSubtotal = 0;

        cart.forEach(item => {
            console.log(item);
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('summary-item');
            itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="summary-item-details">
                        <h4>${item.name}</h4>
                        <span class="iprice">$ ${item.price.toLocaleString()}</span>
                    </div>
                    <span class="item-quantity">x${item.quantity}</span>
                
            `;
            cartItemsSummaryDiv.appendChild(itemDiv);
            productSubtotal += item.price * item.quantity;
        });

        // Attach event listeners for quantity/remove buttons after rendering
        cartItemsSummaryDiv.querySelectorAll('.quantity-minus-summary').forEach(button => {
            button.addEventListener('click', (e) => updateCartQuantity(e.target.dataset.slug, -1));
        });
        cartItemsSummaryDiv.querySelectorAll('.quantity-plus-summary').forEach(button => {
            button.addEventListener('click', (e) => updateCartQuantity(e.target.dataset.slug, 1));
        });
        cartItemsSummaryDiv.querySelectorAll('.remove-item-summary').forEach(button => {
            button.addEventListener('click', (e) => removeItemFromCart(e.target.dataset.slug));
        });

        // Update totals
        const vat = productSubtotal * vatRate;
        const grandTotal = productSubtotal + fixedShippingCost + vat;

        summaryTotalProductsSpan.textContent = `$ ${productSubtotal.toLocaleString()}`;
        summaryShippingSpan.textContent = `$ ${fixedShippingCost.toLocaleString()}`;
        summaryVatSpan.textContent = `$ ${Math.round(vat).toLocaleString()}`; // Round VAT for display
        summaryGrandTotalSpan.textContent = `$ ${grandTotal.toLocaleString()}`;
    };

    // --- Payment Method Toggle ---
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'e-money') {
                eMoneyDetails.style.display = 'grid';
                cashOnDeliveryMessage.style.display = 'none';
                // Make e-money fields required if selected
                eMoneyDetails.querySelectorAll('input').forEach(input => input.setAttribute('required', 'true'));
            } else {
                eMoneyDetails.style.display = 'none';
                cashOnDeliveryMessage.style.display = 'flex';
                // Remove required attribute for e-money fields if not selected
                eMoneyDetails.querySelectorAll('input').forEach(input => input.removeAttribute('required'));
            }
        });
    });
    // Initial state on page load
    if (document.getElementById('cash-on-delivery').checked) {
        eMoneyDetails.style.display = 'none';
        cashOnDeliveryMessage.style.display = 'flex';
        eMoneyDetails.querySelectorAll('input').forEach(input => input.removeAttribute('required'));
    } else {
            eMoneyDetails.querySelectorAll('input').forEach(input => input.setAttribute('required', 'true'));
    }

    // --- Form Validation & Submission ---
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        // Basic Form Validation (can be expanded)
        let isValid = true;
        const formGroups = checkoutForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input');
            const errorMessage = group.querySelector('.error-message');
            if (input && input.hasAttribute('required') && input.value.trim() === '') {
                isValid = false;
                group.classList.add('error');
                if (errorMessage) errorMessage.textContent = 'This field is required';
            } else if (input && input.type === 'email' && !input.value.includes('@')) {
                    isValid = false;
                    group.classList.add('error');
                    if (errorMessage) errorMessage.textContent = 'Invalid email format';
            } else {
                group.classList.remove('error');
                if (errorMessage) errorMessage.textContent = '';
            }
        });

        // Specific validation for e-money fields if selected
        if (document.getElementById('e-money').checked) {
            const eMoneyNumber = document.getElementById('e-money-number');
            const eMoneyPin = document.getElementById('e-money-pin');

            if (!eMoneyNumber.value.match(/^\d{9}$/)) { // Example: 9 digits
                isValid = false;
                eMoneyNumber.closest('.form-group').classList.add('error');
                eMoneyNumber.closest('.form-group').querySelector('.error-message').textContent = 'Invalid e-Money number (e.g., 9 digits)';
            } else {
                    eMoneyNumber.closest('.form-group').classList.remove('error');
                    eMoneyNumber.closest('.form-group').querySelector('.error-message').textContent = '';
            }

            if (!eMoneyPin.value.match(/^\d{4}$/)) { // Example: 4 digits
                isValid = false;
                eMoneyPin.closest('.form-group').classList.add('error');
                eMoneyPin.closest('.form-group').querySelector('.error-message').textContent = 'Invalid PIN (e.g., 4 digits)';
            } else {
                eMoneyPin.closest('.form-group').classList.remove('error');
                eMoneyPin.closest('.form-group').querySelector('.error-message').textContent = '';
            }
        }
        
        // Ensure cart is not empty
        if (cart.length === 0) {
            isValid = false;
            alert('Your cart is empty. Please add items before checking out.');
        }

        if (isValid) {
            // Process order (in a real app, this would send data to a server)
            console.log('Order submitted:', {
                formData: new FormData(checkoutForm),
                cart: cart
            });

            // --- Show Order Confirmation Modal ---
            orderConfirmationModal.style.display = 'flex'; // Show modal
            
            // Populate modal with order summary
            let firstItemHTML = '';
            if (cart.length > 0) {
                const firstItem = cart[0];
                firstItemHTML = `
                    <div class="summary-item modal-first-item">
                        <img src="${correctAssetPath(firstItem.image)}" alt="${firstItem.name}">
                        <div>
                            <span class="item-name">${firstItem.name}</span>
                            <span class="item-price">$ ${firstItem.price.toLocaleString()}</span>
                        </div>
                        <span class="item-quantity">x${firstItem.quantity}</span>
                    </div>
                    ${cart.length > 1 ? '<div class="remaining-items-count">and ' + (cart.length - 1) + ' other item(s)</div>' : ''}
                `;
            }
            modalSummaryItemsList.innerHTML = firstItemHTML;
            
            // Update grand total in modal
            const currentGrandTotal = summaryGrandTotalSpan.textContent;
            modalGrandTotalSpan.textContent = currentGrandTotal;

            // Clear cart after successful order
            cart = [];
            saveCart();
            renderCartSummary(); // Clear cart display on checkout page
        } else {
            console.log('Form validation failed.');
        }
    });

    // --- Initial rendering on page load ---
    renderCartSummary(); // Render cart items and totals when checkout page loads
});
