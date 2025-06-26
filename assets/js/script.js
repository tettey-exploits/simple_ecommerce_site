document.addEventListener('DOMContentLoaded', () => {
    // Helper function to correct asset paths by inserting '/images/'
    // This function should be defined once, accessible to all rendering functions.
    const correctAssetPath = (path) => {
        return  path.replace('/assets/', '/assets/images/'); 
    };

    // Ideal: Get productSlug from URL query parameter (e.g., product.html?slug=yx1-earphones)
    const urlParams = new URLSearchParams(window.location.search);
    const productSlug = urlParams.get('slug');
    var currentProduct;

    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            const product = data.find(p => p.slug === productSlug);
            if (product) {
                currentProduct = product; // Store the current product for later use

                renderProductDetails(product);
                renderProductImages(product.gallery);
                renderYouMayAlsoLike(product.others);
            } else {
                console.error(`Product with slug "${productSlug}" not found.`);
                // Optionally redirect to a 404 page or category page
                // window.location.href = '/category.html';
            }
        })
        .catch(error => console.error('Error fetching product data:', error));

    function renderProductDetails(product) {
        // Product Detail Hero Section
        const productDetailHero = document.querySelector('.product-detail-hero');
        if (productDetailHero) {
            // Product Image
            const productImagePicture = productDetailHero.querySelector('.product-detail-image picture');
            if (productImagePicture) {
                // Applying correctAssetPath here
                productImagePicture.innerHTML = `
                    <source media="(min-width: 1024px)" srcset="${correctAssetPath(product.image.desktop)}">
                    <source media="(min-width: 768px)" srcset="${correctAssetPath(product.image.tablet)}">
                    <img src="${correctAssetPath(product.image.mobile)}" alt="${product.name}">
                `;
            }

            // Product Info
            const productDetailInfo = productDetailHero.querySelector('.product-detail-info');
            if (productDetailInfo) {
                if (product.new) {
                    let newProductTag = productDetailInfo.querySelector('.new-product-tag');
                    if (!newProductTag) {
                        const span = document.createElement('span');
                        span.classList.add('new-product-tag');
                        span.textContent = 'NEW PRODUCT';
                        productDetailInfo.prepend(span);
                    }
                } else {
                    const newProductTag = productDetailInfo.querySelector('.new-product-tag');
                    if (newProductTag) {
                        newProductTag.remove();
                    }
                }

                const productName = productDetailInfo.querySelector('.product-name');
                if (productName) productName.textContent = product.name;

                const productDescription = productDetailInfo.querySelector('.product-description');
                if (productDescription) productDescription.textContent = product.description;

                const productPrice = productDetailInfo.querySelector('.product-price');
                if (productPrice) productPrice.textContent = `$ ${product.price.toLocaleString()}`;
            }
        }

        // Product Features and Includes Section
        const featuresContentElement = document.querySelector('.features-content');
        if (featuresContentElement) {
            // Split the features string by '\n\n' to create paragraphs
            const featureParagraphs = product.features.split('\n\n').map(p => `<p>${p}</p>`).join('');
            // Replace the <p> tag with the new structure including an <h2>
            featuresContentElement.outerHTML = `<div class="features-content"><h2>Features</h2>${featureParagraphs}</div>`;
        }

        const inTheBoxList = document.querySelector('.in-the-box-content ul');
        if (inTheBoxList) {
            inTheBoxList.innerHTML = product.includes.map(item => `
                <li><span class="quantity-item">${item.quantity}x</span> ${item.item}</li>
            `).join('');
        }
    }

    function renderProductImages(gallery) {
        const galleryImageSmall1 = document.querySelector('.gallery-image-small-1 picture');
        if (galleryImageSmall1) {
            galleryImageSmall1.innerHTML = `
                <source media="(min-width: 1024px)" srcset="${correctAssetPath(gallery.first.desktop)}">
                <source media="(min-width: 768px)" srcset="${correctAssetPath(gallery.first.tablet)}">
                <img src="${correctAssetPath(gallery.first.mobile)}" alt="Gallery Image 1">
            `;
        }

        const galleryImageSmall2 = document.querySelector('.gallery-image-small-2 picture');
        if (galleryImageSmall2) {
            galleryImageSmall2.innerHTML = `
                <source media="(min-width: 1024px)" srcset="${correctAssetPath(gallery.second.desktop)}">
                <source media="(min-width: 768px)" srcset="${correctAssetPath(gallery.second.tablet)}">
                <img src="${correctAssetPath(gallery.second.mobile)}" alt="Gallery Image 2">
            `;
        }

        const galleryImageLarge = document.querySelector('.gallery-image-large picture');
        if (galleryImageLarge) {
            // Applying correctAssetPath here (and fixing the typo from gallery.third.third to gallery.third.mobile)
            galleryImageLarge.innerHTML = `
                <source media="(min-width: 1024px)" srcset="${correctAssetPath(gallery.third.desktop)}">
                <source media="(min-width: 768px)" srcset="${correctAssetPath(gallery.third.tablet)}">
                <img src="${correctAssetPath(gallery.third.mobile)}" alt="Gallery Image 3">
            `;
        }
    }

    function renderYouMayAlsoLike(others) {
        const relatedProductsGrid = document.querySelector('.related-products-grid');
        if (relatedProductsGrid) {
            relatedProductsGrid.innerHTML = others.map(item => `
                <div class="related-product-item">
                    <div class="related-product-image">
                        <picture>
                            <source media="(min-width: 1024px)" srcset="${correctAssetPath(item.image.desktop)}">
                            <source media="(min-width: 768px)" srcset="${correctAssetPath(item.image.tablet)}">
                            <img src="${correctAssetPath(item.image.mobile)}" alt="${item.name}">
                        </picture>
                    </div>
                    <h3>${item.name}</h3>
                    <a href="/product-page.html?slug=${item.slug}" class="button button-primary">SEE PRODUCT</a>
                </div>
            `).join('');
        }
    }

    // Quantity Selector functionality
    const quantityMinus = document.querySelector('.quantity-minus');
    const quantityPlus = document.querySelector('.quantity-plus');
    const quantityValue = document.querySelector('.quantity-value');

    if (quantityMinus && quantityPlus && quantityValue) {
        quantityMinus.addEventListener('click', () => {
            let currentValue = parseInt(quantityValue.textContent);
            if (currentValue > 1) {
                quantityValue.textContent = currentValue - 1;
            }
        });

        quantityPlus.addEventListener('click', () => {
            let currentValue = parseInt(quantityValue.textContent);
            quantityValue.textContent = currentValue + 1;
        });
    }

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    addToCartBtn.addEventListener('click', () => {
        // const productName = document.getElementById('product-name').textContent;
        // const productPrice = parseFloat(document.getElementById('product-price').dataset.price);
        // const productImage = '/assets/cart/image-' + `${productId}` ; // Adjust path for cart image
        const quantity = parseInt(document.getElementById('product-quantity').innerText, 10);

        const product = {
            slug: currentProduct.slug,
            name: currentProduct.name,
            price: currentProduct.price,
            image: `/assets/images/cart/image-${currentProduct.slug}.jpg` // Small image for cart
        };
        addToCart(product, quantity);
    });
});