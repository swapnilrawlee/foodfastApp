const express = require('express');
const { categoryModel, validateCategory } = require('../models/category');
const {validateAdmin} = require('../middlewares/admin_middlewares')
const router = express.Router();

router.post('/create',validateAdmin, async function (req, res) {
 let catergory = await categoryModel.create({
    name: req.body.name,
 })
 res.redirect("back")
});


module.exports = router;
