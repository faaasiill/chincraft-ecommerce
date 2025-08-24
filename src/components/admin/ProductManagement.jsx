import { useState, useEffect } from "react";
import {
  productService,
  categoryService,
} from "../../api/firebase/firebaseService";
import { cloudinaryService } from "../../utils/cloudinaryService";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  CheckCircle,
  XCircle,
  DollarSign,
  Loader2,
} from "lucide-react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    stock: "",
    features: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (loadMore = false) => {
    try {
      setLoading(!loadMore);
      const result = await productService.getProducts(
        10,
        loadMore ? lastDoc : null
      );

      if (loadMore) {
        setProducts((prev) => [...prev, ...result.products]);
      } else {
        setProducts(result.products);
      }

      setLastDoc(result.lastDoc);
      setHasMore(result.products.length === 10);
    } catch (err) {
      setError("Failed to fetch products: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await categoryService.getCategories(50);
      setCategories(result.categories);
    } catch (err) {
      setError("Failed to fetch categories: " + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setImageFiles(files);
  };

  const uploadImages = async (files) => {
    const uploadPromises = files.map((file) =>
      cloudinaryService.uploadImage(file, "products")
    );
    return await Promise.all(uploadPromises);
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const handleFeatureChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setImageUploading(true);
    setError(null);

    try {
      let imageUrls = [...formData.images];

      if (imageFiles.length > 0) {
        const uploadedImages = await uploadImages(imageFiles);
        imageUrls = [...imageUrls, ...uploadedImages];
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: imageUrls,
        features: formData.features.filter((feature) => feature.trim() !== ""),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        setSuccess("Product updated successfully!");
      } else {
        await productService.addProduct(productData);
        setSuccess("Product added successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError("Failed to save product: " + err.message);
    } finally {
      setImageUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      images: [],
      stock: "",
      features: [],
    });
    setImageFiles([]);
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      category: product.category || "",
      images: product.images || [],
      stock: product.stock?.toString() || "",
      features: product.features || [],
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await productService.deleteProduct(productId);
      setSuccess("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product: " + err.message);
    }
  };

  const toggleListing = async (productId, currentStatus) => {
    try {
      await productService.toggleProductListing(productId, currentStatus);
      setSuccess(
        `Product ${currentStatus ? "unlisted" : "listed"} successfully!`
      );
      fetchProducts();
    } catch (err) {
      setError("Failed to toggle product listing: " + err.message);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2 text-slate-600">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="font-medium">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-indigo-600" />
              Product Management
            </h2>
            <p className="text-slate-600 mt-2">
              Manage your store's product catalog
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              showAddForm
                ? "bg-slate-200 hover:bg-slate-300 text-slate-700"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <Plus className="w-5 h-5 mr-2" />
            {showAddForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6 flex items-center shadow-sm">
            <XCircle className="w-5 h-5 mr-3 text-red-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl mb-6 flex items-center shadow-sm">
            <CheckCircle className="w-5 h-5 mr-3 text-emerald-600" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <h3 className="text-xl font-semibold mb-6 text-slate-900 flex items-center">
              {editingProduct ? (
                <Edit2 className="w-6 h-6 mr-2 text-indigo-600" />
              ) : (
                <Plus className="w-6 h-6 mr-2 text-indigo-600" />
              )}
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price ($) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter stock quantity"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Images (Max 5)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-indigo-400 transition-colors duration-200">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <label className="cursor-pointer">
                      <span className="text-indigo-600 font-medium hover:text-indigo-700">
                        Click to upload images
                      </span>
                      <span className="text-slate-500"> or drag and drop</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-slate-500 mt-2">
                      PNG, JPG up to 10MB each
                    </p>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-700 mb-3">
                      Current Images:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={cloudinaryService.getOptimizedUrl(image.url, {
                              width: 200,
                              height: 200,
                            })}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Features
                </label>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter feature"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={imageUploading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                >
                  {imageUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : editingProduct ? (
                    "Update Product"
                  ) : (
                    "Add Product"
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-3 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {products.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                No products found
              </h3>
              <p className="text-slate-500">
                Click "Add Product" to create your first product
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-slate-50 transition-colors duration-200"
                      >
                        <td className="px-8 py-4">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={cloudinaryService.getOptimizedUrl(
                                product.images[0].url,
                                { width: 60, height: 60 }
                              )}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded border border-slate-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-500 text-xs">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-4">
                          <div className="font-medium text-slate-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {product.description?.substring(0, 50)}...
                          </div>
                        </td>
                        <td className="px-8 py-4 text-sm text-slate-700">
                          {categories.find((cat) => cat.id === product.category)
                            ?.name || "Unknown"}
                        </td>
                        <td className="px-8 py-4 text-sm text-slate-700">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-8 py-4 text-sm text-slate-700">
                          {product.stock}
                        </td>
                        <td className="px-8 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              product.listed
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.listed ? "Listed" : "Unlisted"}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-sm space-x-4">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              toggleListing(product.id, product.listed)
                            }
                            className={`${
                              product.listed
                                ? "text-red-600 hover:text-red-800"
                                : "text-emerald-600 hover:text-emerald-800"
                            } transition-colors duration-200`}
                            title={product.listed ? "Unlist" : "List"}
                          >
                            {product.listed ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {hasMore && (
                <div className="px-8 py-4 border-t border-slate-200 flex justify-center">
                  <button
                    onClick={() => fetchProducts(true)}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
