// Main application script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart in localStorage if not exists
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Load featured products
    loadFeaturedProducts();

    // Update cart count in header
    updateCartCount();
});

// Fetch and display featured products
async function loadFeaturedProducts() {
    try {
        // In development, we'll mock the API response
        const mockProducts = [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 99.99,
                description: "Premium noise-cancelling wireless headphones",
                image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            },
            {
                id: 2,
                name: "Smart Watch",
                price: 199.99,
                description: "Fitness tracker with heart rate monitor",
                image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            },
            {
                id: 3,
                name: "Bluetooth Speaker",
                price: 79.99,
                description: "Portable waterproof speaker",
                image: "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
        ];

        displayProducts(mockProducts);
        
        // In production, we would use:
        // const response = await fetch('/api/products?featured=true');
        // const products = await response.json();
        // displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in the featured section
function displayProducts(products) {
    const productsContainer = document.getElementById('featured-products');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-lg">$${product.price.toFixed(2)}</span>
                    <button onclick="addToCart(${product.id})" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Add product to cart
function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.fa-shopping-cart + span');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}