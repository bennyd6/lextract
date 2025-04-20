import pkg from 'jsonwebtoken';
const { verify } = pkg;

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Remove "Bearer " prefix if present
        const tokenWithoutBearer = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
        
        // Verify the token
        const decoded = verify(tokenWithoutBearer, "process.env.JWT_SECRET");

        if (!decoded || !decoded.id) {
            return res.status(400).json({ message: "Invalid token. Missing user details." });
        }

        req.user = { id: decoded.id };  // Attach user ID to request
        next();  // Proceed to the next middleware

    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ message: "Invalid token or expired session." });
    }
};

export default authMiddleware;
