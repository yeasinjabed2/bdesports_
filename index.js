require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const router = require("./router/router");
const compression = require("compression");

const app = express();

//middleware
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//routes middleware
app.use("/api", router);

app.use(express.static("public"));
const path = require("path");
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

//Database Connection
mongoose
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}....`));
