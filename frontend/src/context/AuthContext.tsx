import  { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { API_URI } from '../config';
import NotificationSnackbar from '../components/NotificationSnackbar';

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("info");

    const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const login = async (username: string, password: string) => {
        try {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

            const response = await axios.post(`${API_URI}/token`, params, {
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            
            const token = response.data.access_token;
            setUser({ username });
            setToken(token);
            setIsAuthenticated(true);
            showSnackbar(`🎉 Welcome back, ${username}!`, "success");

            localStorage.setItem('token', token);
        } catch (err: any) {
            setIsAuthenticated(false);
            throw new Error(err.response?.data?.detail ?? 'Username or Password is incorrect');
        }
    };

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem("token"));
    }, [])

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
            <NotificationSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
