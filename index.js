import express from "express";
import ejsMate from "ejs-mate";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

// DB
mongoose
  .connect(process.env.MDB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Models
const groceryItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  price: Number,
  priceType: String,
  brand: String,
  size: Number,
  units: String,
  location: String,
  inList: {
    type: Boolean,
    default: false,
  },
  inKitchen: {
    type: Boolean,
    default: false,
  },
  inMeal: {
    type: Boolean,
    default: false,
  },
  kitchenAmount: Number,
});

const GroceryItem = mongoose.model("GroceryItem", groceryItemSchema);

// Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", async (req, res) => {
  const items = await GroceryItem.find({});
  // res.send({ items });
  res.render("index", { items });
});

app.post("/createItem", async (req, res) => {
  // res.send(req.body);
  const content = req.body;
  const item = new GroceryItem(content);
  await item.save();
  res.redirect("/");
});

app.get("/editItem/:id", async (req, res) => {
  // res.send(req.params.id);
  const id = req.params.id;
  const item = await GroceryItem.findById(id);
  res.render("editItem", { item });
});

app.post("/updateItem/:id", async (req, res) => {
  // res.send(req.params);
  const id = req.params.id;
  const content = req.body;
  await GroceryItem.findByIdAndUpdate(id, content);
  res.redirect("/");
});

app.post("/deleteItem/:id", async (req, res) => {
  // res.send(req.params);
  const id = req.params.id;
  const content = req.body;
  await GroceryItem.findByIdAndDelete(id);
  res.redirect("/");
});

app.post("/addToList", async (req, res) => {
  const ids = req.body.inList;

  for (const id of ids) {
    await GroceryItem.findByIdAndUpdate(id, { inList: true });
  }
  res.redirect("/list");
});

app.get("/list", async (req, res) => {
  const listItems = await GroceryItem.find({ inList: true });
  // res.send({ listItems });
  res.render("list", { listItems });
});

app.post("/addToKitchen", async (req, res) => {
  const ids = req.body.inKitchen;
  const listAmounts = req.body.listAmount;
  // res.send(req.body);
  for (const id of ids) {
    const listAmount = listAmounts[id];
    await GroceryItem.findByIdAndUpdate(id, {
      inList: false,
      inKitchen: true,
      kitchenAmount: listAmount,
    });
  }
  res.redirect("/kitchen");
});

app.get("/kitchen", async (req, res) => {
  const kitchenItems = await GroceryItem.find({ inKitchen: true });
  // res.send({ kitchenItems });
  res.render("kitchen", { kitchenItems });
});

app.post("/addToMeal", async (req, res) => {
  const ids = req.body.inMeal;
  // res.send(ids);
  for (const id of ids) {
    await GroceryItem.findByIdAndUpdate(id, { inMeal: true });
  }
  res.redirect("/meal");
});

app.get("/meal", async (req, res) => {
  const mealItems = await GroceryItem.find({ inMeal: true });
  // res.send({ mealItems });
  res.render("meal", { mealItems });
});

const port = 3003 || process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
