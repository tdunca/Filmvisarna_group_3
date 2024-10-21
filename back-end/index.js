import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";
import router from "./routes/auth.js";
import hallrouter from "./routes/hall.js";
import movierouter from "./routes/movie.js";
import userRouter from "./routes/user.js";
import showtimeRouter from "./routes/showtime.js";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", router);
app.use("/api/hall", hallrouter);
app.use("/api/movie", movierouter);
app.use("/api/user", userRouter);
app.use("/api/showtime", showtimeRouter);
app.listen(process.env.PORT || 5001, () => {
  try {
    connectDB();
    console.log("Server started at", process.env.PORT || 5001);
  } catch (error) {
    console.error("Server failed to start");
    process.exit(1);
  }
});
