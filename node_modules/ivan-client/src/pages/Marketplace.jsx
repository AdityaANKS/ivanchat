import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Search, Filter, Star, TrendingUp,
  Package, Crown, Sparkles, Gift, Coins
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Marketplace = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userCoins, setUserCoins] = useState(0);

  const categories = [
    { id: 'all', label: 'All Items', icon: Package },
    { id: 'themes', label: 'Themes', icon: Sparkles },
    { id: 'badges', label: 'Badges', icon: Star },
    { id: 'emotes', label: 'Emotes', icon: Gift },
    { id: 'effects', label: 'Effects', icon: Sparkles },
    { id: 'premium', label: 'Premium', icon: Crown },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ];

  useEffect(() => {
    fetchMarketplaceItems();
    fetchUserCoins();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [searchTerm, selectedCategory, sortBy, items]);

  const fetchMarketplaceItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/marketplace/items');
      setItems(response.data.items);
    } catch (error) {
      console.error('Failed to fetch marketplace items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCoins = async () => {
    try {
      const response = await api.get('/users/coins');
      setUserCoins(response.data.coins);
    } catch (error) {
      console.error('Failed to fetch user coins:', error);
    }
  };

  const filterAndSortItems = () => {
    let filtered = [...items];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.purchases - a.purchases);
    }

    setFilteredItems(filtered);
  };

  const handlePurchase = async (itemId) => {
    try {
      await api.post(`/marketplace/purchase/${itemId}`);
      fetchUserCoins();
      setShowPurchaseModal(false);
      // Show success notification
    } catch (error) {
      console.error('Failed to purchase item:', error);
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
                <p className="text-gray-200">
                  Customize your experience with themes, badges, and more!
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-black bg-opacity-30 rounded-lg px-4 py-2 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">{userCoins.toLocaleString()}</span>
                </div>
                <Button
                  variant="secondary"
                  icon={ShoppingCart}
                  onClick={() => setShowCartModal(true)}
                >
                  Cart ({cart.length})
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search marketplace..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <MarketplaceItem
                  key={item.id}
                  item={item}
                  onPurchase={() => {
                    setSelectedItem(item);
                    setShowPurchaseModal(true);
                  }}
                  onAddToCart={() => addToCart(item)}
                  inCart={cart.some(i => i.id === item.id)}
                  owned={item.owned}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No items found</p>
            </div>
          )}
        </div>

        {/* Cart Modal */}
        <Modal
          isOpen={showCartModal}
          onClose={() => setShowCartModal(false)}
          title="Shopping Cart"
          size="large"
        >
          {cart.length > 0 ? (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.preview || '/placeholder.png'}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">{item.price}</span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Total:</span>
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-white text-xl font-semibold">
                      {getTotalPrice().toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  fullWidth
                  disabled={getTotalPrice() > userCoins}
                >
                  {getTotalPrice() > userCoins ? 'Insufficient Coins' : 'Purchase All'}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Your cart is empty</p>
            </div>
          )}
        </Modal>

        {/* Purchase Modal */}
        {showPurchaseModal && selectedItem && (
          <Modal
            isOpen={showPurchaseModal}
            onClose={() => setShowPurchaseModal(false)}
            title="Confirm Purchase"
          >
            <div className="text-center">
              <img
                src={selectedItem.preview || '/placeholder.png'}
                alt={selectedItem.name}
                className="w-32 h-32 mx-auto rounded-lg object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-2">
                {selectedItem.name}
              </h3>
              <p className="text-gray-400 mb-4">{selectedItem.description}</p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-white text-xl">
                  {selectedItem.price.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => handlePurchase(selectedItem.id)}
                  fullWidth
                  disabled={selectedItem.price > userCoins}
                >
                  {selectedItem.price > userCoins ? 'Insufficient Coins' : 'Purchase'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowPurchaseModal(false)}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

// MarketplaceItem Component
const MarketplaceItem = ({ item, onPurchase, onAddToCart, inCart, owned }) => {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className={`relative h-48 bg-gradient-to-br ${getRarityColor(item.rarity)}`}>
        {item.preview && (
          <img
            src={item.preview}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
        {item.isNew && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
            NEW
          </div>
        )}
        {item.discount && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
            -{item.discount}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold mb-1">{item.name}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-semibold">{item.price}</span>
            {item.originalPrice && (
              <span className="text-gray-500 line-through text-sm ml-1">
                {item.originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <TrendingUp className="w-3 h-3" />
            {item.purchases}
          </div>
        </div>

        {owned ? (
          <Button variant="secondary" fullWidth disabled>
            Owned
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={onPurchase}
              className="flex-1"
            >
              Buy Now
            </Button>
            <Button
              variant="secondary"
              onClick={onAddToCart}
              disabled={inCart}
            >
              {inCart ? '✓' : '+'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;