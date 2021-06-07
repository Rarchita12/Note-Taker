const path = require("path");
const router = require("express").Router();
const generateUniqueId = require("generate-unique-id");
const fs = require("fs");

router.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    // console.log("This is data: " + JSON.parse(data));
    res.json(JSON.parse(data));
    //return res.json(JSON.parse(data));
  });
});

router.post("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const db = JSON.parse(data);

    const creatNotes = [];

    db.push(req.body);

    for (let i = 0; i < db.length; i++) {
      const userNote = {
        title: db[i].title,
        text: db[i].text,
        id: generateUniqueId({
          length: 5,
          useLetters: false,
        }),
      };

      creatNotes.push(userNote);
    }

    fs.writeFile(
      path.join(__dirname, "../db/db.json"),
      JSON.stringify(creatNotes, null, 2),
      (err) => {
        if (err) throw err;
        res.json(req.body);
      }
    );
  });
});

router.delete("/api/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const db = JSON.parse(data);
    const deletesNotes = [];

    for (let i = 0; i < db.length; i++) {
      if (db[i].id != id) {
        const copyNote = {
          title: db[i].title,
          text: db[i].text,
          id: generateUniqueId({
            length: 5,
            useLetters: false,
          }),
        };

        deletesNotes.push(copyNote);
      }
    }

    fs.writeFile(
      path.join(__dirname, "../db/db.json"),
      JSON.stringify(deletesNotes, null, 2),
      (err) => {
        if (err) throw err;
        res.json(req.body);
      }
    );
  });
});

module.exports = router;
