const CART_STORAGE_KEY = 'audiophileCart';

/**
 * Retrieves the current cart from localStorage.
 * @returns {Array} An array of cart items, or an empty array if no cart exists.
 */
function getCart() {
    const cartString = localStorage.getItem(CART_STORAGE_KEY);
    return cartString ? JSON.parse(cartString) : [];
}

const correctAssetPath = (path) => {
    return  path.replace('/assets/', '/assets/images/'); 
};