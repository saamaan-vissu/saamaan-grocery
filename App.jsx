 import React, { useState } from 'react';
import { ShoppingCart, User, Package, Home, Phone, Menu, X, Search, Plus, Minus, Trash2, MapPin, Clock, CheckCircle, Edit, LogOut, Upload, DollarSign, BarChart3, Users, Settings, Star, TrendingUp, Calendar } from 'lucide-react';

// Initial sample products with more details
const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Premium Organic Rice', category: 'Rice & Grains', price: 79, unit: 'kg', image: '🍚', description: 'Pure organic rice from local farms', inStock: true, weights: ['2kg', '5kg', '10kg', '25kg'], rating: 4.8, reviews: 156 },
  { id: 'p2', name: 'Local Rice', category: 'Rice & Grains', price: 69, unit: 'kg', image: '🌾', description: 'Fresh local rice, harvested weekly', inStock: true, weights: ['2kg', '5kg', '10kg', '25kg'], rating: 4.6, reviews: 203 },
  { id: 'p3', name: 'Masoor Dal (Red Lentils)', category: 'Pulses & Dal', price: 120, unit: 'kg', image: '🫘', description: 'Premium quality red lentils', inStock: true, weights: ['1kg', '2kg', '5kg'], rating: 4.7, reviews: 89 },
  { id: 'p4', name: 'Moong Dal (Green Gram)', category: 'Pulses & Dal', price: 130, unit: 'kg', image: '🫛', description: 'Organic moong dal, protein rich', inStock: true, weights: ['1kg', '2kg', '5kg'], rating: 4.9, reviews: 134 },
  { id: 'p5', name: 'Mustard Oil', category: 'Oil & Ghee', price: 180, unit: 'liter', image: '🛢️', description: 'Pure cold-pressed mustard oil', inStock: true, weights: ['500ml', '1L', '2L', '5L'], rating: 4.8, reviews: 167 },
  { id: 'p6', name: 'Pure Ghee', category: 'Oil & Ghee', price: 650, unit: 'kg', image: '🧈', description: 'Traditional cow ghee, 100% pure', inStock: true, weights: ['250g', '500g', '1kg'], rating: 5.0, reviews: 245 },
  { id: 'p7', name: 'Turmeric Powder', category: 'Spices', price: 200, unit: 'kg', image: '🌟', description: 'Organic turmeric, ground fresh', inStock: true, weights: ['100g', '250g', '500g', '1kg'], rating: 4.7, reviews: 98 },
  { id: 'p8', name: 'Red Chili Powder', category: 'Spices', price: 180, unit: 'kg', image: '🌶️', description: 'Hot and flavorful chili powder', inStock: true, weights: ['100g', '250g', '500g', '1kg'], rating: 4.6, reviews: 112 },
  { id: 'p9', name: 'Premium Tea Leaves', category: 'Daily Essentials', price: 350, unit: 'kg', image: '🍵', description: 'Fresh Nepali tea leaves', inStock: true, weights: ['250g', '500g', '1kg'], rating: 4.9, reviews: 289 },
  { id: 'p10', name: 'Rock Salt', category: 'Spices', price: 40, unit: 'kg', image: '🧂', description: 'Natural rock salt, unprocessed', inStock: true, weights: ['500g', '1kg', '2kg'], rating: 4.5, reviews: 67 }
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orders, setOrders] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ phone: '', password: '', name: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOrders, setAdminOrders] = useState([]);
  const [brandLogo, setBrandLogo] = useState('🛍️');
  const [adminView, setAdminView] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', category: 'Rice & Grains', price: '', unit: 'kg', image: '📦',
    description: '', inStock: true, weights: '', rating: 5, reviews: 0
  });

  const categories = ['All', 'Rice & Grains', 'Pulses & Dal', 'Oil & Ghee', 'Spices', 'Daily Essentials'];

  const handleAuthInputChange = (field, value) => {
    setAuthForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (authForm.phone !== '9821072912' && authForm.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    if (authForm.phone === '9821072912' && authForm.password === 'ovs123') {
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
    const cartItem = { ...product, selectedWeight: weight, quantity: 1, cartId: `${product.id}-${weight}` };
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
      setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity: newQuantity } : item));
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

  const handleProductFormChange = (field, value) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: `p${Date.now()}`,
      ...productForm,
      price: parseFloat(productForm.price),
      weights: productForm.weights.split(',').map(w => w.trim()),
      rating: parseFloat(productForm.rating)
    };
    setProducts([...products, newProduct]);
    setShowProductModal(false);
    resetProductForm();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      unit: product.unit,
      image: product.image,
      description: product.description,
      inStock: product.inStock,
      weights: product.weights.join(', '),
      rating: product.rating,
      reviews: product.reviews
    });
    setShowProductModal(true);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...editingProduct,
      ...productForm,
      price: parseFloat(productForm.price),
      weights: productForm.weights.split(',').map(w => w.trim()),
      rating: parseFloat(productForm.rating)
    };
    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setShowProductModal(false);
    setEditingProduct(null);
    resetProductForm();
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '', category: 'Rice & Grains', price: '', unit: 'kg', image: '📦',
      description: '', inStock: true, weights: '', rating: 5, reviews: 0
    });
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setAdminOrders(adminOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const Header = () => (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="text-3xl">{brandLogo}</div>
            <div>
              <h1 className="text-2xl font-bold text-blue-500">Saamaan</h1>
              <p className="text-xs text-gray-500">One click. Delivered to Your home</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition">
              <Home size={20} />
              <span>Home</span>
            </button>
            <button onClick={() => setCurrentPage('products')} className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition">
              <Package size={20} />
              <span>Products</span>
            </button>
            <button onClick={() => setCurrentPage('cart')} className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition relative">
              <ShoppingCart size={20} />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            {user ? (
              <>
                <button onClick={() => setCurrentPage(isAdmin ? 'admin' : 'dashboard')} className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition">
                  <User size={20} />
                  <span>{user.name}</span>
                </button>
                <button onClick={handleLogout} className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow-md">
                Login
              </button>
            )}
          </nav>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2">
            <button onClick={() => { setCurrentPage('home'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition">Home</button>
            <button onClick={() => { setCurrentPage('products'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition">Products</button>
            <button onClick={() => { setCurrentPage('cart'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition">Cart ({cart.length})</button>
            {user ? (
              <>
                <button onClick={() => { setCurrentPage(isAdmin ? 'admin' : 'dashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition">{user.name}</button>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded transition">Logout</button>
              </>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 bg-blue-500 text-white rounded transition">Login</button>
            )}
          </nav>
        )}
      </div>
    </header>
  );

  const HomePage = () => (
    <div>
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Fresh Groceries Delivered to Your Doorstep</h2>
          <p className="text-xl mb-8">Pure • Organic • Local</p>
          <button onClick={() => setCurrentPage('products')} className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-orange-600 transition shadow-lg">
            Shop Now
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow hover:shadow-xl transition">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Free Delivery</h3>
            <p className="text-gray-600">On orders above Rs. 499</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow hover:shadow-xl transition">
            <div className="text-5xl mb-4">🌾</div>
            <h3 className="text-xl font-bold mb-2">100% Organic</h3>
            <p className="text-gray-600">Sourced from local farms</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow hover:shadow-xl transition">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Within 24-48 hours</p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-center">Featured Products</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {products.slice(0, 4).map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-xl transition p-4 cursor-pointer" onClick={() => setCurrentPage('products')}>
                <div className="text-6xl mb-4 text-center">{product.image}</div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{product.name}</h4>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-500">Rs. {product.price}/{product.unit}</span>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm transition">
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

  const ProductsPage = () => {
    const filteredProducts = products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Our Products</h2>

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

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    );
  };

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
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 z-10">
            <CheckCircle size={16} />
            <span>Added!</span>
          </div>
        )}
        <div className="text-6xl mb-4 text-center">{product.image}</div>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">{product.category}</span>
        <div className="flex items-center justify-center my-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
          ))}
          <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
        </div>
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

  const CartPage = () => {
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState({
      name: user?.name || '', phone: user?.phone || '', area: '', ward: '',
      street: '', house: '', landmark: '', deliveryType: 'standard'
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
        name: user?.name || '', phone: user?.phone || '', area: '', ward: '',
        street: '', house: '', landmark: '', deliveryType: 'standard'
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
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-bold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">Checkout</h3>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Full Name *</label>
                    <input type="text" required value={checkoutForm.name} onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Phone Number (10 digits) *</label>
                    <input type="tel" required maxLength="10" pattern="[0-9]{10}" value={checkoutForm.phone} onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value.replace(/\D/g, '')})} placeholder="9821072912" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Area *</label>
                    <input type="text" required value={checkoutForm.area} onChange={(e) => setCheckoutForm({...checkoutForm, area: e.target.value})} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Ward No. *</label>
                    <input type="text" required value={checkoutForm.ward} onChange={(e) => setCheckoutForm({...checkoutForm, ward: e.target.value})} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Street Name *</label>
                    <input type="text" required value={checkoutForm.street} onChange={(e) => setCheckoutForm({...checkoutForm, street: e.target.value})} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">House Number *</label>
                    <input type="text" required value={checkoutForm.house} onChange={(e) => setCheckoutForm({...checkoutForm, house: e.target.value})} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Nearby Famous Place</label>
                  <input type="text" value={checkoutForm.landmark} onChange={(e) => setCheckoutForm({...checkoutForm, landmark: e.target.value})} placeholder="e.g., Near Traffic Park" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Delivery Type *</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="deliveryType" value="standard" checked={checkoutForm.deliveryType === 'standard'} onChange={(e) => setCheckoutForm({...checkoutForm, deliveryType: e.target.value})} />
                      <div className="flex-1">
                        <div className="font-bold">Standard Delivery - FREE</div>
                        <div className="text-sm text-gray-600">24-48 hours (Free on orders ≥ Rs. 499)</div>
                      </div>
                    </label>
                    <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="deliveryType" value="express" checked={checkoutForm.deliveryType === 'express'} onChange={(e) => setCheckoutForm({...checkoutForm, deliveryType: e.target.value})} />
                      <div className="flex-1">
                        <div className="font-bold">Express Delivery - Rs. 99</div>
                        <div className="text-sm text-gray-600">Same day (12-18 hours)</div>
                      </div>
                    </label>
                    <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="deliveryType" value="emergency" checked={checkoutForm.deliveryType === 'emergency'} onChange={(e) => setCheckoutForm({...checkoutForm, deliveryType: e.target.value})} />
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
                  <button type="button" onClick={() => setShowCheckout(false)} className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 font-bold">Cancel</button>
                  <button type="submit" className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-bold">Place Order</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CustomerDashboard = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Welcome back, {user?.name}! 👋</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-lg">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-sm">Total Orders</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-lg">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'Delivered').length}</div>
              <div className="text-sm">Completed</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-lg">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'Pending' || o.status === 'Out for Delivery').length}</div>
              <div className="text-sm">In Progress</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">My Orders</h3>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-600 mb-4">No orders yet</p>
              <button onClick={() => setCurrentPage('products')} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">Start Shopping</button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-lg">Order #{order.id}</div>
                      <div className="text-sm text-gray-600 flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(order.date).toLocaleString()}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>{order.status}</span>
                  </div>
                  <div className="space-y-2 mb-3 bg-gray-50 p-3 rounded">
                    {order.items.map(item => (
                      <div key={item.cartId} className="flex items-center space-x-3 text-sm">
                        <span className="text-2xl">{item.image}</span>
                        <span className="flex-1">{item.name} ({item.selectedWeight}) x {item.quantity}</span>
                        <span className="font-bold">Rs. {(item.price * parseFloat(item.selectedWeight) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-bold text-lg">Total: Rs. {order.totalAmount.toFixed(2)}</span>
                    <a href={`https://wa.me/9779821072912?text=Hi, I need help with Order ${order.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-green-600 hover:text-green-700">
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

  const AdminDashboard = () => {
    const totalRevenue = adminOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = adminOrders.length > 0 ? totalRevenue / adminOrders.length : 0;

    return (
      <div className="container mx-auto px-4 py-8 pb-24">
        {adminView === 'dashboard' && (
          <>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Admin Dashboard 🔐</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Package size={24} />
                    <TrendingUp size={20} className="text-green-300" />
                  </div>
                  <div className="text-2xl font-bold">{adminOrders.length}</div>
                  <div className="text-sm">Total Orders</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign size={24} />
                    <TrendingUp size={20} className="text-green-300" />
                  </div>
                  <div className="text-2xl font-bold">Rs. {totalRevenue.toFixed(0)}</div>
                  <div className="text-sm">Total Revenue</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 size={24} />
                  </div>
                  <div className="text-2xl font-bold">Rs. {avgOrderValue.toFixed(0)}</div>
                  <div className="text-sm">Avg Order Value</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Users size={24} />
                  </div>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <div className="text-sm">Total Products</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Order Status</h3>
                  <Clock size={20} className="text-orange-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pending</span>
                    <span className="font-bold text-orange-500">{adminOrders.filter(o => o.status === 'Pending').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Out for Delivery</span>
                    <span className="font-bold text-blue-500">{adminOrders.filter(o => o.status === 'Out for Delivery').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivered</span>
                    <span className="font-bold text-green-500">{adminOrders.filter(o => o.status === 'Delivered').length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Top Products</h3>
                  <Star size={20} className="text-yellow-500" />
                </div>
                <div className="space-y-2">
                  {products.slice(0, 3).map(product => (
                    <div key={product.id} className="flex items-center space-x-2 text-sm">
                      <span className="text-xl">{product.image}</span>
                      <span className="flex-1 truncate">{product.name}</span>
                      <span className="text-yellow-500 flex items-center">
                        <Star size={12} className="fill-current" />
                        <span className="ml-1">{product.rating}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Quick Actions</h3>
                  <Settings size={20} className="text-gray-500" />
                </div>
                <div className="space-y-2">
      <button onClick={() => { setAdminView('products'); setShowProductModal(true); setEditingProduct(null); resetProductForm(); }} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm flex items-center justify-center space-x-2">
                    <Plus size={16} />
                    <span>Add New Product</span>
                  </button>
                  <button onClick={() => setAdminView('orders')} className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 text-sm flex items-center justify-center space-x-2">
                    <Package size={16} />
                    <span>Manage Orders</span>
                  </button>
                  <button onClick={() => setAdminView('settings')} className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 text-sm flex items-center justify-center space-x-2">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
              {adminOrders.slice(0, 5).map(order => (
                <div key={order.id} className="border-b last:border-b-0 py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold">#{order.id}</span>
                      <span className="text-sm text-gray-600 ml-3">{order.customer.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold">Rs. {order.totalAmount.toFixed(2)}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>{order.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {adminView === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-6">
              <h3 className="text-2xl font-bold">Manage Orders</h3>
            </div>
            <div className="p-6">
              {adminOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No orders yet</div>
              ) : (
                <div className="space-y-4">
                  {adminOrders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-lg">Order #{order.id}</div>
                          <div className="text-sm text-gray-600">{new Date(order.date).toLocaleString()}</div>
                          <div className="mt-2 text-sm space-y-1">
                            <div><strong>Customer:</strong> {order.customer.name}</div>
                            <div><strong>Phone:</strong> {order.customer.phone}</div>
                            <div><strong>Address:</strong> {order.customer.area}, Ward {order.customer.ward}, {order.customer.street}, House {order.customer.house}</div>
                            {order.customer.landmark && <div><strong>Landmark:</strong> {order.customer.landmark}</div>}
                            <div><strong>Delivery:</strong> {
                              order.deliveryType === 'standard' ? 'Standard (24-48h)' : 
                              order.deliveryType === 'express' ? 'Express (Same day)' : 
                              'Emergency (4-6h)'
                            }</div>
                          </div>
                        </div>
                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className={`px-3 py-2 rounded-lg text-sm font-bold border-2 cursor-pointer ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-300' :
                          order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                          'bg-orange-100 text-orange-700 border-orange-300'
                        }`}>
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
                            <span className="font-bold">Rs. {(item.price * parseFloat(item.selectedWeight) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="font-bold text-lg">Total: Rs. {order.totalAmount.toFixed(2)}</span>
                        <a href={`https://wa.me/977${order.customer.phone}?text=Hi ${order.customer.name}, your order ${order.id} status: ${order.status}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                          <Phone size={16} />
                          <span>Contact Customer</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {adminView === 'products' && (
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">Manage Products</h3>
              <button onClick={() => { setShowProductModal(true); setEditingProduct(null); resetProductForm(); }} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
                <Plus size={20} />
                <span>Add New Product</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-4xl">{product.image}</div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditProduct(product)} className="text-blue-500 hover:text-blue-700">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">{product.category}</span>
                    <h4 className="font-bold mt-2">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
                    </div>
                    <p className="text-lg font-bold text-blue-500 mt-2">Rs. {product.price}/{product.unit}</p>
                    <div className="text-xs text-gray-500 mt-1">Weights: {product.weights.join(', ')}</div>
                    <div className={`text-xs mt-2 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {adminView === 'settings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-6">
              <h3 className="text-2xl font-bold">Settings</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-bold mb-3">Brand Logo</h4>
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{brandLogo}</div>
                  <div>
                    <input type="text" value={brandLogo} onChange={(e) => setBrandLogo(e.target.value)} placeholder="Enter emoji" className="border rounded px-3 py-2 mr-2" maxLength="2" />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Logo</button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Tip: Copy an emoji from emojipedia.org!</p>
              </div>

              <div>
                <h4 className="font-bold mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold mb-1">WhatsApp Number</label>
                    <input type="tel" defaultValue="9821072912" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="10-digit number" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Email (Optional)</label>
                    <input type="email" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="info@saamaan.com" />
                  </div>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Save Changes</button>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3">Delivery Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold mb-1">Free Delivery Minimum (Rs.)</label>
                    <input type="number" defaultValue="499" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Standard Delivery Fee (Rs.)</label>
                    <input type="number" defaultValue="49" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Update Settings</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-4 py-2 flex space-x-2 z-50">
          <button onClick={() => setAdminView('dashboard')} className={`px-4 py-2 rounded-full font-bold transition ${adminView === 'dashboard' ? 'bg-purple-500 text-white' : 'hover:bg-gray-100'}`}>Dashboard</button>
          <button onClick={() => setAdminView('orders')} className={`px-4 py-2 rounded-full font-bold transition ${adminView === 'orders' ? 'bg-purple-500 text-white' : 'hover:bg-gray-100'}`}>Orders</button>
          <button onClick={() => setAdminView('products')} className={`px-4 py-2 rounded-full font-bold transition ${adminView === 'products' ? 'bg-purple-500 text-white' : 'hover:bg-gray-100'}`}>Products</button>
          <button onClick={() => setAdminView('settings')} className={`px-4 py-2 rounded-full font-bold transition ${adminView === 'settings' ? 'bg-purple-500 text-white' : 'hover:bg-gray-100'}`}>Settings</button>
        </div>

        {showProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Product Name *</label>
                    <input type="text" required value={productForm.name} onChange={(e) => handleProductFormChange('name', e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Premium Organic Rice" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Category *</label>
                    <select value={productForm.category} onChange={(e) => handleProductFormChange('category', e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Price *</label>
                    <input type="number" required step="0.01" value={productForm.price} onChange={(e) => handleProductFormChange('price', e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="79" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Unit *</label>
                    <select value={productForm.unit} onChange={(e) => handleProductFormChange('unit', e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="kg">kg</option>
                      <option value="liter">liter</option>
                      <option value="piece">piece</option>
                      <option value="packet">packet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Product Image (Emoji) *</label>
                  <div className="flex items-center space-x-3">
                    <input type="text" required value={productForm.image} onChange={(e) => handleProductFormChange('image', e.target.value)} className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="🍚" maxLength="2" />
                    <div className="text-4xl">{productForm.image}</div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Copy emoji from emojipedia.org</p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Description *</label>
                  <textarea required value={productForm.description} onChange={(e) => handleProductFormChange('description', e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Pure organic rice from local farms" rows="3" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Available Weights (comma-separated) *</label>
                  <input type="text" required value={productForm.weights} onChange={(e) => handleProductFormChange('weights', e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="2kg, 5kg, 10kg, 25kg" />
                  <p className="text-xs text-gray-600 mt-1">Separate with commas</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Rating (1-5)</label>
                    <input type="number" step="0.1" min="1" max="5" value={productForm.rating} onChange={(e) => handleProductFormChange('rating', e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Number of Reviews</label>
                    <input type="number" value={productForm.reviews} onChange={(e) => handleProductFormChange('reviews', parseInt(e.target.value) || 0)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={productForm.inStock} onChange={(e) => handleProductFormChange('inStock', e.target.checked)} className="w-4 h-4" />
                  <label className="text-sm font-bold">In Stock</label>
                </div>

                <div className="flex space-x-4">
                  <button type="button" onClick={() => { setShowProductModal(false); setEditingProduct(null); resetProductForm(); }} className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 font-bold">Cancel</button>
                  <button type="submit" className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-bold">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
const AuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">{authMode === 'login' ? 'Login' : 'Sign Up'}</h3>
        <form onSubmit={handleAuth} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-sm font-bold mb-1">Full Name *</label>
              <input type="text" required value={authForm.name} onChange={(e) => handleAuthInputChange('name', e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Vishal Sharma" />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold mb-1">Phone Number (10 digits) *</label>
            <input type="text" required value={authForm.phone} onChange={(e) => handleAuthInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="9xxxxxxxxx" maxLength="10" />
            {authForm.phone && authForm.phone !== 'admin' && authForm.phone.length !== 10 && (
              <p className="text-xs text-red-500 mt-1">Please enter exactly 10 digits</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Password *</label>
            <input type="password" required value={authForm.password} onChange={(e) => handleAuthInputChange('password', e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>
          
          <div className="bg-blue-50 p-3 rounded text-sm">
            <p className="font-bold mb-1">Admin Login:</p>
            <p>Phone: <code className="bg-white px-2 py-1 rounded">admin</code></p>
            <p>Password: <code className="bg-white px-2 py-1 rounded">admin123</code></p>
          </div>

          <div className="flex space-x-4">
            <button type="button" onClick={() => { setShowAuthModal(false); setAuthForm({ phone: '', password: '', name: '' }); }} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">{authMode === 'login' ? 'Login' : 'Sign Up'}</button>
          </div>
          
          <div className="text-center text-sm">
            {authMode === 'login' ? (
              <span>Don't have an account? <button type="button" onClick={() => setAuthMode('signup')} className="text-blue-500 hover:underline font-bold">Sign Up</button></span>
            ) : (
              <span>Already have an account? <button type="button" onClick={() => setAuthMode('login')} className="text-blue-500 hover:underline font-bold">Login</button></span>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <span className="text-3xl">{brandLogo}</span>
              <span>Saamaan</span>
            </h4>
            <p className="text-gray-400 text-sm">Making daily grocery shopping fast, affordable, and stress-free for every household in Butwal.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button onClick={() => setCurrentPage('home')} className="block text-gray-400 hover:text-white transition">Home</button>
              <button onClick={() => setCurrentPage('products')} className="block text-gray-400 hover:text-white transition">Products</button>
              <button onClick={() => setCurrentPage('cart')} className="block text-gray-400 hover:text-white transition">Cart</button>
              {user && <button onClick={() => setCurrentPage(isAdmin ? 'admin' : 'dashboard')} className="block text-gray-400 hover:text-white transition">Dashboard</button>}
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
              <a href="https://wa.me/9779821072912" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded mt-3 hover:bg-green-600">
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
  
