import path from "path";
import express from "express";
import dotenv from "dotenv";
import userRroutes from "./routes/userRoutes.js";
import { errorHandler, notFound} from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

const port = process.env.port || 5000;
const app = express();
dotenv.config();
connectDB();

//Allow parsing json, sending form data
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//connect the path to userRoutes
app.use("/api/users", userRroutes);
//
if(process.env.NODE_ENV === "production"){
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "frontend/dist")));

    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html")));
}
else{
    // |
    app.get("/", (req,res) => res.send("SERVER is READY"));
}
//

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on Port: ${port} `));