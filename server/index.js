import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import {
  addData,
  deleteData,
  getData,
  updateData,
} from "./controller/todoController.js";
import { loginUser, registerUser } from "./controller/userController.js";
import { jwtVerify } from "./validation/jwtVarification.js";
import { jwtVerifyHeader } from "./validation/jwtverifyHead.js";
const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);

//All routes for todo
app.post("/addTodo", addData);
app.get("/getData", jwtVerifyHeader, getData);
app.put("/updateData", updateData);
app.delete("/deleteTodo", deleteData);

// All routes for register aand login
app.post("/register", registerUser);
app.post("/login", loginUser);

// Token varification
app.post("/jwtVerifyToken", jwtVerify);

//Database connection and running server
mongoose
  .connect("mongodb://localhost:27017/todoNode-task")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000...");
    });
  });

//Password123!
//john.doe@example.com
