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
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  Plus,
  Activity,
  Database,
  Upload,
  UserCheck,
  Shield,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  ShoppingBag,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  UserMinus,
  RefreshCw,
} from "lucide-react";

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
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  useEffect(() => {
    if (role === "admin") {
      fetchDashboardStats();
      fetchRecentActivities();

      // Set up interval to refresh activities every 30 seconds
      const interval = setInterval(fetchRecentActivities, 30000);
      return () => clearInterval(interval);
    }
  }, [role]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      console.log("Fetching products...");
      const productsResult = await productService.getProducts(10);
      console.log("Products:", productsResult);

      console.log("Fetching users...");
      const usersResult = await userService.getUsers(10);
      console.log("Users:", usersResult);

      console.log("Fetching categories...");
      const categoriesResult = await categoryService.getCategories(10);
      console.log("Categories:", categoriesResult);

      const products = productsResult.products || [];
      const users = usersResult.users || [];
      const categories = categoriesResult.categories || [];

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        totalCategories: categories.length,
        activeProducts: products.filter((p) => p.listed === true).length,
        blockedUsers: users.filter((u) => u.blocked === true).length,
        activeCategories: categories.filter((c) => c.isActive !== false).length,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(`Failed to load dashboard statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      setActivitiesLoading(true);

      // Simulate fetching recent activities from multiple sources
      const activities = [];

      // Get recent products
      const recentProductsResult = await productService.getProducts(5);
      const recentProducts = recentProductsResult.products || [];

      // Get recent users
      const recentUsersResult = await userService.getUsers(5);
      const recentUsers = recentUsersResult.users || [];

      // Get recent categories
      const recentCategoriesResult = await categoryService.getCategories(5);
      const recentCategories = recentCategoriesResult.categories || [];

      // Process recent products
      recentProducts.forEach((product) => {
        if (product.createdAt) {
          activities.push({
            id: `product-${product.id}`,
            type: "product_created",
            title: "New Product Added",
            description: `Product "${product.name}" was added to the store`,
            timestamp: product.createdAt,
            icon: Package,
            color: "blue",
            user: product.createdBy || "System",
          });
        }

        if (product.updatedAt && product.updatedAt !== product.createdAt) {
          activities.push({
            id: `product-update-${product.id}`,
            type: "product_updated",
            title: "Product Updated",
            description: `Product "${product.name}" was modified`,
            timestamp: product.updatedAt,
            icon: Edit,
            color: "yellow",
            user: product.updatedBy || "Admin",
          });
        }
      });

      // Process recent users
      recentUsers.forEach((user) => {
        if (user.createdAt) {
          activities.push({
            id: `user-${user.id}`,
            type: "user_registered",
            title: "New User Registration",
            description: `${
              user.displayName || user.email
            } joined the platform`,
            timestamp: user.createdAt,
            icon: UserPlus,
            color: "green",
            user: user.displayName || user.email,
          });
        }

        if (user.blocked) {
          activities.push({
            id: `user-blocked-${user.id}`,
            type: "user_blocked",
            title: "User Blocked",
            description: `User ${user.displayName || user.email} was blocked`,
            timestamp: user.updatedAt || user.createdAt,
            icon: UserMinus,
            color: "red",
            user: "Admin",
          });
        }
      });

      // Process recent categories
      recentCategories.forEach((category) => {
        if (category.createdAt) {
          activities.push({
            id: `category-${category.id}`,
            type: "category_created",
            title: "New Category Added",
            description: `Category "${category.name}" was created`,
            timestamp: category.createdAt,
            icon: Tags,
            color: "purple",
            user: category.createdBy || "Admin",
          });
        }
      });

      // Add some system activities
      activities.push(
        {
          id: "system-backup",
          type: "system_backup",
          title: "System Backup",
          description: "Automated database backup completed successfully",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          icon: Database,
          color: "indigo",
          user: "System",
        },
        {
          id: "system-update",
          type: "system_update",
          title: "System Update",
          description: "Platform updated to latest version",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
          icon: RefreshCw,
          color: "green",
          user: "System",
        }
      );

      // Sort activities by timestamp (most recent first)
      activities.sort((a, b) => {
        const timeA = a.timestamp?.seconds
          ? a.timestamp.seconds * 1000
          : new Date(a.timestamp).getTime();
        const timeB = b.timestamp?.seconds
          ? b.timestamp.seconds * 1000
          : new Date(b.timestamp).getTime();
        return timeB - timeA;
      });

      setRecentActivities(activities.slice(0, 10)); // Show only last 10 activities
    } catch (err) {
      console.error("Error fetching recent activities:", err);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const formatActivityTime = (timestamp) => {
    if (!timestamp) return "Unknown time";

    const date = timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const getActivityColorClass = (color) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-emerald-100 text-emerald-800 border-emerald-200",
      yellow: "bg-amber-100 text-amber-800 border-amber-200",
      red: "bg-red-100 text-red-800 border-red-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colorMap[color] || colorMap.blue;
  };

  // Redirect if not admin
  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center border border-slate-200">
          <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 mb-8">
            You don't have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Tags },
    { id: "users", label: "Users", icon: Users },
  ];

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-emerald-500 to-emerald-600",
      yellow: "from-amber-500 to-amber-600",
      red: "from-red-500 to-red-600",
      purple: "from-purple-500 to-purple-600",
      indigo: "from-indigo-500 to-indigo-600",
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">
              {loading ? (
                <div className="w-16 h-8 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                value
              )}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-2">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-slate-50 rounded-xl px-4 py-2">
                <img
                  className="h-8 w-8 rounded-full ring-2 ring-white"
                  src={
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${user?.email}&background=6366f1&color=ffffff`
                  }
                  alt={user?.displayName || user?.email}
                />
                <span className="text-sm font-medium text-slate-700">
                  {user?.displayName || user?.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-72 bg-white shadow-sm border-r border-slate-200 h-screen sticky top-16">
          <div className="p-6">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        className={`mr-3 w-5 h-5 ${
                          activeTab === tab.id
                            ? "text-indigo-600"
                            : "text-slate-400"
                        }`}
                      />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {error && (
            <div className="m-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Dashboard Overview
                </h2>
                <p className="text-slate-600 text-lg">
                  Welcome back! Here's what's happening with your store.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                <StatCard
                  title="Total Products"
                  value={stats.totalProducts}
                  icon={Package}
                  color="blue"
                />
                <StatCard
                  title="Active Products"
                  value={stats.activeProducts}
                  icon={CheckCircle}
                  color="green"
                />
                <StatCard
                  title="Total Categories"
                  value={stats.totalCategories}
                  icon={Tags}
                  color="purple"
                />
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={Users}
                  color="indigo"
                />
                <StatCard
                  title="Active Categories"
                  value={stats.activeCategories}
                  icon={Activity}
                  color="green"
                />
                <StatCard
                  title="Blocked Users"
                  value={stats.blockedUsers}
                  icon={XCircle}
                  color="red"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-indigo-600" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("products")}
                      className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all duration-200 group"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-500 rounded-lg p-2 mr-4">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            Add New Product
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            Create a new product listing
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("categories")}
                      className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all duration-200 group"
                    >
                      <div className="flex items-center">
                        <div className="bg-purple-500 rounded-lg p-2 mr-4">
                          <Tags className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                            Manage Categories
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            Add or edit product categories
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all duration-200 group"
                    >
                      <div className="flex items-center">
                        <div className="bg-indigo-500 rounded-lg p-2 mr-4">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            View Users
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            Manage user accounts and permissions
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-emerald-600" />
                    System Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 text-emerald-600 mr-3" />
                        <span className="text-slate-700 font-medium">
                          Product Listings
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        <span className="text-sm text-emerald-700 font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                      <div className="flex items-center">
                        <UserCheck className="w-5 h-5 text-emerald-600 mr-3" />
                        <span className="text-slate-700 font-medium">
                          User Registration
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        <span className="text-sm text-emerald-700 font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                      <div className="flex items-center">
                        <Upload className="w-5 h-5 text-emerald-600 mr-3" />
                        <span className="text-slate-700 font-medium">
                          Image Upload
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        <span className="text-sm text-emerald-700 font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                      <div className="flex items-center">
                        <Database className="w-5 h-5 text-emerald-600 mr-3" />
                        <span className="text-slate-700 font-medium">
                          Database
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        <span className="text-sm text-emerald-700 font-medium">
                          Connected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-slate-600" />
                    Recent Activity
                  </h3>
                  <button
                    onClick={fetchRecentActivities}
                    disabled={activitiesLoading}
                    className="inline-flex items-center px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-1 ${
                        activitiesLoading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </button>
                </div>
                <div className="p-6">
                  {activitiesLoading && recentActivities.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : recentActivities.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                      <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-lg font-medium text-slate-600 mb-2">
                        No recent activity
                      </p>
                      <p className="text-sm text-slate-500">
                        Activities will appear here as they happen
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivities.map((activity) => {
                        const Icon = activity.icon;
                        return (
                          <div
                            key={activity.id}
                            className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getActivityColorClass(
                                activity.color
                              )}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-semibold text-slate-900 truncate">
                                  {activity.title}
                                </h4>
                                <div className="flex items-center text-xs text-slate-500 ml-4 flex-shrink-0">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatActivityTime(activity.timestamp)}
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">
                                {activity.description}
                              </p>
                              <div className="flex items-center">
                                <User className="w-3 h-3 text-slate-400 mr-1" />
                                <span className="text-xs text-slate-500">
                                  By {activity.user}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
