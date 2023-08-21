const express = require("express");
const app = express();
const connectDB = require("./db/dbConnection.js");
const categoryRoute = require("./routes/categoryRoute.js");
const districtRoute = require("./routes/districtRoute.js");
const translateRoute = require("./routes/translateRoute.js");
const placeRoute = require("./routes/placeRoute.js");
const authRoute = require("./routes/userRoute.js");
const bodyParser = require("body-parser");
const authMiddleware = require("./middlewares/auth.js");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/images", express.static("images"));

app.use("/api/", categoryRoute);
app.use("/api/", districtRoute);
app.use("/api/", translateRoute);
app.use("/api/", authRoute);
app.use("/api/", authMiddleware, placeRoute);

app.listen(PORT, "0.0.0.0", async () => {
  await connectDB();
  console.log(`sever up at  ${PORT}`);
});
