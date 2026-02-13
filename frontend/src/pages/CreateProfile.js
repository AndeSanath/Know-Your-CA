import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Login.css"; // Reusing form styles

function CreateProfile() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        specialization: "",
        location: "",
        experience: "",
        rating: 0, // Default
        about: "",
        price: "",
    });
    const [image, setImage] = useState(null);
    const [headerImage, setHeaderImage] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === "image") setImage(e.target.files[0]);
        if (e.target.name === "headerImage") setHeaderImage(e.target.files[0]);
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("http://localhost:5001/api/upload", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return `http://localhost:5001${data.filePath}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!image) throw new Error("Profile image is required");

            const imageUrl = await uploadFile(image);
            let headerImageUrl = "https://via.placeholder.com/800x200"; // Default
            if (headerImage) {
                headerImageUrl = await uploadFile(headerImage);
            }

            const profileData = {
                userId: user.id || user._id, // Handle decoded JWT structure
                name: user.name,
                image: imageUrl,
                headerImage: headerImageUrl,
                ...formData,
            };

            const response = await fetch("http://localhost:5001/api/ca", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                navigate("/");
            } else {
                const data = await response.json();
                setError(data.message || "Failed to create profile");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box" style={{ maxWidth: "600px" }}>
                <h2>Create Your CA Profile</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <p style={{ textAlign: "left", marginBottom: "0.5rem" }}>Profile Picture*</p>
                    <input type="file" name="image" accept="image/*" onChange={handleFileChange} required />

                    <p style={{ textAlign: "left", marginBottom: "0.5rem" }}>Header Image (Optional)</p>
                    <input type="file" name="headerImage" accept="image/*" onChange={handleFileChange} />

                    <input
                        type="text"
                        name="specialization"
                        placeholder="Specialization (e.g., Taxation)"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="experience"
                        placeholder="Experience (e.g., 5 Years)"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="price"
                        placeholder="Pricing (e.g., ₹1000/hr)"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="about"
                        placeholder="About You"
                        value={formData.about}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "10px", margin: "10px 0", height: "100px" }}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Profile..." : "Submit Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateProfile;
