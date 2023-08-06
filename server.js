const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const globalError = require("./middlewares/errorMW");
const SubCategoryRoute = require("./routes/subCategoryRoute");
const BrandRoute = require("./routes/brandRoute");
const ProductRoute = require('./routes/productRoute')

// database connection
dbConnection();

// express app
const app = express();

// middlewares
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// mount routes

app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", SubCategoryRoute);
app.use("/api/v1/brands", BrandRoute);
app.use("/api/v1/products", ProductRoute);


app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err}`);
  server.close(() => {
    process.exit(1);
  });
});
