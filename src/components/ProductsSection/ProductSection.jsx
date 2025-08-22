import React, { useState } from 'react';

const ProductSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Ceramic Vase',
      price: '$89',
      category: 'ceramics',
      image: '/api/placeholder/400/500'
    },
    {
      id: 2,
      name: 'Woven Basket',
      price: '$45',
      category: 'textiles',
      image: '/api/placeholder/400/500'
    },
    {
      id: 3,
      name: 'Wooden Bowl',
      price: '$65',
      category: 'woodwork',
      image: '/api/placeholder/400/500'
    },
    {
      id: 4,
      name: 'Clay Mug Set',
      price: '$38',
      category: 'ceramics',
      image: '/api/placeholder/400/500'
    },
    {
      id: 5,
      name: 'Macrame Wall Hanging',
      price: '$72',
      category: 'textiles',
      image: '/api/placeholder/400/500'
    },
    {
      id: 6,
      name: 'Cutting Board',
      price: '$55',
      category: 'woodwork',
      image: '/api/placeholder/400/500'
    },
    {
      id: 7,
      name: 'Ceramic Plate Set',
      price: '$120',
      category: 'ceramics',
      image: '/api/placeholder/400/500'
    },
    {
      id: 8,
      name: 'Knitted Throw',
      price: '$95',
      category: 'textiles',
      image: '/api/placeholder/400/500'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'ceramics', name: 'Ceramics' },
    { id: 'textiles', name: 'Textiles' },
    { id: 'woodwork', name: 'Woodwork' }
  ];

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-light tracking-wide text-gray-900 mb-4">
          Handcrafted Collection
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Each piece is carefully crafted by skilled artisans using traditional techniques 
          and sustainable materials
        </p>
      </div>

      {/* Filter Navigation */}
      <div className="flex justify-center mb-16">
        <nav className="flex gap-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`text-sm font-medium tracking-wide transition-colors ${
                activeFilter === category.id
                  ? 'text-black border-b-2 border-black pb-2'
                  : 'text-gray-500 pb-2'
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            
            {/* Product Image */}
            <div className="aspect-[4/5] mb-6 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-light text-gray-900 tracking-wide">
                {product.name}
              </h3>
              <p className="text-base font-medium text-gray-900">
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-20">
        <button className="px-12 py-4 border-2 border-black text-black text-sm font-medium tracking-widest">
          VIEW ALL PRODUCTS
        </button>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24 pt-16 border-t border-gray-200">
        
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-900 mb-3 tracking-wide">
            HANDMADE
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every piece is individually crafted by skilled artisans using traditional methods
          </p>
        </div>
        
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-900 mb-3 tracking-wide">
            SUSTAINABLE
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Made with eco-friendly materials and processes that respect our environment
          </p>
        </div>
        
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-900 mb-3 tracking-wide">
            UNIQUE
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Natural variations make each item one-of-a-kind with its own character
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default ProductSection;