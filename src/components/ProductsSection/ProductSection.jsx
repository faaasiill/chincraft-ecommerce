import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { productService, categoryService } from '../../api/firebase/firebaseService';

const ProductSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Categories' }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const { products: fetchedProducts } = await productService.getProducts(100); // Fetch 100 items
      const mappedProducts = fetchedProducts
        .filter(p => p.listed) 
        .map(p => ({
          id: p.id,
          name: p.name,
          category: p.category, 
          price: p.price,
          available: p.stock > 0,
          image: p.images?.[0]?.url || '', // first image URL
        }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      const { categories: fetchedCategories } = await categoryService.getCategories(50);
      const mappedCategories = fetchedCategories.map(c => ({ id: c.id, name: c.name }));
      setCategories([{ id: 'all', name: 'All Categories' }, ...mappedCategories]);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  // Navigate to product details
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter & Sort
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === 'under-1000' && product.price < 1000) ||
        (priceRange === '1000-2000' && product.price >= 1000 && product.price <= 2000) ||
        (priceRange === 'over-2000' && product.price > 2000);
      return matchesSearch && matchesCategory && matchesPrice;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'availability': return b.available - a.available;
        default: return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/3 transform w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-1 rounded-full focus:outline-none focus:border-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 font-light tracking-tight md:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border rounded-full focus:outline-none focus:border-gray-500"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full p-3 border rounded-full focus:outline-none focus:border-gray-500"
            >
              <option value="all">All Prices</option>
              <option value="under-1000">Under ₹1,000</option>
              <option value="1000-2000">₹1,000 - ₹2,000</option>
              <option value="over-2000">Over ₹2,000</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 border rounded-full focus:outline-none focus:border-gray-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="availability">Availability</option>
            </select>
          </div>

          {/* Count */}
          <div className="flex items-center text-gray-600">
            <span className="text-sm">
              <strong className='font-bold text-m'>{filteredAndSortedProducts.length}</strong> products found
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-[40px]">
        {filteredAndSortedProducts.map(product => (
          <div 
            key={product.id} 
            className="flex flex-col bg-[#fff] rounded-b-md h-full cursor-pointer group transition-transform duration-200 hover:scale-[1.02]"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200" 
              />
            </div>
            <div className="p-1 flex flex-col tracking-tight flex-grow">
              <div className="flex justify-between items-center p-2 mb-3">
                <div>
                  <h3 className="font-normal text-gray-900 group-hover:text-gray-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm font-light text-gray-500">
                    {categories.find(c => c.id === product.category)?.name || ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-light text-gray-500">Starts At</span>
                  <span className="block text-sm font-medium text-gray-900">₹{product.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setPriceRange('all');
              setSortBy('name');
            }}
            className="mt-4 px-6 py-2 bg-gray-900 text-white text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSection;