const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { routes } = require("./routes/routes");
const path = require('path')
require("dotenv").config();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("Database connected!");
  })
  .catch((error) => {
    console.log("Database connection error := ", error);
  });

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use("/api/", routes);

app.get("/", function (req, res) {
  res.send("Server is running");
});

app.listen(PORT, function () {
  console.log("Listenning to PORT := ", PORT);
});
