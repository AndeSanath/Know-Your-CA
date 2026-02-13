const mongoose = require("mongoose");
const User = require("./models/User");
const CA = require("./models/CA");
const bcrypt = require("bcryptjs"); // Ensure bcryptjs is installed

mongoose.connect("mongodb://localhost:27017/know-your-ca")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

async function linkCA() {
    try {
        // 1. Create/Find User 'Rahul Sharma'
        let user = await User.findOne({ email: "rahul@example.com" });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("password123", salt);
            user = new User({
                name: "Rahul Sharma",
                email: "rahul@example.com",
                password: hashedPassword, // Manually hashed
                role: "ca"
            });
            // Bypass pre-save hook since we hashed it manually or just save raw and let hook handle it if we didn't hash?
            // actually the hook handles it if modified. If we set it directly, hook might hash it again?
            // Let's rely on the model.

            // Re-instantiate to use model logic correctly
            user = new User({
                name: "Rahul Sharma",
                email: "rahul@example.com",
                password: "password123",
                role: "ca"
            });
            await user.save();
            console.log("User created:", user._id);
        } else {
            console.log("User found:", user._id);
        }

        // 2. Find CA 'Rahul Sharma'
        const ca = await CA.findOne({ name: "Rahul Sharma" });
        if (ca) {
            // We need to store this user ID in the CA document. 
            // But CA schema doesn't have 'userId'.
            // We can add it dynamically or just use this ID for our test.
            // Let's add it to the schema in code first, or just use `findOneAndUpdate` which bypasses strict mode if not set? 
            // Mongoose is strict. We need to update the schema in the codebase.
            // FOR NOW, let's just print the ID so we can hardcode it or use it?
            // No, we need the app to work.
            console.log("CA found:", ca._id);
        }

        // 3. We really need to update the CA schema to hold 'userId'. 
        // I will do that in the codebase next.

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

linkCA();
