import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decoded);
                }
            } catch (error) {
                logout();
            }
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:5001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                const decodedUser = jwtDecode(data.token);
                setUser(decodedUser);

                if (decodedUser.role === "ca") {
                    // Check if profile exists
                    try {
                        const caResponse = await fetch(`http://localhost:5001/api/ca/${decodedUser.id}`);
                        if (caResponse.ok) {
                            navigate("/");
                        } else {
                            navigate("/create-profile");
                        }
                    } catch (e) {
                        navigate("/create-profile");
                    }
                } else {
                    navigate("/");
                }
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Server error" };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const response = await fetch("http://localhost:5001/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                const decodedUser = jwtDecode(data.token);
                setUser(decodedUser);

                if (decodedUser.role === "ca") {
                    navigate("/create-profile");
                } else {
                    navigate("/");
                }
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Server error" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
