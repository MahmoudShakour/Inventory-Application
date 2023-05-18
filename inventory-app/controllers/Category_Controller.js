const Category = require("../models/Category");
const Item = require("../models/Item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { findByIdAndUpdate } = require("../models/Category");

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
  res.render("category_form", {
    title: "category_create",
  });
});

exports.category_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("name must be specified"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("description must be specified"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const duplicated = await Category.findOne({ name: req.body.name }).exec();
    const newCategory = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    console.log(errors);
    console.log(duplicated);
    if (!errors.isEmpty() || duplicated) {
      res.render("category_form", {
        title: "category_create",
        category: newCategory,
        error: "enter valid data",
      });
    } else {
      await newCategory.save();
      res.redirect("/catalog/categories");
    }
  }),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  res.render("category_form", {
    title: "category_update",
    category: category,
  });
});

exports.category_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("name must be specified"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("description must be specified"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const updatedCategory = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id,
      });

      await Category.findByIdAndUpdate(
        req.params.id,
        updatedCategory,
        {}
      ).exec();
      res.redirect(updatedCategory.url);
    } else {
      const category = await Category.findById(req.params.id).exec();
      res.render("category_form", {
        title: "category_update",
        category: category,
        error: "invalid data",
      });
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [itemsInCategory, category] = await Promise.all([
    Item.find({ category: req.params.id }).exec(),
    Category.findById(req.params.id).exec(),
  ]);

  res.render("category_delete", {
    title: "category_delete",
    category: category,
    items: itemsInCategory,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [itemsInCategory, category] = await Promise.all([
    Item.find({ category: req.params.id }).exec(),
    Category.findById(req.params.id).exec(),
  ]);
  if (itemsInCategory.length === 0) {
    await Category.findByIdAndRemove(req.params.id);
    res.redirect("/catalog/categories");
  } else {
    res.render("category_delete", {
      title: "category_delete",
      items: itemsInCategory,
      category: category,
    });
  }
});
