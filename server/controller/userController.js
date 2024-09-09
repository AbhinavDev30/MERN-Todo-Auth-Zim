import register from "../schema/registerSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phoneNumber,
      address,
      gender,
    } = req.body;

    if (!name || !email || !password || !confirmPassword || !gender) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const existingUser = await register.findOne({ email });
    if (existingUser) {
      return res.status(402).send({ error: "User already exists." });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await register.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      gender,
    });

    if (!newUser) {
      return res.status(500).json({ error: "User creation failed." });
    }

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SecretKey,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User successfully created",
      newUser,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password." });
    }

    const user = await register.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log("Working till here");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Wrong password! Try again." });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SecretKey,
      { expiresIn: "1h" }
    );

    console.log(token);

    return res
      .status(201)
      .json({ message: "User successfully logged in.", token, user });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
