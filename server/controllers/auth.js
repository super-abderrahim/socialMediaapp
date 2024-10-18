import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";  // Ensure the '.js' extension is included.



/* Register user */
export const register = async (req, res) => {
    try {
      console.log(req.file);  // Log uploaded file to check it
      const {
        firstName,
        lastName,
        email,
        password,
        location,
        occupation,
      } = req.body;
  
      if (!password || password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters long." });
      }
  
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath: req.file ? req.file.filename : "",  // Handle image path
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      });
  
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  };

/* Login user */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        // Find user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'defaultSecret', // Ensure JWT_SECRET is defined in environment
            { expiresIn: '1h' } // Optional: Token expires in 1 hour
        );

        // Convert user to plain object and remove password
        const userObject = user.toObject();
        delete userObject.password;

        res.status(200).json({ token, user: userObject });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
};
