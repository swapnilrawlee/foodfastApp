const express = require('express');
const { productModel, validateProduct } = require('../models/product');
const { categoryModel, validateCategory } = require('../models/category');
const { cartModel, validateCart } = require('../models/cart');
const upload = require('../config/multer');
const { validateAdmin, userIsLoggedIn } = require('../middlewares/admin_middlewares')
const router = express.Router();

router.get('/', userIsLoggedIn, async function (req, res) {
  let somethingInCart=false
  const result = await productModel.aggregate([
    {
      $group: {
        _id: "$category",
        products: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        products: { $slice: ["$products", 10] },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: {
            $arrayToObject: [[{ k: "$category", v: "$products" }]],
          },
        },
      },
    },
  ]);
let cart = await cartModel.findOne({user: req.session.passport.user});
if(cart){
  somethingInCart=true;
}
  let rnproducts = await productModel.aggregate([
    { $sample: { size: 3 } }
  ]);

  const resultObject = result.reduce((acc, item) => {
    const category = Object.keys(item)[0];

    if (category) {
      acc[category] = item[category] || [];
    } else {
      console.log('Category is undefined for item:', item);
    }

    return acc;
  }, {});

  res.render("index", { products: resultObject, rnproducts,somethingInCart,cartCount:cart ? cart.products.length:0 });
});

// POST a new product
router.post('/', upload.single("image"), async function (req, res) {
  const { name, price, category, stock, description } = req.body;
  const { error } = validateProduct({ name, price, category, stock, description });

  if (error) return res.status(400).send(error.details[0].message);

  let isCategory = await categoryModel.findOne({ name: category });

  if (!isCategory) {
    // Create a new category if it doesn't exist
    isCategory = new categoryModel({ name: category });
    await isCategory.save();
  }

  let product = new productModel({
    name,
    price,
    category,
    stock,
    description,
    image: req.file.buffer
  });

  try {
    await product.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/delete/:id', validateAdmin, async function (req, res) {
  if (req.user.role === 'Admin') {
    let prods = await productModel.findOneAndDelete({ _id: req.params.id });
    return res.redirect("/admin/products");
  }
  res.send("you are not allowed to delete this product")
});

router.post('/delete', validateAdmin, async function (req, res) {
  if (req.user.role === 'Admin') {
    let prods = await productModel.findOneAndDelete({ _id: req.body.product_id });
    return res.redirect("back");
  }
  res.send("you are not allowed to delete this product")
});

module.exports = router;
