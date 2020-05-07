const express = require("express");
// allows us to access the variables in the variables in the .env file
require("dotenv").config();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");

//middleware
const cors = require("cors");

/* connect to mongoose. To connect to local MongoDB, use 
 process.env.DATABASE */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: $(err.message)`);
});

// middlwares_________________________________________________________
//morgan shows the routes in the console
app.use(morgan("dev"));
// grabs json data from the client that is in the request body
app.use(bodyParser.json());
// we will save the user credentials in the cookies
app.use(cookieParser());
//validates user data
app.use(expressValidator());
/*api is able to handle request from different origins since the frontend will be running
on port 3000 and the backend is running on port 8000*/
app.use(cors());

/* All routes are prepended with "/api." These routes are specified in 
 authRoutes, userRoutes, categoryRoutes, productRoutes which are files*/
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);

/* defined the port in the .env file of 8000 which will be used when the app is put
into production. Node runs in the process environment */
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
