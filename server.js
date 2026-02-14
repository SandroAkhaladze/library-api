const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Book = require("./models/Book.js");

// Load .env varriables
dotenv.config();

// Initial Express
const app = express();

// JSON-ის დამუშავება და გადაქცევა ობიექტებად
app.use(express.json());

// MongoDB-სთან დაკავშირება
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB-თან დაკავშირება წარმატებულია");
  })
  .catch((error) => {
    console.error("❌ MongoDB-სთან დაკავშირება ვერ მოხერხდა:", error.message);
    process.exit(1);
  });

app.get("/api/v1/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {}
});

app.post("/api/v1/books", async (req, res) => {
  try {
    const { title, author, isAvailable, genre, publishedYear } = req.body;

    // Check if dublicate
    const existingBook = await Book.findOne({ title, author });

    if (existingBook) {
      return res.status(409).json({ error: "Book already exist" });
    }

    const book = await Book.create({
      title,
      author,
      isAvailable,
      genre,
      publishedYear,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log("http://localhost:3030");
});