import { Link } from 'react-router-dom';

const RecommendedProducts = ({ recommendedProducts }) => {
  return (
    <>
      {recommendedProducts.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h2 className="text-xl md:text-2xl font-light text-gray-800 mb-8">
            Recommended for You
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recommendedProducts.map((item) => (
              <Link to={`/products/${item.id}`} key={item.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-100 mb-3">
                  <img
                    src={item.images?.[0]?.url || "/api/placeholder/300/400"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                  />
                </div>
                <h3 className="text-sm font-light text-gray-800 mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-700">
                  ₹ {item.price?.toLocaleString()}
                </p>
                {item.stock <= 5 && item.stock > 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    Only {item.stock} left
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendedProducts;