const Item = require("../models/Item");
const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  const theitem = await Item.findById(req.params.id)
    .populate("category")
    .exec();
  console.log(theitem);
  if (!theitem) {
    res.send("no such item");
  } else {
    res.render("item_detail", {
      title: "item_detail",
      item: theitem,
    });
  }
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  res.render("item_form", {
    title: "Create item",
  });
});

exports.item_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("name must be specified"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("description must be specified"),
  body("category")
    .trim()
    .isLength({ min: 1 })
    .withMessage("category must be specified"),
  body("price").trim().isNumeric().withMessage("price must be a number"),
  body("number_in_stock")
    .trim()
    .isNumeric()
    .withMessage("number_in_stock must be a number"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = await Category.findOne({ name: req.body.category }).exec();
    const addedItem = new Item({
      name: req.body.name,
      description: req.body.description,
      category: category,
      price: Number(req.body.price),
      number_in_stock: Number(req.body.number_in_stock),
    });

    if (category && errors.isEmpty()) {
      await addedItem.save();
      res.redirect(addedItem.url);
    } else {
      res.render("item_form", {
        title: "Create item",
        error: "can not create the item",
      });
    }
  }),
];

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();
  res.render("item_form", {
    title: item.name,
    item: item,
  });
});

exports.item_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("name must be specified"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("description must be specified"),
  body("category")
    .trim()
    .isLength({ min: 1 })
    .withMessage("category must be specified"),
  body("price").trim().isNumeric().withMessage("price must be a number"),
  body("number_in_stock")
    .trim()
    .isNumeric()
    .withMessage("number_in_stock must be a number"),
  asyncHandler(async (req, res, next) => {
    const [item, category] = await Promise.all([
      Item.findById(req.params.id).populate("category").exec(),
      Category.findOne({ name: req.body.category }).exec(),
    ]);
    console.log(category);
    if (!category) {
      res.render("item_form", {
        title: item.name,
        item: item,
        error: "enter valid data",
      });
    } else {
      const newItem = new Item({
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        number_in_stock: Number(req.body.number_in_stock),
        category: category,
        _id: req.params.id,
      });

      await Item.findByIdAndUpdate(req.params.id, newItem, {});
      res.redirect(newItem.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  res.render("item_delete", {
    title: item.name,
    item: item,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndRemove(req.params.id);
  res.redirect("/catalog/items");
});
