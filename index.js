import express from "express";
// import http from "http";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true,
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2019-05-30T18:39:34.091Z",
//     important: false,
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2019-05-30T19:20:14.298Z",
//     important: true,
//   },
// ];

const url = `mongodb+srv://ebrima:quooch8O@cluster0.cdfzb.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url).then((res) => {
  console.log(`connected with no problem`);
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = new mongoose.model("Note", noteSchema);

app.get("/", (req, res) => {
  res.send("<h1>Hello Ebrima</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
    // mongoose.connection.close();
  });
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  //   if (note) {
  //     response.json(note);
  //   } else {
  //     response.status(404).end();
  //   }
  note
    ? response.json(note)
    : response
        .status(404)
        .send("opps! The resource you are looking for does not exist");
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((n) => n.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  });
  // notes = notes.concat(note);
  // response.json(note);
  note.save().then((result) => {
    console.log(`the note is successfully saved`);
    mongoose.connection.close();
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Ebrima, the server is listening on port ${PORT}`);
});
