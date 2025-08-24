import { useState, useEffect } from 'react';
import { userService } from '../../api/firebase/firebaseService';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  X,
  User,
  MapPin,
  Clock
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, blocked.

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (loadMore = false) => {
    try {
      setLoading(!loadMore);
      const result = await userService.getUsers(20, loadMore ? lastDoc : null);
      
      if (loadMore) {
        setUsers(prev => [...prev, ...result.users]);
      } else {
        setUsers(result.users);
      }
      
      setLastDoc(result.lastDoc);
      setHasMore(result.users.length === 20);
    } catch (err) {
      setError('Failed to fetch users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await userService.toggleUserStatus(userId, currentStatus);
      setSuccess(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully!`);
      fetchUsers();
    } catch (err) {
      setError('Failed to toggle user status: ' + err.message);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const userData = await userService.getUserById(userId);
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (err) {
      setError('Failed to fetch user details: ' + err.message);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
  };

  // Filter users based on search term and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && !user.blocked) ||
      (filterStatus === 'blocked' && user.blocked);

    return matchesSearch && matchesStatus;
  });

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

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-emerald-500 to-emerald-600",
      red: "from-red-500 to-red-600",
      purple: "from-purple-500 to-purple-600",
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
              <Users className="w-8 h-8 mr-3 text-indigo-600" />
              User Management
            </h2>
            <p className="text-slate-600 text-lg">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="text-slate-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            Total Users: <span className="font-semibold text-slate-900">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center space-x-2">
          <XCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={users.filter(user => !user.blocked).length}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Blocked Users"
          value={users.filter(user => user.blocked).length}
          icon={UserX}
          color="red"
        />
        <StatCard
          title="Admin Users"
          value={users.filter(user => user.role === 'admin').length}
          icon={Shield}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-slate-600" />
          Filters & Search
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="blocked">Blocked Users</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <div className="text-slate-500 text-lg font-medium mb-2">No users found</div>
            <p className="text-slate-400">
              {searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters' : 'No users registered yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {user.photoURL ? (
                              <img
                                className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-200"
                                src={user.photoURL}
                                alt={user.displayName || user.email}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-slate-200">
                                <span className="text-white font-semibold text-lg">
                                  {(user.displayName || user.firstName || user.email || 'U')[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-900">
                              {user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown'}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center mt-1">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.phoneNumber || 'No phone number'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-slate-400" />
                          {user.email}
                        </div>
                        <div className="text-sm flex items-center mt-1">
                          {user.emailVerified ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="w-3 h-3 mr-1" />
                              Not verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          user.blocked
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {user.blocked ? (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Blocked
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewUser(user.id)}
                            className="inline-flex items-center px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg font-medium transition-colors duration-200"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.blocked)}
                            className={`inline-flex items-center px-3 py-1 rounded-lg font-medium transition-colors duration-200 ${
                              user.blocked
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                : 'bg-red-100 hover:bg-red-200 text-red-800'
                            }`}
                          >
                            {user.blocked ? (
                              <>
                                <UserCheck className="w-3 h-3 mr-1" />
                                Unblock
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3 mr-1" />
                                Block
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasMore && (
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => fetchUsers(true)}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-8 mx-auto p-0 border-0 w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/5 shadow-2xl rounded-2xl bg-white max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <User className="w-6 h-6 mr-2" />
                User Details
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* User Profile Section */}
              <div className="flex items-center space-x-6 p-4 bg-slate-50 rounded-xl">
                {selectedUser.photoURL ? (
                  <img
                    className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                    src={selectedUser.photoURL}
                    alt={selectedUser.displayName || selectedUser.email}
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                    <span className="text-white font-bold text-2xl">
                      {(selectedUser.displayName || selectedUser.firstName || selectedUser.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-slate-900">
                    {selectedUser.displayName || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || 'Unknown User'}
                  </h4>
                  <p className="text-slate-600 flex items-center mt-2">
                    <Mail className="w-4 h-4 mr-2" />
                    {selectedUser.email}
                  </p>
                  <div className="flex items-center space-x-3 mt-3">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.blocked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedUser.blocked ? 'Blocked' : 'Active'}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedUser.role || 'user'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    <p className="text-slate-900">{selectedUser.phoneNumber || 'Not provided'}</p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Verified
                    </label>
                    <p className={`${selectedUser.emailVerified ? 'text-emerald-600' : 'text-red-600'} font-medium`}>
                      {selectedUser.emailVerified ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Joined
                    </label>
                    <p className="text-slate-900">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Last Updated
                    </label>
                    <p className="text-slate-900">{formatDate(selectedUser.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              {selectedUser.address && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Address
                  </label>
                  <div className="text-slate-900 space-y-1">
                    <p className="font-medium">{selectedUser.address.street}</p>
                    <p>{selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}</p>
                    <p className="text-slate-600">{selectedUser.address.country}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => handleToggleUserStatus(selectedUser.id, selectedUser.blocked)}
                className={`px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center ${
                  selectedUser.blocked
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {selectedUser.blocked ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Unblock User
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4 mr-2" />
                    Block User
                  </>
                )}
              </button>
              <button
                onClick={closeModal}
                className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;