import { ChevronDown } from 'lucide-react';

const ProductImageGallery = ({ product, selectedImageIndex, setSelectedImageIndex }) => {
  return (
    <div className="lg:w-2/3">
      <div className="flex flex-col md:flex-row gap-4">
        {product.images && product.images.length > 1 && (
          <div className="flex md:flex-col gap-2 order-2 md:order-1">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`w-16 h-20 md:w-20 md:h-24 cursor-pointer border-2 ${
                  selectedImageIndex === index
                    ? "border-black"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image.url}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 order-1 md:order-2">
          <div className="aspect-[3/4] bg-gray-100">
            <img
              src={
                product.images?.[selectedImageIndex]?.url ||
                "/api/placeholder/400/600"
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;