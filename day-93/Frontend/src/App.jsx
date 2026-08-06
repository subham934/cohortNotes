import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [notes, setNotes] = useState([]);

  console.log("render Items");
  // here, the console.log is being printed non-stop because the App.jsx component is re-rendering every time the state is updated with setNotes, which causes the useEffect to run again and fetch the notes again, creating an infinite loop. To fix this, we can use the useEffect hook to fetch the notes only once when the component mounts, by passing an empty dependency array as the second argument to useEffect. This way, the fetch will only happen once and won't cause an infinite loop.

  function fetchNotes() {
    axios
      .get("http://localhost:3000/api/notes")
      .then((response) => {
        setNotes(response.data.notes);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  }

  useEffect(() => {
    fetchNotes();
  }, []); // Add an empty dependency array to run the effect only once on mount

  function handleSubmit(e) {
    e.preventDefault();

    const { title, description } = e.target.elements;
    axios
      .post("http://localhost:3000/api/notes", {
        title: title.value,
        description: description.value,
      })
      .then((response) => {
        console.log(response.data);
        fetchNotes();
      });
  }

  function handleDeleteNote(noteId) {
    axios
      .delete("http://localhost:3000/api/notes/" + noteId)
      .then((response) => {
        console.log(response);
        fetchNotes()
      });
  }

  return (
    <div>
      <form className="note-create-form" onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Enter Title" />
        <input name="description" type="text" placeholder="Enter Description" />
        <button>Create Note</button>
      </form>

      <div className="notes">
        {notes.map((note) => {
          return (
            <div key={note._id} className="note">
              <h1>{note.title}</h1>
              <p>{note.description}</p>
              <button
                onClick={() => {
                  handleDeleteNote(note._id);
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
