let cart = []; // Stores cart items
let subscribers = []; // Stores functions that should be called when cart updates

// Function to add item to cart
export const addToCart = (product) => {
  cart.push(product);

  // Notify all subscribers about the cart update
  subscribers.forEach((callback) => callback(cart));
};

// Function to get all cart items
export const getCart = () => cart;

// Function to subscribe to cart updates
export const subscribeToCart = (callback) => {
  subscribers.push(callback);
};

// Function to unsubscribe from cart updates
export const unsubscribeFromCart = (callback) => {
  subscribers = subscribers.filter((sub) => sub !== callback);
};
