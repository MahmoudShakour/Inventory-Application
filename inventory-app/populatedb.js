#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/Item");
const Category = require("./models/Category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createcategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function itemCreate(name, description, category, price, number_in_stock) {
  const item = new Item({
    name: name,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
  });
  await item.save();
  items.push(item);
  console.log(`Added item: ${name}`);
}

async function createItems() {
  console.log("Adding items");
  const [men,women,electronics]=await Promise.all([
    Category.findOne({name:"men's cloth"}).exec(),
    Category.findOne({name:"women's cloth"}).exec(),
    Category.findOne({name:"electronics"}).exec(),
  ]);
  await Promise.all([
    itemCreate(
      "backpack",
      "Your perfect pack for everyday use and walks in the forest.",
      men._id,
      130,
      6
    ),
    itemCreate(
      "Cotton Jacket",
      "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions",
      men._id,
      340,
      8
    ),
    itemCreate(
      "Leather Moto Biker Jacket",
      "Faux leather jacket for style and comfort",
      women._id,
      3330,
      6
    ),
    itemCreate("nike shoes", "shoes for running", women._id, 3330, 6),
    itemCreate(
      "Samsung 49-Inch monitor",
      "MONITOR with dual 27 inch screen side by side QUANTUM DOT TECHNOLOGY",
      women._id,
      3330,
      6
    ),
    itemCreate(
      "apple monitor",
      "MONITOR from apple with screen side by side QUANTUM DOT TECHNOLOGY",
      electronics._id,
      3330,
      6
    ),
  ]);
}

async function categoryCreate(name, description, id) {
  const category = new Category({
    name: name,
    description: description,
  });
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function createcategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate("men's cloth", "the cloth that men wear", 1),
    categoryCreate("women's cloth", "the cloth that women wear", 2),
    categoryCreate(
      "electronics",
      "electronic games which no-life people play all day",
      3
    ),
  ]);
}
