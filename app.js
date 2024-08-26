require('dotenv').config();
require("./config/mongoose.js");
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport.js'); // Correctly require passport configuration
const session = require('express-session'); // Require express-session
const path = require('path');

const indexRouter = require("./routes/index.js");
const authRouter = require("./routes/auth.js");
const adminRouter = require("./routes/admin.js");
const userRouter = require("./routes/user.js");
const productRouter = require("./routes/product.js");
const categoriesRouter = require("./routes/categories.js");
const paymentRouter = require("./routes/payment.js");
const cartRouter = require("./routes/cart.js");
const orderRouter = require("./routes/order.js");
const cookieParser = require('cookie-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser())

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session(
    {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }
)); 

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/products', productRouter);
app.use('/categories', categoriesRouter);
app.use('/cart', cartRouter);
app.use('/payment', paymentRouter);

app.use('/users', userRouter);
app.use('/order', orderRouter);

app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`);
});
