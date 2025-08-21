import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CreditCardIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const Ecommerce = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);

  // Simulated product data
  const productData = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 89.99,
      originalPrice: 129.99,
      category: 'electronics',
      rating: 4.5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      description: 'High-quality wireless headphones with noise cancellation and long battery life.',
      inStock: true,
      features: ['Noise Cancellation', '30h Battery Life', 'Quick Charge', 'Bluetooth 5.0']
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 199.99,
      originalPrice: 249.99,
      category: 'electronics',
      rating: 4.3,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
      inStock: true,
      features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', '7-day Battery']
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      price: 29.99,
      originalPrice: 39.99,
      category: 'clothing',
      rating: 4.7,
      reviews: 256,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      description: 'Comfortable and sustainable cotton t-shirt in various colors.',
      inStock: true,
      features: ['100% Organic Cotton', 'Multiple Colors', 'Sustainable', 'Comfortable Fit']
    },
    {
      id: 4,
      name: 'Stainless Steel Water Bottle',
      price: 24.99,
      originalPrice: 34.99,
      category: 'home',
      rating: 4.6,
      reviews: 342,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
      description: 'Insulated water bottle that keeps drinks cold for 24 hours.',
      inStock: true,
      features: ['24h Cold', '12h Hot', 'BPA Free', 'Leak Proof']
    },
    {
      id: 5,
      name: 'Wireless Charging Pad',
      price: 49.99,
      originalPrice: 69.99,
      category: 'electronics',
      rating: 4.2,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
      description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
      inStock: false,
      features: ['15W Fast Charging', 'Qi Compatible', 'LED Indicator', 'Non-slip Base']
    },
    {
      id: 6,
      name: 'Leather Wallet',
      price: 59.99,
      originalPrice: 79.99,
      category: 'accessories',
      rating: 4.4,
      reviews: 93,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
      description: 'Genuine leather wallet with RFID protection and multiple card slots.',
      inStock: true,
      features: ['Genuine Leather', 'RFID Protection', '6 Card Slots', 'Coin Pocket']
    }
  ];

  useEffect(() => {
    setProducts(productData);
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.find(item => item.id === product.id);
    
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      toast.success('Removed from wishlist');
    } else {
      setWishlist([...wishlist, product]);
      toast.success('Added to wishlist');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const sortOptions = [
    { id: 'name', name: 'Name A-Z' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            E-commerce Store
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover amazing products at great prices
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {getCartItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                  wishlist.find(item => item.id === product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:text-red-500'
                }`}
              >
                <HeartIcon className="w-5 h-5" />
              </button>
              {!product.inStock && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                  Out of Stock
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  ({product.reviews})
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Shopping Cart ({getCartItemCount()})
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              ${item.price}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          Total:
                        </span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ${getCartTotal().toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          setIsCheckoutOpen(true);
                        }}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsCheckoutOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Checkout
                  </h2>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Checkout Steps */}
                <div className="mb-6">
                  <div className="flex items-center justify-center space-x-4">
                    <div className={`flex items-center ${checkoutStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        checkoutStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                      }`}>
                        1
                      </div>
                      <span className="ml-2">Shipping</span>
                    </div>
                    <div className={`w-8 h-0.5 ${checkoutStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center ${checkoutStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        checkoutStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                      }`}>
                        2
                      </div>
                      <span className="ml-2">Payment</span>
                    </div>
                    <div className={`w-8 h-0.5 ${checkoutStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center ${checkoutStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        checkoutStep >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                      }`}>
                        3
                      </div>
                      <span className="ml-2">Review</span>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                {checkoutStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Shipping Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="ZIP"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Payment Information
                    </h3>
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Name on Card"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setCheckoutStep(1)}
                        className="flex-1 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setCheckoutStep(3)}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Continue to Review
                      </button>
                    </div>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Order Review
                    </h3>
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span className="text-gray-900 dark:text-white">Total:</span>
                          <span className="text-xl text-gray-900 dark:text-white">
                            ${getCartTotal().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setCheckoutStep(2)}
                        className="flex-1 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          toast.success('Order placed successfully!');
                          setCart([]);
                          setIsCheckoutOpen(false);
                          setCheckoutStep(1);
                        }}
                        className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ecommerce;
