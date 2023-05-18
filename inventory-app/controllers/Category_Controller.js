const Category = require("../models/Category");
const Item = require("../models/Item");
const asyncHandler = require("express-async-handler");

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).sort({ name: 1 }).exec();

  res.render("category_list", {
    title: "category_list",
    category_list: allCategories,
  });
});

exports.category_detail_get = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  res.render("category_detail", {
    title: "category detail",
    category: category,
    item_list: categoryItems, 
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send("Not-implemented: category create");
});

exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not-implemented:category create");
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not-implemented: category update " + req.params.id);
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not-implemented:category update " + req.params.id);
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not-implemented: category delete " + req.params.id);
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not-implemented:category delete " + req.params.id);
});
