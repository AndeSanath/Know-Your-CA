import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Login.css";

function Login() {
    const { login, register } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        let result;
        if (isLogin) {
            result = await login(formData.email, formData.password);
        } else {
            result = await register(
                formData.name,
                formData.email,
                formData.password,
                formData.role
            );
        }

        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isLogin ? "Login" : "Sign Up"}</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {!isLogin && (
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="ca">Chartered Accountant</option>
                        </select>
                    )}
                    <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
                </form>
                <p className="toggle-text">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Sign Up" : "Login"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;
