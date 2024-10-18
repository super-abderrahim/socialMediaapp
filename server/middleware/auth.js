import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        
        // Check if the token exists
        if (!token) {
            return res.status(403).send("Access denied");
        }

        // If token starts with "Bearer ", remove "Bearer " part
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();  // Use `trimLeft()`
        }

        // Verify the token using JWT secret
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the verified user info to request object
        req.user = verified;
        next();
    } catch (err) {
        // Handle errors and respond
        res.status(500).json({ message: err.message });
    }
};
