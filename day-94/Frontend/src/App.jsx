import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { MdEdit } from "react-icons/md";

const App = () => {
  const [notes, setNotes] = useState([]);

  // console.log(notes);
  // console.log("hello Integration");
  // this console.log gets printed repeatedly because we are fetching data from backend and setting it in state and whenever we set state the App.jsx component re-renders and whenever App.jsx component re-renders the console.log gets printed, so to avoid this we will use useEffect and pass an empty array as second argument to it, so that it runs only once when the component mounts and not on every re-render.

  function fetchNotes() {
    axios.get("http://localhost:3000/api/notes").then((res) => {
      setNotes(res.data.notes);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { title, description } = e.target.elements;
    axios
      .post("http://localhost:3000/api/notes", {
        title: title.value,
        description: description.value,
      })
      .then((res) => {
        console.log(res);
        
        fetchNotes();
      });
      title.value = "";
      description.value = "";

  }

  function handleDeleteNote(id) {
    axios.delete(`http://localhost:3000/api/notes/${id}`).then((res) => {
      console.log(res);
      fetchNotes();
    });
  } 

  function editNotes(id) {
    const title = prompt("Enter new title");
    const description = prompt("Enter new description");

    axios.patch(`http://localhost:3000/api/notes/${id}`, {
      title,
      description,
    }).then((res) => {
      console.log(res);
      fetchNotes();
    });
  } 

  useEffect(() => {
    fetchNotes();
  }, []);

  // let say we are in frontend and we want to fetch all the notes from backend and show it in frontend for that we will use useEffect and fetch the api to get the data from backend and set it in state and then show it in frontend, to fetch data from backend we use axios.

  return (
    <div>
      <form className="note-create-form" onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Enter Title" />
        <input name="description" type="text" placeholder="Enter Description" />
        <button type="submit">Create Note</button>
      </form>

      <div className="notes">
        {notes.map((note) => {
          return (
            <div className="note" key={note._id}>
              <MdEdit className="edit" onClick={()=>editNotes(note._id)} />
              <h1>{note.title}</h1>
              <p>{note.description}</p>
              <button onClick={()=>{handleDeleteNote(note._id)}}>Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
