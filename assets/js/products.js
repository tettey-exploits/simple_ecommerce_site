// products.js

document.addEventListener('DOMContentLoaded', () => {

    const correctAssetPath = (path) => {
        return  path.replace('/assets/', '/assets/images/'); 
    };

    const categoryTitleElement = document.getElementById('category-page-title');
    const productListContainer = document.getElementById('product-list-container');
    const noProductsMessage = document.getElementById('no-products-message');
    const goBackLink = document.querySelector('.go-back-link');

    // Go Back link functionality
    if (goBackLink) {
        goBackLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.history.back();
        });
    }

    // Function to get query parameter from URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Function to render products
    async function loadProducts() {
        const categorySlug = getQueryParam('category'); // e.g., 'headphones', 'speakers'
        let categoryDisplayName = 'Products'; // Default title

        if (categorySlug) {
            categoryDisplayName = capitalizeFirstLetter(categorySlug);
        } else {
            // If no category specified, show all or redirect, or default to a category
            // For now, we'll just set a generic title and handle no products found.
            console.warn("No category specified in URL. Displaying all products or a default message.");
            // Or you could redirect: window.location.href = 'products.html?category=headphones';
        }

        categoryTitleElement.textContent = categoryDisplayName;

        try {
            const response = await fetch('./data.json'); // Fetch your product data
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const productsData = await response.json();

            // Filter products by category
            const filteredProducts = categorySlug
                ? productsData.filter(product => product.category === categorySlug)
                : productsData; // If no category, show all products (optional)

            productListContainer.innerHTML = ''; // Clear previous content

            if (filteredProducts.length === 0) {
                noProductsMessage.style.display = 'block'; // Show "No products found" message
            } else {
                noProductsMessage.style.display = 'none'; // Hide message
                // Sort products: New products first, then by ID (or any other logic)
                filteredProducts.sort((a, b) => {
                    if (a.new && !b.new) return -1;
                    if (!a.new && b.new) return 1;
                    return a.id - b.id; // Fallback sort by ID
                });

                filteredProducts.forEach((product, index) => {
                    const productCard = document.createElement('article');
                    productCard.classList.add('product-card');

                    // Apply reverse order class for even products (0-indexed even: 2nd, 4th, etc.)
                    // This creates the alternating image/text layout
                    if ((index + 1) % 2 === 0) { // Check if it's the 2nd, 4th, 6th product
                        productCard.classList.add('product-card-reversed');
                    }

                    productCard.innerHTML = `
                        <div class="product-image">
                            <picture>
                                <source media="(min-width: 1024px)" srcset="${correctAssetPath(product.image.desktop)}">
                                <source media="(min-width: 768px)" srcset="${correctAssetPath(product.image.tablet)}">
                                <img src="${correctAssetPath(product.image.mobile)}" alt="${product.name}">
                            </picture>
                        </div>
                        <div class="product-content">
                            ${product.new ? '<span class="new-product-tag">New Product</span>' : ''}
                            <h2>${product.name}</h2>
                            <p>${product.description}</p>
                            <a href="product-page.html?slug=${product.slug}" class="btn primary-btn">See Product</a>
                        </div>
                    `;
                    productListContainer.appendChild(productCard);
                });
            }

        } catch (error) {
            console.error("Error loading products:", error);
            productListContainer.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
            noProductsMessage.style.display = 'none'; // Hide if error occurs
        }
    }

    // Load products when the page loads
    loadProducts();
});