import { useEffect, useState } from "react";
import {
  categoryService,
  productService,
} from "../api/firebase/firebaseService";
import { useParams, Link } from "react-router-dom";
import { X, Home, User, Phone, MapPin } from "lucide-react";
import ProductImageGallery from "../components/productDetails/ProductImageGallery";
import ProductInfo from "../components/productDetails/ProductInfo";
import RecommendedProducts from "../components/productDetails/RecommendedProducts";
import Footer from "../components/footer/Footer";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [addressData, setAddressData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });
  const [addressErrors, setAddressErrors] = useState({});

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!productId) {
          setError("Invalid product ID");
          setLoading(false);
          return;
        }

        // Fetch all products with a larger limit to ensure we get the product
        const productData = await productService.getProducts(1000); // Increased limit

        if (
          !productData ||
          !productData.products ||
          !Array.isArray(productData.products)
        ) {
          setError("Failed to load product data");
          setLoading(false);
          return;
        }

        const currentProduct = productData.products.find(
          (p) => p.id === productId
        );

        if (!currentProduct) {
          setError("Product not found");
          setLoading(false);
          return;
        }
        setProduct(currentProduct);

        // Fetch categories
        try {
          const categoryData = await categoryService.getCategories(100); // Increased limit

          if (
            categoryData &&
            categoryData.categories &&
            Array.isArray(categoryData.categories)
          ) {
            const productCategory = categoryData.categories.find(
              (c) => c.id === currentProduct.category
            );
            setCategory(productCategory);

            // Fetch recommended products from the same category
            const sameCategoryProducts = productData.products
              .filter(
                (p) =>
                  p.category === currentProduct.category &&
                  p.id !== currentProduct.id &&
                  p.listed === true
              )
              .slice(0, 4);

            setRecommendedProducts(sameCategoryProducts);
          }
        } catch (categoryError) {
          console.error("category error", categoryError);
        }
      } catch (error) {
        setError(
          `An error occurred while loading the product: ${error.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    } else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [productId]);

  const handleBuyNow = () => {
    setShowBuyModal(true);
  };

  const handleAddressChange = (field, value) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (addressErrors[field]) {
      setAddressErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateAddress = () => {
    const errors = {};

    if (!addressData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!addressData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(addressData.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!addressData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!addressData.city.trim()) {
      errors.city = "City is required";
    }

    if (!addressData.state.trim()) {
      errors.state = "State is required";
    }

    if (!addressData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(addressData.pincode)) {
      errors.pincode = "Please enter a valid 6-digit pincode";
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = () => {
    if (!validateAddress()) {
      return;
    }

    const sanitize = (str) => (str ? String(str).replace(/[\n\r]/g, " ") : "");

    const message = `*New Order Request*

*Product Details:*
• Product: ${sanitize(product.name)}
• Product ID: ${sanitize(product.id)}
• Category: ${sanitize(category?.name || "N/A")}
• Quantity: ${quantity}

*Delivery Address:*
• Name: ${sanitize(addressData.fullName)}
• Phone: ${sanitize(addressData.phone)}
• Address: ${sanitize(addressData.address)}
• City: ${sanitize(addressData.city)}
• State: ${sanitize(addressData.state)}
• Pincode: ${sanitize(addressData.pincode)}${
      addressData.landmark
        ? `\n• Landmark: ${sanitize(addressData.landmark)}`
        : ""
    }

Please confirm the order and let me know the pricing and delivery timeline. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "9207928793";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    setShowBuyModal(false);
    setAddressData({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    });
  };

  const closeBuyModal = () => {
    setShowBuyModal(false);
    setAddressErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm font-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">
            {error || "Product not found"}
          </p>
          <Link
            to="/products"
            className="mt-4 inline-block text-sm text-black underline hover:text-gray-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 mb-lg:px-16 py-4">
        <div className="text-sm text-gray-500 uppercase tracking-wide">
          <Link to="/products" className="hover:text-gray-700">
            SHOP
          </Link>{" "}
          / {category?.name?.toUpperCase() || "PRODUCTS"}
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-16 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <ProductImageGallery
            product={product}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
          />

          <ProductInfo
            product={product}
            category={category}
            quantity={quantity}
            setQuantity={setQuantity}
            handleBuyNow={handleBuyNow}
          />
        </div>

        <RecommendedProducts recommendedProducts={recommendedProducts} />
      </div>

      {showBuyModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Complete Your Order
                </h2>
                <button
                  onClick={closeBuyModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-gray-800 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    *Pricing will be confirmed via WhatsApp
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-800 mb-3">
                  <Home className="w-4 h-4 inline mr-2" />
                  Delivery Address
                </h3>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={addressData.fullName}
                    onChange={(e) =>
                      handleAddressChange("fullName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md text-sm ${
                      addressErrors.fullName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {addressErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {addressErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={addressData.phone}
                    onChange={(e) =>
                      handleAddressChange("phone", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md text-sm ${
                      addressErrors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {addressErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {addressErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Full Address *
                  </label>
                  <textarea
                    value={addressData.address}
                    onChange={(e) =>
                      handleAddressChange("address", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md text-sm ${
                      addressErrors.address
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    rows="3"
                    placeholder="House no, Street, Area"
                  />
                  {addressErrors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {addressErrors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={addressData.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md text-sm ${
                        addressErrors.city
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="City"
                    />
                    {addressErrors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={addressData.state}
                      onChange={(e) =>
                        handleAddressChange("state", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md text-sm ${
                        addressErrors.state
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="State"
                    />
                    {addressErrors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.state}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={addressData.pincode}
                      onChange={(e) =>
                        handleAddressChange("pincode", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md text-sm ${
                        addressErrors.pincode
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="6-digit pincode"
                    />
                    {addressErrors.pincode && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.pincode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      value={addressData.landmark}
                      onChange={(e) =>
                        handleAddressChange("landmark", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeBuyModal}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    className="flex-1 py-3 px-4 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <span>Continue to WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetails;
