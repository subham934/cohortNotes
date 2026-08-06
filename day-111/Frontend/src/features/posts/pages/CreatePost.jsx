import React, { useRef, useState } from "react";
import "../style/createpost.scss";
import { usePost } from "../hook/userPost";
import {useNavigate} from 'react-router'

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const postImageInputFieldRef = useRef(null);
    const navigate = useNavigate();
  const { loading, handleCreatePost } = usePost();
  async function handleSubmit(e) {
    e.preventDefault();

    // now, from the postImageInputFieldRef, we can access the value of the input:file , here we have accessed the first file
    const file = postImageInputFieldRef.current.files[0];

    await handleCreatePost(file, caption);

    navigate("/");
  }

  if (loading) {
    return (
      <main>
        <h1>Creating Post</h1>
      </main>
    );
  }

  return (
    <div>
      <main className="create-post-">
        <div className="form-container">
          <h1>Create Post</h1>
          <form onSubmit={handleSubmit}>
            <label className="post-image-label" htmlFor="postImage">
              Select Image
            </label>

            <input
              ref={postImageInputFieldRef}
              type="file"
              id="postImage"
              hidden
              name="postImage"
              id="postImage"
            />

            {/* we can hide the input:file part, as we have used label, as both are connected with #postImage and because of that , it will do the same thing */}

            {/* we have given reference to the input:file part as ref={postImageInputFieldRef}, so that we can access its value */}

            {/* we can have select multiple files in the input:file, only we need to provide the html attribute like "multiple" jsut like "hidden" */}
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              type="text"
              placeholder="Enter Caption"
              name="caption"
              id="caption"
            />

            <button className="button primary-button">Create Post</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
