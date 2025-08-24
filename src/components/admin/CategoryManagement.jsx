import { useState, useEffect } from "react";
import { categoryService } from "../../api/firebase/firebaseService";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Tags,
  Activity,
  Calendar,
} from "lucide-react";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (loadMore = false) => {
    try {
      setLoading(!loadMore);
      const result = await categoryService.getCategories(
        20,
        loadMore ? lastDoc : null
      );

      if (loadMore) {
        setCategories((prev) => [...prev, ...result.categories]);
      } else {
        setCategories(result.categories);
      }

      setLastDoc(result.lastDoc);
      setHasMore(result.categories.length === 20);
    } catch (err) {
      setError("Failed to fetch categories: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        setSuccess("Category updated successfully!");
      } else {
        await categoryService.addCategory(formData);
        setSuccess("Category added successfully!");
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      setError("Failed to save category: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name || "",
      description: category.description || "",
      isActive: category.isActive !== false,
    });
    setEditingCategory(category);
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      setSuccess("Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      setError("Failed to delete category: " + err.message);
    }
  };

  const toggleCategoryStatus = async (categoryId, currentStatus) => {
    try {
      await categoryService.updateCategory(categoryId, {
        isActive: !currentStatus,
      });
      setSuccess(
        `Category ${currentStatus ? "deactivated" : "activated"} successfully!`
      );
      fetchCategories();
    } catch (err) {
      setError("Failed to toggle category status: " + err.message);
    }
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

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2 text-slate-600">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="font-medium">Loading categories...</span>
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
              <Tags className="w-8 h-8 mr-3 text-indigo-600" />
              Category Management
            </h2>
            <p className="text-slate-600 mt-2">
              Organize your products with categories
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
            {showAddForm ? "Cancel" : "Add Category"}
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
              {editingCategory ? (
                <Edit2 className="w-6 h-6 mr-2 text-indigo-600" />
              ) : (
                <Plus className="w-6 h-6 mr-2 text-indigo-600" />
              )}
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>

            <div onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center h-12">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          formData.isActive ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            formData.isActive
                              ? "translate-x-6"
                              : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-slate-700">
                        {formData.isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter category description (optional)"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {editingCategory ? "Update Category" : "Add Category"}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-3 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Tags className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                No categories found
              </h3>
              <p className="text-slate-500">
                Click "Add Category" to create your first category
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="hover:bg-slate-50 transition-colors duration-150"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="bg-indigo-100 rounded-xl p-2 mr-3">
                              <Tags className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="font-semibold text-slate-900">
                              {category.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm text-slate-600 max-w-xs">
                            {category.description ? (
                              category.description.length > 100 ? (
                                `${category.description.substring(0, 100)}...`
                              ) : (
                                category.description
                              )
                            ) : (
                              <span className="italic text-slate-400">
                                No description
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                              category.isActive !== false
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {category.isActive !== false ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            {category.createdAt
                              ? new Date(
                                  category.createdAt.seconds * 1000
                                ).toLocaleDateString()
                              : "Unknown"}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                              title="Edit category"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                toggleCategoryStatus(
                                  category.id,
                                  category.isActive !== false
                                )
                              }
                              className={`p-2 rounded-lg transition-colors duration-150 ${
                                category.isActive !== false
                                  ? "text-orange-600 hover:bg-orange-50"
                                  : "text-emerald-600 hover:bg-emerald-50"
                              }`}
                              title={
                                category.isActive !== false
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            >
                              {category.isActive !== false ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {hasMore && (
                <div className="px-8 py-6 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => fetchCategories(true)}
                    disabled={loading}
                    className="bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-3">
                <Tags className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">
              Total Categories
            </h3>
            <p className="text-3xl font-bold text-slate-900">
              {categories.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-3">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">
              Active Categories
            </h3>
            <p className="text-3xl font-bold text-slate-900">
              {categories.filter((cat) => cat.isActive !== false).length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-3">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">
              Inactive Categories
            </h3>
            <p className="text-3xl font-bold text-slate-900">
              {categories.filter((cat) => cat.isActive === false).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
