const mongoose = require("mongoose");

const express = require("express");
const router = require("./routes/routes");
const app = express();

app.use(express.json());
app.use("/api", router);

mongoose
  .connect("mongodb://127.0.0.1:27017/MERN")
  .then(() => console.log("Connected!"));
app.listen(8000, () => {
  console.log("Server lancé au http://localhost:8000");
});
