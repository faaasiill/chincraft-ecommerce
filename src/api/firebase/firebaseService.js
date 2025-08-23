import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  startAfter,
  limit,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Utility to validate input data
const validateData = (data, entity) => {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    throw new Error(`Invalid ${entity} data provided`);
  }
};

// Utility to update a document with server timestamp
const updateDocument = async (docRef, updates, entity) => {
  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`${entity} does not exist`);
    }
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(`Error updating ${entity.toLowerCase()}: ${error.message}`);
  }
};

// Product Management Service
export const productService = {
  // Get all products with optional pagination
  async getProducts(pageSize = 10, lastDoc = null) {
    try {
      const productsRef = collection(db, "products");
      let q = query(productsRef, orderBy("createdAt", "desc"), limit(pageSize));
      if (lastDoc) {
        q = query(productsRef, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));
      }
      const snapshot = await getDocs(q);
      return {
        products: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  },

  // Add a new product
  async addProduct(productData) {
    try {
      validateData(productData, "Product");
      const productsRef = collection(db, "products");
      const docRef = await addDoc(productsRef, {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        listed: true,
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`Error adding product: ${error.message}`);
    }
  },

  // Update a product
  async updateProduct(productId, updates) {
    try {
      validateData(updates, "Product updates");
      const productRef = doc(db, "products", productId);
      await updateDocument(productRef, updates, "Product");
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  },

  // Delete a product
  async deleteProduct(productId) {
    try {
      const productRef = doc(db, "products", productId);
      const docSnap = await getDoc(productRef);
      if (!docSnap.exists()) {
        throw new Error("Product does not exist");
      }
      await deleteDoc(productRef);
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  },

  // Toggle product listing status
  async toggleProductListing(productId, currentStatus) {
    try {
      const productRef = doc(db, "products", productId);
      await updateDocument(productRef, { listed: !currentStatus }, "Product");
    } catch (error) {
      throw new Error(`Error toggling product listing: ${error.message}`);
    }
  },
};

// User Management Service
export const userService = {
  // Get all users with optional pagination
  async getUsers(pageSize = 10, lastDoc = null) {
    try {
      const usersRef = collection(db, "users");
      let q = query(usersRef, orderBy("createdAt", "desc"), limit(pageSize));
      if (lastDoc) {
        q = query(usersRef, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));
      }
      const snapshot = await getDocs(q);
      return {
        users: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  },

  // Get a user by ID
  async getUserById(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  },

  // Update a user
  async updateUser(userId, updates) {
    try {
      validateData(updates, "User updates");
      const userRef = doc(db, "users", userId);
      await updateDocument(userRef, updates, "User");
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  },

  // Toggle user block status
  async toggleUserStatus(userId, currentStatus) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDocument(userRef, { blocked: !currentStatus }, "User");
    } catch (error) {
      throw new Error(`Error toggling user status: ${error.message}`);
    }
  },

  // Update user address
  async updateUserAddress(userId, addressData) {
    try {
      validateData(addressData, "User address");
      const userRef = doc(db, "users", userId);
      await updateDocument(userRef, { address: addressData }, "User");
    } catch (error) {
      throw new Error(`Error updating user address: ${error.message}`);
    }
  },
};

// Category Management Service
export const categoryService = {
  // Get all categories with optional pagination
  async getCategories(pageSize = 10, lastDoc = null) {
    try {
      const categoriesRef = collection(db, "categories");
      let q = query(categoriesRef, orderBy("createdAt", "desc"), limit(pageSize));
      if (lastDoc) {
        q = query(categoriesRef, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));
      }
      const snapshot = await getDocs(q);
      return {
        categories: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  },

  // Add a new category
  async addCategory(categoryData) {
    try {
      validateData(categoryData, "Category");
      const categoriesRef = collection(db, "categories");
      const docRef = await addDoc(categoriesRef, {
        ...categoryData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`Error adding category: ${error.message}`);
    }
  },
  async updateCategory(categoryId, updates) {
    try {
      validateData(updates, "Category updates");
      const categoryRef = doc(db, "categories", categoryId);
      await updateDocument(categoryRef, updates, "Category");
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  },
  async deleteCategory(categoryId) {
    try {
      const categoryRef = doc(db, "categories", categoryId);
      const docSnap = await getDoc(categoryRef);
      if (!docSnap.exists()) {
        throw new Error("Category does not exist");
      }
      await deleteDoc(categoryRef);
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  },
};