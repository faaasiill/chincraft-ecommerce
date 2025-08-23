import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  productService,
  userService,
  categoryService,
} from "../api/firebase/firebaseService";
import ProductManagement from "../components/admin/ProductManagement";
import CategoryManagement from "../components/admin/CategoryManagement";
import UserManagement from "../components/admin/UserManagement";

const AdminDashboard = () => {
  const { user, role, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 0,
    activeProducts: 0,
    blockedUsers: 0,
    activeCategories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (role === "admin") {
      fetchDashboardStats();
    }
  }, [role]);

const fetchDashboardStats = async () => {
  try {
    setLoading(true);
    console.log('Fetching products...');
    const productsResult = await productService.getProducts(10);
    console.log('Products:', productsResult);

    console.log('Fetching users...');
    const usersResult = await userService.getUsers(10);
    console.log('Users:', usersResult);

    console.log('Fetching categories...');
    const categoriesResult = await categoryService.getCategories(10);
    console.log('Categories:', categoriesResult);

    const products = productsResult.products || [];
    const users = usersResult.users || [];
    const categories = categoriesResult.categories || [];

    setStats({
      totalProducts: products.length,
      totalUsers: users.length,
      totalCategories: categories.length,
      activeProducts: products.filter(p => p.listed === true).length,
      blockedUsers: users.filter(u => u.blocked === true).length,
      activeCategories: categories.filter(c => c.isActive !== false).length
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    setError(`Failed to load dashboard statistics: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  // Redirect if not admin
  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "products", label: "Products", icon: "📦" },
    { id: "categories", label: "Categories", icon: "🏷️" },
    { id: "users", label: "Users", icon: "👥" },
  ];

  const StatCard = ({ title, value, icon, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
      indigo: "bg-indigo-500",
    };

    return (
      <div className="bg-white overflow-hidden shadow-lg rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div
                className={`w-8 h-8 ${colorClasses[color]} rounded-md flex items-center justify-center text-white text-lg`}
              >
                {icon}
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {title}
                </dt>
                <dd className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : value}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src={
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${user?.email}&background=3B82F6&color=ffffff`
                  }
                  alt={user?.displayName || user?.email}
                />
                <span className="text-sm font-medium text-gray-700">
                  {user?.displayName || user?.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span className="mr-3 text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {error && (
            <div className="m-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Dashboard Overview
                </h2>
                <p className="text-gray-600">
                  Welcome back! Here's what's happening with your store.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                  title="Total Products"
                  value={stats.totalProducts}
                  icon="📦"
                  color="blue"
                />
                <StatCard
                  title="Active Products"
                  value={stats.activeProducts}
                  icon="✅"
                  color="green"
                />
                <StatCard
                  title="Total Categories"
                  value={stats.totalCategories}
                  icon="🏷️"
                  color="purple"
                />
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon="👥"
                  color="indigo"
                />
                <StatCard
                  title="Active Categories"
                  value={stats.activeCategories}
                  icon="🟢"
                  color="green"
                />
                <StatCard
                  title="Blocked Users"
                  value={stats.blockedUsers}
                  icon="🚫"
                  color="red"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("products")}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">➕</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            Add New Product
                          </div>
                          <div className="text-sm text-gray-500">
                            Create a new product listing
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("categories")}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">🏷️</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            Manage Categories
                          </div>
                          <div className="text-sm text-gray-500">
                            Add or edit product categories
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">👥</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            View Users
                          </div>
                          <div className="text-sm text-gray-500">
                            Manage user accounts and permissions
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    System Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Product Listings</span>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-900">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">User Registration</span>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-900">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Image Upload</span>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-900">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Database</span>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-900">Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-8 bg-white rounded-lg shadow-md border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Recent Activity
                  </h3>
                </div>
                <div className="p-6">
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">📊</div>
                    <p>Activity tracking will be displayed here</p>
                    <p className="text-sm mt-1">Feature coming soon...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && <ProductManagement />}
          {activeTab === "categories" && <CategoryManagement />}
          {activeTab === "users" && <UserManagement />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
