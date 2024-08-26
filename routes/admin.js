const express = require('express');
const { adminModel } = require("../models/admin")
const { productModel } = require("../models/product")
const { categoryModel } = require("../models/category"); // Ensure this import is present

const {validateAdmin} = require("../middlewares/admin_middlewares")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const router = express.Router();

    if (typeof process.env.NOD_ENV !== undefined && process.env.NOD_ENV === "development") {
        router.get("/create", async function (req, res) {
            let hash = await bcrypt.hash("password", 10)
            let user = new adminModel({
                name: "Admin",
                email: "admin@example.com",
                password: hash,
                role: "Admin"
            })
            await user.save();
            const token = jwt.sign({ email: "admin@example.com", role: "Admin" }, process.env.JWT_KEY);
            res.cookie("token", token);
            res.send("Admin created successfully");
        })
    }

router.get("/login", function(req,res){
    res.render("admin_login")
} )
router.post("/login",async function(req,res){
    let {email,password} =req.body;
    let admin =await adminModel.findOne({email});
    if(!admin) return res.status(400).send("This admin is not available")
    let valid = await bcrypt.compare(password,admin.password);

    if(valid){
        const token = jwt.sign({ email: "admin@example.com", role: "Admin" }, process.env.JWT_KEY);
        res.cookie("token", token);
        res.redirect("/admin/dashboard")
    }
} )


router.get("/products", validateAdmin, async function(req, res) {
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
  const resultObject = result.reduce((acc, item) => {
    const category = Object.keys(item)[0]; 
    
    if (category) {
        acc[category] = item[category] || [];
    } else {
        console.log('Category is undefined for item:', item);
    }
    
    return acc;
}, {});


  res.render("admin_products", { products: resultObject });
});
router.get("/dashboard",validateAdmin,async function(req,res){
    let prodcount  = await productModel.countDocuments();
    let categcount = await categoryModel.countDocuments();
    res.render("admin_dashboard",{prodcount ,categcount})

})

router.get("/logout",validateAdmin ,function(req,res){
    res.cookie("token","");
    res.redirect("/admin/login");
} )
module.exports = router;