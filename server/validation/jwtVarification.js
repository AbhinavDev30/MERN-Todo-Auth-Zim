import jwt from "jsonwebtoken";

export const jwtVerify = (req, res) => {
  console.log(res.body);

  const { token } = req.body;
  console.log(token);

  try {
    if (!token) {
      return res
        .status(403)
        .json({ error: "No token found for verification." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SecretKey);
    console.log("Decoded token POST:", decoded);

    return res.status(200).json({ message: "Token is valid", decoded });
  } catch (error) {
    return res.status(501).json({ error: "Invalid token" });
  }
};
