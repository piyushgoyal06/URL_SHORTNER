import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/monogo.config.js";
import short_url from "./src/routes/short_url.route.js";
import auth_routes from "./src/routes/auth.routes.js";
import user_routes from "./src/routes/user.routes.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { attachUser } from "./src/utils/attachUser.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";

dotenv.config("./.env");
const app = express();

const _dirname = path.resolve();

app.use(
  cors({
    origin: "https://url-shortner-lf1x.onrender.com",
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(attachUser);

app.use("/api/user", user_routes);
app.use("/api/auth", auth_routes);
app.use("/api/create", short_url);

app.get("/:id", redirectFromShortUrl);

app.use(errorHandler);

app.use(express.static(path.join(_dirname, "/Frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
});

app.listen(3000, () => {
  connectDB();
  console.log("Server is running on http://localhost:3000");
});
