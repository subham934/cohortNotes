In AWS, we have VPC = Virtual Private Cloud. It is a private network that is isolated from the public internet.

- Netflix has its own VPC.
- JioHotstar has its own VPC.
- Flipkart has its own VPC.

- there are N number of server that Netflix is using, and all this server is inside one VPC, and  the database will also be inside that VPC

- similarly JioHotstar will also have its own VPC and will have N number of servers inside that VPC and  the database will also be inside that VPC

- for the security purpose, we cannot connect to the database directly from the internet, so we have to connect to the server first and then from the server to the database

- since all the server and database will be inside the VPC, they can connect to each other directly without any restriction.

- JioHotstar ka jo VPC hai, uske andar ka resource agar Netflix k koi bhi resource, jo ki dusre VPC k andar hai, usko access karna chahta hai, toh woh nahi hoga. Server apne VPC k kisi bhi resource ko access kar sakta hai, usme koi problem nahi hai, but ek VPC se dusre VPC ko access karna hai, toh wo default mei nahi hota hai.


//=================================================

AWS = It's a cloud provider.
-> agar humko AWS use karna hai, toh humko sabse pehle VPC use karna padega

In VPC we have 2 types of subnets:

1. Public Subnet: It is a subnet that is connected to the internet. Agar hum kuch bhi cheez public subnet k ander rakhte hain toh wo Internet k through access kiya ja sakta hain.

2. Private Subnet: It is a subnet that is not connected to the internet.

-> server generally stays in public subnet and the database stays in Private subnet.



//===================================================

ALB(Application Load Balancer) = jab hamari application kafi badi ho jati hain, jaha pe ak server uska load nahi utha sakta, tab hum multiple server use karte hain us application ko host karne k liye.

-> inside AWS, we have VPC, in VPC we have Public subnet which has our server, apart from this we have "Internet Gateway"

-> The role of "Internet Gateway" is "jo bhi traffic public subnet se aa rha hai ya public subnet k taraf ja rha hai, usko manage karna"

-> VPC ak isolated network hain. Jo internet ka traffic hain wo directly VPC mein nahi aa sakta, wo aata hain "Internet Gateway" se hoke

-> "Internet Gateway" internet ka traffic VPC k andar lata hain.

-> ALB (Application Load Balancer) = Jo request internet se aati hai, wo jati hain ALB k through. ALB traffic ko manage karta hain aur usko servers tak pahuchata hain. Agar humare pass multiple server hain, toh request kaun si server ko jayegi, ye decide karta hain ALB taki server pe load barabar distributed ho jaye.

-> ALB is inside VPC, Jo InternetGateway hain wo internet aur VPC ko connect karta hain, aur phir jo bhi traffic aata hain, wo ALB k through servers main distribute ho jata hain. 

-> Round Robin se decide hota hai ki ALB kis server pe request bhejegi

//===================================================

Security Group = Security Group firewall ki tarah act karta hain, aur ye decide karta hain ki kaun se traffic ko VPC k andar aane dena hain aur kaun se traffic ko VPC k bahar jane dena hain.

-> jo ALB hain, wo jitni bhi http request aati hain, unko wo 80 port pe listen karta hain aur jitni bhi request https hoti hain unki 443 port pe listen karta hain.

-> generally, server jo hai wo port 3000 pe listen karte hain. 

-> Jo Security Group hain, uska kaam rehta hain ki kaunsi protocol ka trafic kis port pe allow hain, jab hum SecurityGroup banate hain, toh waha pe rule likhna padta hain, "allow traffic from Internet to PORT:80 ", toh kyunki humne bus ak hi rule likha hain, toh bus port 80 pe hi trafic aayega ALB tak. similarly for server jo  port 3000 pe listen karte hain, "allow traffic from internet to port 3000"

Target Group : list of resources to send traffic. ALB k pass request aati hain, wo alag alag server pe request bhej deta hain, toh lekin ALB ko kaise pata chalta hain ki wo kaun kaun se server pe request bhej sakta hain, ye batata hain target groups. TG ak list maintain karte hain, jinke pass ALB aage jake traffic ko forward kar sakte hain. 

//====================================

ECR vs ECS

ECR = Elastic Container Registry. ECR ak private registry hain, jaha pe hum apni docker images ko store karte hain.

