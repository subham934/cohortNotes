import React from 'react'
import "./App.css"
import axios from 'axios'
import { useState , useEffect } from 'react'
const App = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('api/users')
      .then(res => {
        console.log(res.data);
        setUsers(res.data);
      })
  }, [])

  return (
    <div>
      <h1>Users</h1>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <li>{user.name}</li>
          </div>
        )
      })}
    </div>
  )
}

export default App