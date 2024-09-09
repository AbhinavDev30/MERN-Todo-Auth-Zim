import { response } from "express";
import jwt from "jsonwebtoken";

export const jwtVerifyHeader = (req, res, next) => {
  const { token } = req.query;
  console.log(typeof token);

  try {
    if (!token) {
      return res
        .status(403)
        .json({ error: "No token found for verification." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SecretKey);
    console.log("Working");
    console.log("Decoded token: GET", decoded);

    req.user = decoded;

    // Call next middleware
    next();
  } catch (error) {
    return res.status(501).json({ error: "Invalid token" });
  }
};
