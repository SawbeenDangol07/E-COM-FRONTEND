import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../services/product.service";
import brandService from "../services/brand.service";
import categoryService from "../services/category.service";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.listPublic({
        limit: 100,
        search: params.search || "",
        brand: params.brand || "",
        category: params.category || "",
        minPrice: params.minPrice || "",
        maxPrice: params.maxPrice || "",
        sortBy: params.sortBy || "",
      });
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch products");
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  "products/fetchProductDetail",
  async (idOrSlug, { rejectWithValue }) => {
    try {
      let response;
      try {
        response = await productService.getBySlug(idOrSlug);
      } catch {
        response = await productService.getDetail(idOrSlug);
      }
      return response.data?.product || response.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch product details");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.listForHome();
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch categories");
    }
  }
);

export const fetchBrands = createAsyncThunk(
  "products/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await brandService.listAll({ status: "active", limit: 100 });
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch brands");
    }
  }
);

export const createNewProduct = createAsyncThunk(
  "products/createNewProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.create(productData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create product");
    }
  }
);

export const deleteProductListing = createAsyncThunk(
  "products/deleteProductListing",
  async (id, { rejectWithValue }) => {
    try {
      await productService.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    selectedProduct: null,
    categories: [],
    brands: [],
    loading: false,
    detailLoading: false,
    error: null,
    filters: {
      search: "",
      brand: "all",
      category: "all",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = {
        search: "",
        brand: "all",
        category: "all",
        minPrice: "",
        maxPrice: "",
        sortBy: "newest",
      };
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Single Product
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });

    // Categories
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });

    // Brands
    builder.addCase(fetchBrands.fulfilled, (state, action) => {
      state.brands = action.payload;
    });

    // Create Product
    builder.addCase(createNewProduct.fulfilled, (state, action) => {
      state.items = [action.payload, ...state.items];
      state.total += 1;
    });

    // Delete Product
    builder.addCase(deleteProductListing.fulfilled, (state, action) => {
      state.items = state.items.filter((p) => (p._id || p.id) !== action.payload);
      state.total -= 1;
    });
  },
});

export const { setFilters, resetFilters, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
