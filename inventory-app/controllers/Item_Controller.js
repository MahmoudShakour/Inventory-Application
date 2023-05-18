const Item = require("../models/Item");
const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [numOfItems, numOfCategories] = await Promise.all([
    Item.find({}).countDocuments().exec(),
    Category.find({}).countDocuments().exec(),
  ]);

  res.render("index", {
    title: "home",
    numOfItems: numOfItems,
    numOfCategories: numOfCategories,
  });
});

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}).sort({ name: 1 }).exec();

  res.render("item_list", {
    title: "item_list",
    item_list: allItems,
  });
});

exports.item_detail_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  res.render("item_detail", {
    title: "item_detail",
    item: item,
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  console.log("hhha");
  res.send("Not-implemented: item create");
});

exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send("Not-implemented:Item create");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not-implemented: item update" + req.params.id);
});

exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not-implemented:Item update" + req.params.id);
});

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not-implemented: item delete" + req.params.id);
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not-implemented:Item delete" + req.params.id);
});
