const fs = require("fs");
const path = require("path");
const express = require("express");
const generateUniqueId = require("generate-unique-id");
const db = require("./db/db.json");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    console.log("This is data: " + JSON.parse(data));
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const createNotes = [];

  db.push(req.body);
  console.log("This is db: + " + JSON.stringify(db));
  for (var i = 0; i < db.length; i++) {
    const newNote = {
      title: db[i].title,
      text: db[i].text,
      id: generateUniqueId({
        length: 5,
        useLetters: false,
      }),
    };

    createNotes.push(newNote);
  }

  console.log(createNotes);

  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(createNotes)
  );
});
/*
app.post("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const db = JSON.parse(data);
    const newDB = [];

    db.push(req.body);

    for (let i = 0; i < db.length; i++) {
      const newNote = {
        title: db[i].title,
        text: db[i].text,
        id: i,
      };

      newDB.push(newNote);
    }

    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(newDB, null, 2),
      (err) => {
        if (err) throw err;
        res.json(req.body);
      }
    );
  });
});
*/
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
