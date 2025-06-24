document.addEventListener('DOMContentLoaded', () => {
    const productSlug = "yx1-earphones"; // This should ideally come from the URL or a global variable
                                         // For this example, we'll hardcode it to YX1 Earphones

    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            const product = data.find(p => p.slug === productSlug);
            if (product) {
                renderProductDetails(product);
                renderProductImages(product.gallery);
                renderYouMayAlsoLike(product.others);
            } else {
                console.error('Product not found.');
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
                productImagePicture.innerHTML = `
                    <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
                    <source media="(min-width: 768px)" srcset="${product.image.tablet}">
                    <img src="${product.image.mobile}" alt="${product.name}">
                `;
            }

            // Product Info
            const productDetailInfo = productDetailHero.querySelector('.product-detail-info');
            if (productDetailInfo) {
                if (product.new) {
                    const newProductTag = productDetailInfo.querySelector('.new-product-tag');
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
        const featuresContent = document.querySelector('.features-content p');
        if (featuresContent) {
            // Split the features string by '\n\n' to create paragraphs
            const featureParagraphs = product.features.split('\n\n').map(p => `<p>${p}</p>`).join('');
            featuresContent.outerHTML = `<h2>Features</h2>${featureParagraphs}`;
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
                <source media="(min-width: 1024px)" srcset="${gallery.first.desktop}">
                <source media="(min-width: 768px)" srcset="${gallery.first.tablet}">
                <img src="${gallery.first.mobile}" alt="Gallery Image 1">
            `;
        }

        const galleryImageSmall2 = document.querySelector('.gallery-image-small-2 picture');
        if (galleryImageSmall2) {
            galleryImageSmall2.innerHTML = `
                <source media="(min-width: 1024px)" srcset="${gallery.second.desktop}">
                <source media="(min-width: 768px)" srcset="${gallery.second.tablet}">
                <img src="${gallery.second.mobile}" alt="Gallery Image 2">
            `;
        }

        const galleryImageLarge = document.querySelector('.gallery-image-large picture');
        if (galleryImageLarge) {
            galleryImageLarge.innerHTML = `
                <source media="(min-width: 1024px)" srcset="${gallery.third.desktop}">
                <source media="(min-width: 768px)" srcset="${gallery.third.tablet}">
                <img src="${gallery.third.third}" alt="Gallery Image 3">
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
                            <source media="(min-width: 1024px)" srcset="${item.image.desktop}">
                            <source media="(min-width: 768px)" srcset="${item.image.tablet}">
                            <img src="${item.image.mobile}" alt="${item.name}">
                        </picture>
                    </div>
                    <h3>${item.name}</h3>
                    <a href="/product/${item.slug}" class="button button-primary">SEE PRODUCT</a>
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
});