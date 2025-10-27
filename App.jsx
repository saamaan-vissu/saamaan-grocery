import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Package, Home, Phone, Menu, X, Search, Plus, Minus, Trash2, MapPin, Clock, CheckCircle, Edit, LogOut } from 'lucide-react';

// Sample Products Data (10 items as requested)
const SAMPLE_PRODUCTS = [
  {
    id: 'p1',
    name: 'Premium Organic Rice',
    category: 'Rice & Grains',
    price: 79,
    unit: 'kg',
    image: '🍚',
    description: 'Pure organic rice from local farms',
    inStock: true,
    weights: ['2kg', '5kg', '10kg', '25kg']
  },
  {
    id: 'p2',
    name: 'Local Rice',
    category: 'Rice & Grains',
    price: 69,
    unit: 'kg',
    image: '🌾',
    description: 'Fresh local rice, harvested weekly',
    inStock: true,
    weights: ['2kg', '5kg', '10kg', '25kg']
  },
  {
    id: 'p3',
    name: 'Masoor Dal (Red Lentils)',
    category: 'Pulses & Dal',
    price: 120,
    unit: 'kg',
    image: '🫘',
    description: 'Premium quality red lentils',
    inStock: true,
    weights: ['1kg', '2kg', '5kg']
  },
  {
    id: 'p4',
    name: 'Moong Dal (Green Gram)',
    category: 'Pulses & Dal',
    price: 130,
    unit: 'kg',
    image: '🫛',
    description: 'Organic moong dal, protein rich',
    inStock: true,
    weights: ['1kg', '2kg', '5kg']
  },
  {
    id: 'p5',
    name: 'Mustard Oil',
    category: 'Oil & Ghee',
    price: 180,
    unit: 'liter',
    image: '🛢️',
    description: 'Pure cold-pressed mustard oil',
    inStock: true,
    weights: ['500ml', '1L', '2L', '5L']
  },
  {
    id: 'p6',
    name: 'Pure Ghee',
    category: 'Oil & Ghee',
    price: 650,
    unit: 'kg',
    image: '🧈',
    description: 'Traditional cow ghee, 100% pure',
    inStock: true,
    weights: ['250g', '500g', '1kg']
  },
  {
    id: 'p7',
    name: 'Turmeric Powder',
    category: 'Spices',
    price: 200,
    unit: 'kg',
    image: '🌟',
    description: 'Organic turmeric, ground fresh',
    inStock: true,
    weights: ['100g', '250g', '500g', '1kg']
  },
  {
    id: 'p8',
    name: 'Red Chili Powder',
    category: 'Spices',
    price: 180,
    unit: 'kg',
    image: '🌶️',
    description: 'Hot and flavorful chili powder',
    inStock: true,
    weights: ['100g', '250g', '500g', '1kg']
  },
  {
    id: 'p9',
    name: 'Premium Tea Leaves',
    category: 'Daily Essentials',
    price: 350,
    unit: 'kg',
    image: '🍵',
    description: 'Fresh Nepali tea leaves',
    inStock: true,
    weights: ['250g', '500g', '1kg']
  },
  {
    id: 'p10',
    name: 'Rock Salt',
    category: 'Spices',
    price: 40,
    unit: 'kg',
    image: '🧂',
    description: 'Natural rock salt, unprocessed',
    inStock: true,
    weights: ['500g', '1kg', '2kg']
  }
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [products] = useState(SAMPLE_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orders, setOrders] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ phone: '', password: '', name: '' });

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOrders, setAdminOrders] = useState([]);

  const categories = ['All', 'Rice & Grains', 'Pulses & Dal', 'Oil & Ghee', 'Spices', 'Daily Essentials'];

  // Mock Authentication
  const handleAuth = (e) => {
    e.preventDefault();
    if (authForm.phone === 'admin' && authForm.password === 'admin123') {
      setIsAdmin(true);
      setUser({ name: 'Admin', phone: 'admin', role: 'admin' });
      setCurrentPage('admin');
      setShowAuthModal(false);
    } else if (authMode === 'login') {
      setUser({ name: authForm.name || 'Customer', phone: authForm.phone, role: 'customer' });
      setShowAuthModal(false);
    } else {
      setUser({ name: authForm.name, phone: authForm.phone, role: 'customer' });
      setShowAuthModal(false);
    }
    setAuthForm({ phone: '', password: '', name: '' });
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setCurrentPage('home');
    setCart([]);
  };

  const addToCart = (product, weight) => {
    const cartItem = {
      ...product,
      selectedWeight: weight,
      quantity: 1,
      cartId: `${product.id}-${weight}`
    };
    
    const existingItem = cart.find(item => item.cartId === cartItem.cartId);
    if (existingItem) {
      updateQuantity(cartItem.cartId, existingItem.quantity + 1);
    } else {
      setCart([...cart, cartItem]);
    }
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.cartId !== cartId));
    } else {
      setCart(cart.map(item => 
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const weightNum = parseFloat(item.selectedWeight);
      return total + (item.price * weightNum * item.quantity);
    }, 0);
  };

  const getDeliveryFee = () => {
    const total = getTotalPrice();
    return total >= 499 ? 0 : 49;
  };

  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      items: [...cart],
      customer: orderDetails,
      totalAmount: getTotalPrice() + getDeliveryFee(),
      status: 'Pending',
      date: new Date().toISOString(),
      deliveryType: orderDetails.deliveryType
    };
    
    setOrders([...orders, newOrder]);
    setAdminOrders([...adminOrders, newOrder]);
    setCart([]);
    setCurrentPage('orders');
  };

  // Header Component
  const Header = () => (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="text-3xl">🛍️</div>
            <div>
              <h1 className="text-2xl font-bold text-blue-500">Saamaan</h1>
              <p className="text-xs text-gray-500">One click. Delivered to Your home</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
              <Home size={20} />
              <span>Home</span>
            </button>
            <button onClick={() => setCurrentPage('products')} className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
              <Package size={20} />
              <span>Products</span>
            </button>
            <button onClick={() => setCurrentPage('cart')} className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 relative">
              <ShoppingCart size={20} />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </button>
            {user ? (
              <>
                <button onClick={() => setCurrentPage(isAdmin ? 'admin' : 'dashboard')} className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
                  <User size={20} />
                  <span>{user.name}</span>
                </button>
                <button onClick={handleLogout} className="flex items-center space-x-1 text-red-500 hover:text-red-700">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Login
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2">
            <button onClick={() => { setCurrentPage('home'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Home</button>
            <button onClick={() => { setCurrentPage('products'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Products</button>
            <button onClick={() => { setCurrentPage('cart'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Cart ({cart.length})</button>
            {user ? (
              <>
                <button onClick={() => { setCurrentPage(isAdmin ? 'admin' : 'dashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">{user.name}</button>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded">Logout</button>
              </>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 bg-blue-500 text-white rounded">Login</button>
            )}
          </nav>
        )}
      </div>
    </header>
  );

  // Home Page
  const HomePage = () => (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Fresh Groceries Delivered to Your Doorstep</h2>
          <p className="text-xl mb-8">Pure • Organic • Local</p>
          <button onClick={() => setCurrentPage('products')} className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-orange-600 transition">
            Shop Now
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Free Delivery</h3>
            <p className="text-gray-600">On orders above Rs. 499</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="text-5xl mb-4">🌾</div>
            <h3 className="text-xl font-bold mb-2">100% Organic</h3>
            <p className="text-gray-600">Sourced from local farms</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Within 24-48 hours</p>
          </div>
        </div>

        {/* Featured Products */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-center">Featured Products</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {products.slice(0, 4).map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
                <div className="text-6xl mb-4 text-center">{product.image}</div>
                <h4 className="font-bold text-lg mb-2">{product.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-500">Rs. {product.price}/{product.unit}</span>
                  <button onClick={() => setCurrentPage('products')} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Products Page
  const ProductsPage = () => {
    const filteredProducts = products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Our Products</h2>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    );
  };

  // Product Card Component
  const ProductCard = ({ product, addToCart }) => {
    const [selectedWeight, setSelectedWeight] = useState(product.weights[0]);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAddToCart = () => {
      addToCart(product, selectedWeight);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
      <div className="bg-white rounded-lg shadow hover:shadow-xl transition p-4 relative">
        {showSuccess && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
            <CheckCircle size={16} />
            <span>Added!</span>
          </div>
        )}
        <div className="text-6xl mb-4 text-center">{product.image}</div>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">{product.category}</span>
        <h4 className="font-bold text-lg mt-2 mb-2">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        <div className="mb-3">
          <label className="text-sm text-gray-600 block mb-1">Select Weight:</label>
          <select
            value={selectedWeight}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {product.weights.map(weight => (
              <option key={weight} value={weight}>{weight}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-500">Rs. {product.price}/{product.unit}</span>
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };
// Cart Page
  const CartPage = () => {
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState({
      name: user?.name || '',
      phone: user?.phone || '',
      area: '',
      ward: '',
      street: '',
      house: '',
      landmark: '',
      deliveryType: 'standard'
    });

    const total = getTotalPrice();
    const deliveryFee = getDeliveryFee();
    const grandTotal = total + deliveryFee;

    const handleCheckout = (e) => {
      e.preventDefault();
      if (!user) {
        setShowAuthModal(true);
        return;
      }
      placeOrder(checkoutForm);
      setShowCheckout(false);
      setCheckoutForm({
        name: user?.name || '',
        phone: user?.phone || '',
        area: '',
        ward: '',
        street: '',
        house: '',
        landmark: '',
        deliveryType: 'standard'
      });
    };

    if (cart.length === 0) {
      return (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button onClick={() => setCurrentPage('products')} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            Start Shopping
          </button>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.cartId} className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
                <div className="text-4xl">{item.image}</div>
                <div className="flex-1">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.selectedWeight} @ Rs. {item.price}/{item.unit}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="bg-gray-200 p-1 rounded hover:bg-gray-300">
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="bg-gray-200 p-1 rounded hover:bg-gray-300">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">Rs. {(item.price * parseFloat(item.selectedWeight) * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:text-red-700 text-sm flex items-center space-x-1">
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span className={deliveryFee === 0 ? 'text-green-500 font-bold' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                </span>
              </div>
              {total < 499 && (
                <p className="text-xs text-orange-500">Add Rs. {(499 - total).toFixed(2)} more for free delivery!</p>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>Rs. {grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-bold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">Checkout</h3>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Area *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.area}
                      onChange={(e) => setCheckoutForm({...checkoutForm, area: e.target.value})}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Ward No. *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.ward}
                      onChange={(e) => setCheckoutForm({...checkoutForm, ward: e.target.value})}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Street Name *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.street}
                      onChange={(e) => setCheckoutForm({...checkoutForm, street: e.target.value})}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">House Number *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.house}
                      onChange={(e) => setCheckoutForm({...checkoutForm, house: e.target.value})}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Nearby Famous Place</label>
                  <input
                    type="text"
                    value={checkoutForm.landmark}
                    onChange={(e) => setCheckoutForm({...checkoutForm, landmark: e.target.value})}
                    placeholder="e.g., Near Traffic Park"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Delivery Type *</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="standard"
                        checked={checkoutForm.deliveryType === 'standard'}
                        onChange={(e) => setCheckoutForm({...checkoutForm, deliveryType: e.target.value})}
                        className="text-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-bold">Standard Delivery - FREE</div>
                        <div className="text-sm text-gray-600">24-48 hours (Free on orders ≥ Rs. 499)</div>
                      </div>
                    </label>
                    <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="express"
                        checked={checkoutForm.deliveryType === 'express'}
                        onChange={(e) => setCheckoutForm({...checkoutForm, deliveryType: e.target.value})}
                        className="text-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-bold">Express Delivery - Rs. 99</div>
                        <div className="text-sm text-gray-600">Same day (12-18 hours)</div>
                      </div>
                    </label>
                    <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="emergency"
                        checked={checkoutForm.deliveryType === 'emergency'}
                        onChange={(e) => setCheckoutForm({...checkoutForm, deliveryType: e.target.value})}
                        className="text-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-bold">Emergency Delivery - Rs. 149</div>
                        <div className="text-sm text-gray-600">Within 4-6 hours</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded">
                  <div className="font-bold mb-2">Payment Method</div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" checked readOnly />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Online payment coming soon!</p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-bold"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Customer Dashboard
  const CustomerDashboard = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}! 👋</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'Delivered').length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'Pending' || o.status === 'Out for Delivery').length}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">My Orders</h3>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-600 mb-4">No orders yet</p>
              <button onClick={() => setCurrentPage('products')} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-lg">Order #{order.id}</div>
                      <div className="text-sm text-gray-600">{new Date(order.date).toLocaleString()}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-3">
                    {order.items.map(item => (
                      <div key={item.cartId} className="flex items-center space-x-3 text-sm">
                        <span className="text-2xl">{item.image}</span>
                        <span>{item.name} ({item.selectedWeight}) x {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-bold">Total: Rs. {order.totalAmount.toFixed(2)}</span>
                    <a 
                      href={`https://wa.me/9779821072912?text=Hi, I need help with Order ${order.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                    >
                      <Phone size={16} />
                      <span>Contact Support</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Admin Dashboard
  const AdminDashboard = () => {
    const [adminView, setAdminView] = useState('orders');
    const [editingProduct, setEditingProduct] = useState(null);

    const updateOrderStatus = (orderId, newStatus) => {
      setAdminOrders(adminOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard 🔐</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-2xl font-bold">{adminOrders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold">{adminOrders.filter(o => o.status === 'Pending').length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">🚚</div>
              <div className="text-2xl font-bold">{adminOrders.filter(o => o.status === 'Out for Delivery').length}</div>
              <div className="text-sm text-gray-600">Out for Delivery</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold">{adminOrders.filter(o => o.status === 'Delivered').length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b flex space-x-4 p-4">
            <button
              onClick={() => setAdminView('orders')}
              className={`px-4 py-2 rounded-lg font-bold ${adminView === 'orders' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Orders
            </button>
            <button
              onClick={() => setAdminView('products')}
              className={`px-4 py-2 rounded-lg font-bold ${adminView === 'products' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Products
            </button>
          </div>
<div className="p-6">
            {adminView === 'orders' ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Manage Orders</h3>
                {adminOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No orders yet</div>
                ) : (
                  adminOrders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-lg">Order #{order.id}</div>
                          <div className="text-sm text-gray-600">{new Date(order.date).toLocaleString()}</div>
                          <div className="mt-2 text-sm">
                            <div><strong>Customer:</strong> {order.customer.name}</div>
                            <div><strong>Phone:</strong> {order.customer.phone}</div>
                            <div><strong>Address:</strong> {order.customer.area}, Ward {order.customer.ward}, {order.customer.street}, House {order.customer.house}</div>
                            {order.customer.landmark && <div><strong>Landmark:</strong> {order.customer.landmark}</div>}
                            <div><strong>Delivery:</strong> {order.deliveryType === 'standard' ? 'Standard (24-48h)' : order.deliveryType === 'express' ? 'Express (Same day)' : 'Emergency (4-6h)'}</div>
                          </div>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-300' :
                            order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                            'bg-orange-100 text-orange-700 border-orange-300'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <div className="font-bold mb-2">Order Items:</div>
                        {order.items.map(item => (
                          <div key={item.cartId} className="flex justify-between text-sm mb-1">
                            <span>{item.image} {item.name} ({item.selectedWeight}) x {item.quantity}</span>
                            <span>Rs. {(item.price * parseFloat(item.selectedWeight) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="font-bold text-lg">Total: Rs. {order.totalAmount.toFixed(2)}</span>
                        <a 
                          href={`https://wa.me/977${order.customer.phone}?text=Hi ${order.customer.name}, your order ${order.id} status: ${order.status}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          <Phone size={16} />
                          <span>Contact Customer</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold mb-4">Manage Products</h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm">
                    <strong>Note:</strong> Product management (Add/Edit/Delete) will be available in the Firebase admin panel after deployment. 
                    You'll be able to add products directly to your Firestore database with images, prices, and descriptions.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="text-4xl mb-2">{product.image}</div>
                      <h4 className="font-bold">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <p className="text-lg font-bold text-blue-500 mt-2">Rs. {product.price}/{product.unit}</p>
                      <div className="text-xs text-gray-500 mt-1">Weights: {product.weights.join(', ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Auth Modal
  const AuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">{authMode === 'login' ? 'Login' : 'Sign Up'}</h3>
        <form onSubmit={handleAuth} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-sm font-bold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={authForm.name}
                onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold mb-1">Phone Number *</label>
            <input
              type="text"
              required
              value={authForm.phone}
              onChange={(e) => setAuthForm({...authForm, phone: e.target.value})}
              placeholder="9821072912"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Password *</label>
            <input
              type="password"
              required
              value={authForm.password}
              onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="bg-blue-50 p-3 rounded text-sm">
            <strong>Admin Login:</strong> Phone: admin | Password: admin123
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => {
                setShowAuthModal(false);
                setAuthForm({ phone: '', password: '', name: '' });
              }}
              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              {authMode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </div>
          
          <div className="text-center text-sm">
            {authMode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button type="button" onClick={() => setAuthMode('signup')} className="text-blue-500 hover:underline">
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button type="button" onClick={() => setAuthMode('login')} className="text-blue-500 hover:underline">
                  Login
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">🛍️ Saamaan</h4>
            <p className="text-gray-400 text-sm">Making daily grocery shopping fast, affordable, and stress-free for every household in Butwal.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button onClick={() => setCurrentPage('home')} className="block text-gray-400 hover:text-white">Home</button>
              <button onClick={() => setCurrentPage('products')} className="block text-gray-400 hover:text-white">Products</button>
              <button onClick={() => setCurrentPage('cart')} className="block text-gray-400 hover:text-white">Cart</button>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+977 9821072912</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Butwal, Nepal</span>
              </div>
              <a 
                href="https://wa.me/9779821072912"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded mt-3 hover:bg-green-600"
              >
                <Phone size={16} />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© 2025 Saamaan. Made with ❤️ by Vishal Sharma</p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'products' && <ProductsPage />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'dashboard' && <CustomerDashboard />}
        {currentPage === 'admin' && <AdminDashboard />}
        {currentPage === 'orders' && <CustomerDashboard />}
      </main>
      <Footer />
      {showAuthModal && <AuthModal />}
    </div>
  );
};

export default App;