ECS = Elastic Container Service. ECS ak orchestrator hain, jo containers ko manage karta hain.


//===================================================

now , let go to frontend and we will run "npm run build", which will give a "dist" folder, move this folder to backend and rename it as "public", and make below changes in server.js


-----------
server.js
-----------
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Log HTTP requests
app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK!',
  });
});

app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'Dave' },
  ];
  res.status(200).json(users);
});

app.get('*name', (req, res) => {
  res.sendFile('/public/index.html', { root: __dirname });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

=> run the code in backend with `npx nodemon server.js`


frontend source code
       ↓
npm run build
       ↓
production build
       ↓
dist/
       ↓
HTML + CSS + JS + assets

dist is not your frontend application source code anymore.

It is the production-ready output of the frontend.


// now , if we go to localhost:3000, The backend Express server is now serving both the frontend's static production files and the backend's API endpoints.


//===================================================
# Docker Multi-Stage Build — Frontend + Backend

## 1. Our Application Has Two Parts

Our project contains two separate applications:

```text
day-161/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
│
└── backend/
    ├── server.js
    ├── package.json
    ├── Dockerfile
    └── .dockerignore
```

The `frontend` contains our React/Vite application, while the `backend` contains our Express server.

Because they are two separate applications, we can create separate Docker images for them.

```text
frontend/Dockerfile
        ↓
   Frontend Image
        ↓
 Frontend Container
```

and:

```text
backend/Dockerfile
        ↓
   Backend Image
        ↓
 Backend Container
```

This architecture is completely valid if we want to run the frontend and backend in separate containers.

However, in our case, we want the **backend Express server to serve both the backend APIs and the frontend production build**.

Our goal is therefore:

```text
Frontend Production Build
          +
Backend Application
          ↓
     One Final Image
          ↓
     One Container
```

---

# 2. First, Build the Frontend

During development, our frontend contains the original source code:

```text
frontend/
│
├── src/
├── components/
├── package.json
└── ...
```

This is the **frontend source code**.

When we are ready for production, we run:

```bash
npm run build
```

The frontend build tool takes our source code and creates a production build.

For example:

```text
frontend/
│
├── src/
├── package.json
│
└── dist/
    ├── index.html
    └── assets/
        ├── index-abc123.js
        └── index-xyz456.css
```

The important flow is:

```text
Frontend Source Code
        ↓
    npm run build
        ↓
Frontend Production Build
        ↓
       dist/
```

The `dist` folder is **not the original frontend source code anymore**.

It contains the production-ready files required by the browser:

```text
HTML
CSS
JavaScript
Images
Other assets
```

Therefore:

> `dist` = production output/build of the frontend.

---

# 3. Why Do We Move `dist` Into the Backend?

Our Express server contains:

```js
app.use(express.static('public'));
```

This tells Express to serve static files from the `public` directory.

Therefore, we want the frontend production build to be inside:

```text
backend/public/
```

So manually, we do:

```text
frontend/
    │
    │ npm run build
    ↓
  dist/
    │
    │ manually copy/move
    ↓
backend/public/
```

After doing this, our backend looks like:

```text
backend/
│
├── server.js
├── package.json
│
└── public/
    ├── index.html
    └── assets/
        ├── index-abc123.js
        └── index-xyz456.css
```

Now the `backend` directory contains:

```text
Backend Application
        +
Frontend Production Build
```

---

# 4. What Is Express Doing Now?

Our Express server is now responsible for two things:

### Backend API requests

For example:

```text
GET /api/users
        ↓
Backend API
```

Express handles this using:

```js
app.get('/api/users', ...)
```

### Frontend requests

If the browser requests:

```text
GET /
```

Express can serve:

```text
public/index.html
```

The browser can then request files such as:

```text
/assets/index-abc123.js
/assets/index-xyz456.css
```

and Express serves them from:

```text
public/assets/
```

Therefore:

```text
                    Express Server
                         │
             ┌───────────┴───────────┐
             │                       │
          /api/*                    /*
             │                       │
             ↓                       ↓
       Backend APIs          Frontend Production
                                Files from
                                public/
```

So in production, we do not need a separate frontend development server such as the Vite development server.

We only need the **frontend production build**, which is served by Express.

---

# 5. The Problem With This Approach

At first, this looks perfectly fine.

But there is a problem.

Suppose we make a change to:

```text
frontend/src/App.jsx
```

For example:

```text
"Hello World"
```

becomes:

```text
"Hello Everyone"
```

Our existing:

```text
backend/public/
```

still contains the **old frontend production build**.

Why?

Because `backend/public` was generated from the previous `npm run build`.

The source code changed, but the production build has not automatically changed.

Therefore, we have to repeat the entire process.

---

# 6. The Manual Process

Every time the frontend changes, we have to manually do the following.

### Step 1 — Go to the frontend

```bash
cd frontend
```

### Step 2 — Build the frontend

```bash
npm run build
```

This generates a new:

```text
frontend/dist/
```

### Step 3 — Replace the old production build

The backend currently contains:

```text
backend/public/
```

which contains the previous frontend build.

We need to replace it with the newly generated `dist`.

### Step 4 — Copy the new `dist`

```text
frontend/dist/
       ↓
backend/
```

### Step 5 — Rename it if necessary

```text
dist
 ↓
public
```

So the backend becomes:

```text
backend/
│
├── server.js
├── package.json
└── public/
    ├── index.html
    └── assets/
```

### Step 6 — Build the Docker image again

Only after updating `backend/public` do we build the backend Docker image.

### Step 7 — Run the container

Finally, we run the newly created container and test the application.

---

# 7. Complete Manual Workflow

Every time we make a frontend change:

```text
Make Frontend Change
        ↓
Go to frontend
        ↓
npm run build
        ↓
New dist/ is generated
        ↓
Copy dist → backend/
        ↓
Replace old public/
        ↓
Build Docker Image
        ↓
Run Container
        ↓
Test Application
```

This process works.

The problem is that **we have to manually perform all these steps every time the frontend changes.**

---

# 8. Why Is the Process Manual and Bad?

The individual steps are not difficult.

The problem is that **the developer has to remember and perform every step manually**.

Imagine making 20 frontend changes.

We may repeatedly have to do:

```text
npm run build
      ↓
copy dist
      ↓
replace public
      ↓
build Docker image
      ↓
run container
```

This creates several problems.

We could:

* Forget to run `npm run build`.
* Accidentally use an old `dist` folder.
* Forget to replace the old `public` folder.
* Copy the files into the wrong directory.
* Build the Docker image before copying the latest frontend build.
* Forget one of the steps entirely.
* Force every developer on the team to remember the same manual procedure.

It becomes even more problematic in **CI/CD**.

We don't want a human developer to manually:

```text
Build frontend
      ↓
Copy files
      ↓
Move files
      ↓
Rename folders
      ↓
Build Docker image
```

A production deployment should be **repeatable and automated**.

Therefore:

> **The manual process works, but it is repetitive, error-prone, and difficult to automate.**

This is the problem Docker can solve.

---

# 9. Automating the Process With Docker

Instead of manually doing:

```text
YOU
 ↓
npm run build
 ↓
copy dist
 ↓
move it into backend
 ↓
rename it
 ↓
build Docker image
```

we want Docker to do everything automatically:

```text
DOCKER BUILD
     ↓
Build Frontend
     ↓
Generate dist/
     ↓
Take dist/
     ↓
Copy it into public/
     ↓
Prepare Backend
     ↓
Create Final Production Image
```

Now the developer only needs to run the Docker build.

Docker handles the complete process.

---

# 10. Why Do We Need a Root Dockerfile?

Instead of using only the Dockerfiles inside `frontend` and `backend`, we create another Dockerfile at the root:

```text
day-161/
│
├── Dockerfile
├── .dockerignore
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── backend/
    ├── server.js
    ├── package.json
    └── ...
```

The root Dockerfile is needed because it needs to work with **both parts of the application**:

```text
frontend/
backend/
```

The root Dockerfile will coordinate the complete production build.

Conceptually, it tells Docker:

```text
1. Build the frontend.
2. Generate the frontend production build.
3. Take the generated dist folder.
4. Prepare the backend.
5. Copy the frontend production build into public.
6. Create the final production image.
```

This is where **Docker multi-stage builds** become useful.

---

# 11. Docker Multi-Stage Build

We can divide the Docker build into multiple stages.

In our case, we have:

```text
Stage 1
Frontend Builder
```

and:

```text
Stage 2
Final Application Image
```

Conceptually:

```text
                 Dockerfile
                     │
          ┌──────────┴──────────┐
          │                     │
       Stage 1               Stage 2
Frontend Builder          Final Application
          │                     │
    npm run build          Backend setup
          │                     │
        dist/                   │
          │                     │
          └──────────┬──────────┘
                     ↓
                Final Image
                     │
             ┌───────┴───────┐
             │               │
        Backend App    Frontend Build
             │               │
             └───────┬───────┘
                     ↓
                One Container
```

The important point is:

> **Docker is now automatically performing the work that we previously had to perform manually.**

Previously:

```text
YOU
 ↓
npm run build
 ↓
copy dist
 ↓
move it to backend
 ↓
rename it
 ↓
build Docker image
```

Now:

```text
DOCKER
 ↓
Build frontend
 ↓
Generate dist
 ↓
Copy dist → public
 ↓
Prepare backend
 ↓
Create final image
```


-------------
.dockerignore
-------------
.env
node_modules

----------
dockerfile
----------

# Stage 1: Build the frontend
FROM node:20-alpine AS frontend_builder

WORKDIR /app

COPY ./frontend/package*.json /app
# we are copying the frontend's package.json and package-lock.json inside /app

RUN npm install
# now we have node modules inside /app

COPY ./frontend /app
# now we copy the frontend code to /app

RUN npm run build
# now we have the production build of frontend inside /app/dist


# Stage 2: fullstack image
FROM node:20-alpine

WORKDIR /app

COPY ./backend/package*.json /app
# we are copying the backend's package.json and package-lock.json inside /app

RUN npm install
# now we have node modules inside /app

COPY ./backend /app
# now we copy the backend code to /app

COPY --from=frontend_builder /app/dist /app/public
# now we copy the production build of frontend from /app/dist to final image's /app/public

EXPOSE 3000
# we are exposing the port 3000

CMD ["node", "server.js"]
# now we are running the backend server




---

# 12. Stage 1 — Build the Frontend

Our first stage is:

```dockerfile
FROM node:20-alpine AS frontend_builder
```

The important part is:

```text
AS frontend_builder
```

This gives the stage a name:

```text
frontend_builder
```

Then:

```dockerfile
WORKDIR /app
```

Docker uses:

```text
/app
```

as the working directory.

Next:

```dockerfile
COPY ./frontend/package*.json /app
```

This copies the frontend's:

```text
package.json
package-lock.json
```

into `/app`.

Then:

```dockerfile
RUN npm install
```

installs the frontend dependencies.

Next:

```dockerfile
COPY ./frontend /app
```

copies the frontend source code into `/app`.

Finally:

```dockerfile
RUN npm run build
```

runs the frontend production build.

So Stage 1 produces:

```text
Stage 1
│
├── Frontend Source Code
├── node_modules/
└── dist/
    ├── index.html
    └── assets/
```

The important output is:

```text
/app/dist
```

which is our frontend production build.

---

# 13. Stage 2 — Create the Final Application Image

Now we start another stage:

```dockerfile
FROM node:20-alpine
```

This creates the base for our final production image.

Then:

```dockerfile
WORKDIR /app
```

sets `/app` as the working directory.

Next:

```dockerfile
COPY ./backend/package*.json /app
```

copies the backend's package files.

Then:

```dockerfile
RUN npm install
```

installs the backend dependencies.

Next:

```dockerfile
COPY ./backend /app
```

copies the backend source code into the final stage.

At this point, we have our backend.

But we still need the frontend production build.

---

# 14. The Most Important Command

Now we use:

```dockerfile
COPY --from=frontend_builder /app/dist /app/public
```

This command is extremely important.

Let's break it down.

```text
--from=frontend_builder
```

means:

> Go to the Docker stage named `frontend_builder`.

Then:

```text
/app/dist
```

means:

> Take the frontend production build from that stage.

And:

```text
/app/public
```

means:

> Copy it into `/app/public` in the final image.

So:

```text
Stage 1
/app/dist
    │
    │ COPY --from=frontend_builder
    ↓
Stage 2
/app/public
```

This is Docker automatically performing the operation that we previously had to perform manually:

```text
frontend/dist
       ↓
backend/public
```

Therefore, instead of us manually copying the frontend build into the backend, Docker does it automatically during the image build.

---

# 15. What Does the Final Production Image Look Like?

After the Docker build is complete, our final image conceptually looks like:

```text
Final Production Image
│
├── server.js
├── package.json
├── node_modules/
│
└── public/
    ├── index.html
    └── assets/
        ├── index-abc123.js
        └── index-xyz456.css
```

Here:

```text
server.js
    ↓
Backend functionality
```

and:

```text
public/
    ↓
Frontend production build
```

Express serves both:

```text
                     Express
                        │
              ┌─────────┴─────────┐
              │                   │
           /api/*                 /*
              │                   │
              ↓                   ↓
        Backend APIs       Frontend Production
                               Build
```

Therefore, our final production container contains:

```text
Backend Application
        +
Frontend Production Build
```

---

# 16. Do We Need the Frontend Source Code in Production?

No.

This is an important concept.

During development, we have:

```text
frontend/
├── src/
├── components/
├── JSX
├── CSS
└── other development files
```

But during the Docker build:

```text
Frontend Source Code
        ↓
     Stage 1
        ↓
    npm run build
        ↓
      dist/
        ↓
     Stage 2
        ↓
     public/
```

The final production image only needs the **production build**.

Therefore, we don't need the original React/Vite development environment in the final production image just to serve the website.

We need:

```text
Backend Application
        +
Frontend Production Build
```

not:

```text
Backend Application
        +
Frontend Development Source Code
```

---

# 17. The Complete Picture

The entire process can be understood like this:

```text
                         PROJECT
                            │
             ┌──────────────┴──────────────┐
             │                             │
         FRONTEND                       BACKEND
             │                             │
      React/Vite Source                  Express
             │                             │
             │                             │
             └──────────────┬──────────────┘
                            │
                       Docker Build
                            │
                            ↓
                  ┌───────────────────┐
                  │      STAGE 1      │
                  │ Frontend Builder  │
                  │                   │
                  │ npm run build     │
                  │       ↓           │
                  │      dist/        │
                  └─────────┬─────────┘
                            │
                            │ COPY --from
                            ↓
                  ┌───────────────────┐
                  │      STAGE 2      │
                  │                   │
                  │ Backend           │
                  │       +           │
                  │ Frontend dist     │
                  │       ↓           │
                  │     public/       │
                  └─────────┬─────────┘
                            │
                            ↓
                     FINAL IMAGE
                            │
                            ↓
                       ONE CONTAINER
                            │
                   ┌────────┴────────┐
                   │                 │
              Backend APIs     Frontend Build
                   │                 │
                   └────────┬────────┘
                            ↓
                      Express :3000
```

---

# 18. The Main Idea to Remember

The reason we create a **root Dockerfile** is not simply:

> "Because we have a frontend and a backend."

The real reason is:

> **We want Docker to coordinate the entire production build process.**

Instead of manually:

```text
Build frontend
     ↓
Generate dist
     ↓
Copy dist
     ↓
Move it into backend
     ↓
Rename it to public
     ↓
Build backend image
```

we want Docker to automatically:

```text
Docker Build
     ↓
Build frontend
     ↓
Generate dist
     ↓
Copy dist → public
     ↓
Prepare backend
     ↓
Create final production image
```

Therefore:

> **Docker multi-stage builds allow us to use one stage to build the frontend and another stage to create the final production image containing the backend and the frontend's production build.**

The final result is:

```text
                 FINAL CONTAINER
                       │
              ┌────────┴────────┐
              │                 │
         Backend App      Frontend Build
              │                 │
              └────────┬────────┘
                       ↓
                  Express Server
                       │
                  Port 3000
```

And that is the complete mental model of **why we need the root Dockerfile and why the multi-stage Docker build is useful in this architecture**.

=> now , we will run the docker file, which will create frontend and backend inside a single image, and we name it as "fullstack:latest"

docker build . -t fullstack:latest

=> now , we will run the docker image and map the port 3000 of container to port 8080 of host

docker run -p 8080:3000 fullstack:latest

=> now , we can access the frontend at http://localhost:8080 and backend at http://localhost:8080/api/users



//===================================================
