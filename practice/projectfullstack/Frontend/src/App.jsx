import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [notes, setNotes] = useState([]);

  // console.log("Hello Integration");

  function fetchNotes() {
    axios.get("http://localhost:3000/api/notes").then((res) => {
      setNotes(res.data.notes);
    });
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const { title, description } = e.target.elements;
    // console.log(title.value, description.value);
    axios
      .post("http://localhost:3000/api/notes", {
        title: title.value,
        description: description.value,
      })
      .then((res) => {
        console.log(res.data);
        fetchNotes();
        title.value = "";
        description.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDeleteNote(noteId) {
    axios.delete(`http://localhost:3000/api/notes/${noteId}`).then((res) => {
      console.log(res.data);
      fetchNotes();
    });
  }

  return (
    <>
      <form className="note-create-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Enter Title" />
        <input type="text" name="description" placeholder="Enter Description" />
        <button type="submit">Submit</button>
      </form>

      <div className="notes">
        {notes.map(function (note) {
          return (
            <div className="note" key={note._id}>
              <h2>{note.title}</h2>
              <p>{note.description}</p>
              <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;
