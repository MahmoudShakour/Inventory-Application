const express = require("express");
const router = express.Router();

const Item_Controller=require("../controllers/Item_Controller");
const Category_Controller=require("../controllers/Category_Controller");

// item router

router.get("/", Item_Controller.index);

router.get("/items",Item_Controller.item_list);

router.get("/item/create", Item_Controller.item_create_get);

router.post("/item/create", Item_Controller.item_create_post);

router.get("/item/:id", Item_Controller.item_detail_get);

router.get("/item/:id/delete", Item_Controller.item_delete_get);

router.post("/item/:id/delete", Item_Controller.item_delete_post);

router.get("/item/:id/update", Item_Controller.item_update_get);

router.post("/item/:id/update", Item_Controller.item_update_post);


// category router

router.get("/categories", Category_Controller.category_list);

router.get("/category/create", Category_Controller.category_create_get);

router.post("/category/create", Category_Controller.category_create_post);

router.get("/category/:id", Category_Controller.category_detail_get);

router.get("/category/:id/delete", Category_Controller.category_delete_get);

router.post("/category/:id/delete/", Category_Controller.category_delete_post);

router.get("/category/:id/update/", Category_Controller.category_update_get);

router.post("/category/:id/update", Category_Controller.category_update_post);

module.exports = router;
