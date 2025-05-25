import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import apiInstance from "../api/axios";
import NotificationSnackbar from "../components/NotificationSnackbar";

export interface Product {
    quantity: number;
    description: string;
    id: number;
    name: string;
    price: number;
}

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, "id">) => Promise<void>;
    editProduct: (updatedProduct: Product) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) throw new Error("useProducts must be used within ProductProvider");
    return context;
};

interface ProductProviderProps {
    children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("info");

    const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await apiInstance.get<Product[]>("/products");
            setProducts(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message ?? "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (product: Omit<Product, "id">) => {
        setLoading(true);
        try {
            const response = await apiInstance.post<Product>("/products", product);
            setProducts(prev => [...prev, response.data]);
            setError(null);
            showSnackbar("Product added successfully", "success");
        } catch (err: any) {
            showSnackbar(err.message ?? "Failed to add product", "error");
            setError(err.message ?? "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    const editProduct = async (updatedProduct: Product) => {
        setLoading(true);
        try {
            const response = await apiInstance.put<Product>(`/products/${updatedProduct.id}`, updatedProduct);
            setProducts(prev =>
                prev.map(p => (p.id === updatedProduct.id ? response.data : p))
            );
            setError(null);
            showSnackbar("Product updated successfully", "success");
            fetchProducts();
        } catch (err: any) {
            showSnackbar(err.message ?? "Failed to update product", "error");
            setError(err.message ?? "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: number) => {
        setLoading(true);
        try {
            await apiInstance.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
            setError(null);
            showSnackbar("Product deleted successfully", "success");
            fetchProducts();
        } catch (err: any) {
            setError(err.message ?? "Failed to delete product");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")){
            fetchProducts();
        }
        
    }, []);

    return (
        <ProductContext.Provider
        value={{
            products,
            loading,
            error,
            fetchProducts,
            addProduct,
            editProduct,
            deleteProduct,
        }}
        >
        {children}
        <NotificationSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            severity={snackbarSeverity}
            onClose={() => setSnackbarOpen(false)}
        />
        </ProductContext.Provider>
    );
};
