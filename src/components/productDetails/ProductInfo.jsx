import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ProductInfo = ({
  product,
  category,
  quantity,
  setQuantity,
  handleBuyNow,
}) => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="lg:w-1/3">
      <div className="sticky top-8">
        <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-2">
          {product.name}
        </h1>

        {category && (
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-6">
            {category.name}
          </p>
        )}

        <div className="mb-8">
          <span className="text-2xl font-light text-gray-800">
            ₹ {product.price?.toLocaleString()}
          </span>
        </div>

        <div className="mb-8">
          <div className="text-sm text-gray-500 uppercase tracking-wide mb-3">
            QUANTITY
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-10 border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-50"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className={`w-full py-4 px-6 text-sm uppercase tracking-wide mb-8 transition-colors ${
            product.stock > 0
              ? "bg-black text-white hover:bg-gray-800"
              : "border border-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          {product.stock > 0 ? "Buy Now" : "Out of Stock"}
        </button>

        <div className="space-y-4">
          <div className="border-t border-gray-200">
            <button
              onClick={() => toggleAccordion("details")}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-sm text-gray-500 uppercase tracking-wide">
                PRODUCT DETAILS
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  openAccordion === "details" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordion === "details" && (
              <div className="pb-4">
                <p className="text-sm text-gray-700 mb-4">
                  {product.description}
                </p>
                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Features:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200">
            <button
              onClick={() => toggleAccordion("shipping")}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-sm text-gray-500 uppercase tracking-wide">
                SHIPPING & RETURNS
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  openAccordion === "shipping" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordion === "shipping" && (
              <div className="pb-4 text-sm text-gray-700">
                <p className="mb-2">Free shipping on orders over ₹1,000</p>
                <p className="mb-2">Standard delivery: 3-5 business days</p>
                <div class="text-sm text-gray-600 mt-4">
                  <p>
                    Easy returns within <strong>30 days of purchase</strong> if
                    the product is damaged.
                  </p>
                  <p class="mt-2">
                    <strong>Return Policy:</strong> The item must be unused, in
                    its original packaging, and returned with proof of purchase.
                    Customized or personalized items are non-returnable unless
                    defective.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200">
            <button
              onClick={() => toggleAccordion("contact")}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-sm text-gray-500 uppercase tracking-wide">
                CONTACT US
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  openAccordion === "contact" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordion === "contact" && (
              <div className="pb-4 text-sm text-gray-700">
                <p className="mb-2">Email: chincraft.hm@gmail.com</p>
                <p className="mb-2">Phone: +91 88487 45252</p>
                <p>Live chat available 9 AM - 6 PM IST</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
