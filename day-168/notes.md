we will create a project like lovable where the user will give pormpt to AI. and with the basis of that prompt , the AI will create the entire website. 




Here, we have an AI chat screen, a Terminal, a place to writre the code, and a place to preview the code. The user can talk to AI and can make changes in code, and as the changes in the code happens, the user can chekc out the output of the code in preview. The user can also access our terminal aswell. As of now , we will use react. 

Here, the entire code appears in my browser, but the browser wont we able to show react JSX code on preview. For that, in the backend we will create a container. This container will have node, react_dependencies, react_codebase. The entire react code will run in this backend-container and will give a URL. And with the help of this URL , we can check our react output. 

This container will have vite-development-server, but it will be served in preview. Any code changes will be reflected on codebase. The terminal will also be connected to this container, any command we run on terminal will run inside container. When we chat with AI, any files that gets edited will happen inside this container.  


to create a terminal, we use node-pty 



//==================================================

So, our entire project has 4 services:

1. Auth
2. Notification
3. AI orchestration
4. Sandbox

Let's start with sandbox

Sandbox will do following things::
- create containers for vite dev server
- provide Terminal access
- provide preview URL
- provide the APIs for file updates
- delete containers when not in use


Now, we will do the top 3 things: 

- create containers for vite dev server
- provide Terminal access
- provide preview URL



we have a sandbox service, user request to api/sandbox/start, when we call this API, sandbox service will do the following::

- create a new container
- return the preview URL : with this URL, user can see the preview of the code
- return terminal URL: with this URL, we can access our terminal, it is a websocket URL with which we will access the terminal. we will use node-pty

As of now, we will create a sandbox-service with basic service like creating a bare-minimum server with the help of kubernetes, and once the server is created , we will add basic functionality so that the following things are achieved::
- create containers for vite dev server
- provide Terminal access
- provide preview URL


\day-168\sandbox\server> npm i express morgan dotenv mongoose



----------------------------------
day-168/sandbox/server/app/app.js
----------------------------------

import express from "express";
import morgan from "morgan";


const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get("/api/sandbox/health", (req, res) => {
    res.status(200).json({
        message: "Sandbox API is healthy",
        status: "ok"
    })
})

export default app;




------------------------
sandbox/server/server.js
------------------------


import app from "./src/app.js"

app.listen(3000, ()=>{
    console.log(`Sandbox server is running on port ${3000}`)
})

=> making some changes in package.json file to run the server with nodemon
=> inside the day-168/sandbox/server run "npm run dev" , then go to browser and check "http://localhost:3000/api/sandbox/health" , you will see the response from the server.


-> now we will deploy with kubernetes, for that we will create a dockerfile and then we will create a deployment.yml file and then we will create a service.yml file and finally we will create a ingress.yml file. we will also see how this server create a pod/container
-> to deploy the server with kubernetes, we need to create an image and for that we need to create a dockerfile and .dockerignore file. we will create a dockerfile and .dockerignore file inside the day-168/sandbox/server folder.


----------------------------
sandbox/server/dockerfile
----------------------------

FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]


-------------------------
sandbox/server/.dockerignore
-------------------------

node_modules
.env


=> Now, lets set-up kubernetes

