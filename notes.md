while we create a website, it's built by a team, this team works on different system and each system has different version of a software. since 3 system has 3 different version of Node.js , some code may work on one but not on another. So, Docker solves this problem. 

=> An Express server has [codebase, dependencies, nodejs, Operating System]

=> Docker make sure that all the 3 system has same environment. Eg: all the 3 person will have Nodejs 20.0 version

=> an Image is a combination of codebase, dependencies, nodejs, operating system.

=> when we execute an image, it is called a container. It is a virtual machine that has all the environment of the image. A container is a running instance of an image.


//=========================================

=> we will create an express server, and convert this express server to image, we will execute this image and it will be container.

=> Install docker desktop.

=> now , we will create an image , to run an express server we need codebase, dependencies, nodejs, operating system. 

=========================
let's create a server.js
=========================

const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World!"
    });
});

app.get("/api/data", (req, res) => {
    const data = {
        id: 1,
        name: "John Doe",
        desc: "This is a description"
    }
    res.status(200).json(data);
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

=========================//
here, we have created a codebase, we have installed dependencies using npm i express, nodejs and OS is also available.

=> now we have to convert this express server to image, we will execute this image and it will be container.


=> for that at first we will create a docker file and delete the node_modules folder.


=======================
dockerfile
=======================
FROM node:20-alpine
# it has nodejs version20 and operating system as alpine

COPY ./package.json .
# copy the package.json to the docker image

COPY ./package-lock.json .
# copy the package-lock.json to the docker image

RUN npm install
# install the dependencies

COPY ./server.js .
# copy the server.js to the docker image
# till now we have not created image, just the explaination over docker file on how to create an image
# to create an image, we have to execute docker build command
# docker build . -t cohort_2
# when we run this above command , our image with name cohort_2 will be created
# now we have to run this image to create a container
# docker run cohort_2
# when we run this above command , our container with name cohort_2 will be created
CMD ["node", "server.js"]
# we write this to start the server
# it is a command that will be executed when the container is started
# it is an array of strings

//================================

now there is a problem, our express server is running inside container, and since its inside container, we can't access it outside container

if we type localhost:3000, we won't be able to access it. for that we will have to map the ports. for that we write as below in the terminal::


docker run -p 8080:3000 cohort_2
=> this command map the host port 8080 to container port 3000
=> now we can access the server at localhost:8080


//===============================


image is immutable, so we can't change the code inside container.

=> docker ps - this command will list all the containers
=> docker ps -a - this command will list all the containers including stopped ones
=> docker stop <container_name or container_id> - this command will stop the container
=> docker start <container_name> - this command will start the container
=> docker restart <container_name> - this command will restart the container
=> docker rm <container_name> - this command will remove the container



//===============================

we have created one more API inside our express server

app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "OK",
        time: Date.now()
    });
});

if we wnat to access it as localhost:8080/api/health, we wont get the result because our container was created with an image which had only two API  / , /api/data

so we have to stop the container and create a new image and then create container from the new image


docker build . -t cohort_2
docker run -p 2000:3000 cohort_2