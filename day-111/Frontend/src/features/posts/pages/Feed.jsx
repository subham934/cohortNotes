import React, { useEffect } from "react";
import "../style/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hook/userPost";
import Nav from "../../shared/components/Nav";
const Feed = () => {

    const { feed, loading, handleGetFeed, handleLike, handleUnlike} = usePost();

    useEffect(() => {
        handleGetFeed()
    },[])

    if(loading || !feed) {
        return <h1>Loading...</h1>
    }
    
  return (
    <main className="feed-page">
      <Nav/>
      <div className="feed">
        <div className="posts">
          {
            feed.map(post => {
                return <Post key={post._id} user={post.user} post={post} loading={loading} handleLike={handleLike} handleUnlike={handleUnlike} />
            })
          }
        </div>
      </div>
    </main>
  );
};

export default Feed;
