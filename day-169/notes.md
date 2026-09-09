we will create a project like lovable where the user will give pormpt to AI. and with the basis of that prompt , the AI will create the entire website. 




=> Here, we have an AI chat screen, a Terminal, a place to write the code, and a place to preview the code. The user can talk to AI and can make changes in code, and as the changes in the code happens, the user can check out the output of the code in preview. The user can also access our terminal aswell. As of now , we will use react. 

=> Here, the entire code appears in my browser, but the browser won't be able to show react JSX code on preview. For that, in the backend we will create a container. This container will have node, react_dependencies , react_codebase. The entire react code will run in this backend-container and will give a URL. And with the help of this URL , we can check our react output. 

=> There is one important question, why we can't run the vite-dev-server on backend , because that also has nodejs? why do we need to create a container for this? The answer is that it create lots of complexities, 2nd thing is that our application wont we serving only one user , it will be serving multiple users. So, for multiple users we will create multiple containers. If we did run the code on backend directly , then our single backend server will be busy with multiple users code execution which will lead to performance issues. 

=> This container will have vite-development-server, but it will be served in preview. Any code changes will be reflected on codebase. The terminal will also be connected to this container, any command we run on terminal will run inside container. When we chat with AI, any files that gets edited will happen inside this container.  


to create a terminal, we use node-pty 



//==================================================

So, our entire project has 4 services:

1. Auth
2. Notification
3. AI orchestration
4. Sandbox

Let's start with sandbox

Sandbox will do following things::
- create containers for vite-dev-server
- provide Terminal access
- provide preview URL
- provide the APIs for file updates
- delete containers when not in use


Now, we will do the top 3 things: 

- create containers for vite-dev-server
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
day-168/sandbox/server/src/app.js
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

-> to deploy the server with kubernetes, we need to create an image and finally we will deploy that image.
we will create a dockerfile and .dockerignore file inside the day-168/sandbox/server folder 

---------------------------------
day-168/sandbox/server/dockerfile
---------------------------------

FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]


------------------------------------
day-168/sandbox/server/.dockerignore
------------------------------------

node_modules
.env


=> Now, lets set-up kubernetes, inside day-168, we will create a folder called k8s, and inside this folder, we will have the code for our services
=> now, we will write the rules on how to deploy the sandbox and convert it into service


-----------------------------------
day-168/k8s/sandbox-deployment.yml
-----------------------------------

apiVersion: apps/v1
kind: Deployment
metadata:
  name:  sandbox-deployment
  labels:
    name:  sandbox-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sandbox
  template:
    metadata:
      labels:
        app: sandbox
    spec:
      containers:
      - image:  sandbox:latest
        imagePullPolicy: IfNotPresent
        name:  main-sandbox-container
        resources:
          limits:
            cpu: "500m"
            memory: "400Mi"
          requests:
            cpu: "250m"
            memory: "200Mi"
        livenessProbe: # this is used to check if the container is alive or not, kubernetes will request on the api at the given path "/api/sandbox/health" and if the response is not 200 then it will restart the container, if the container is not ready then it will not forward the request to the container , if its working fine then it will keep running , after 90 seconds of startup it will start checking for the health 
          httpGet:
            path: /api/sandbox/health
            port: 3000
          initialDelaySeconds: 90
          timeoutSeconds: 10
        readinessProbe: # this is used to check if the container is ready to serve the request or not, if not then it will not forward the request to the container, if container is not ready then it will not forward the request to the container
          httpGet:
            path: /api/sandbox/health
            port: 3000
          initialDelaySeconds: 30
          timeoutSeconds: 10      
        ports:
        - containerPort:  3000
          name:  main-sandbox




-> after this we will create a service.yml file to expose the service


----------------------------------
day-168/k8s/sandbox.service.yml
----------------------------------

kind: Service
apiVersion: v1
metadata:
  name:  sandbox-service
spec:
  selector:
    app:  sandbox
  type:  ClusterIP 
  ports:
  - name:  main-sandbox-port
    port:  80
    targetPort:  3000


-> now we will create a ingress rules.

--------------------------------
day-168/k8s/ingress.yml
---------------------------------

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: codespace-ingress
  labels:
    app.kubernetes.io/name: codespace-ingress
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - pathType: Prefix
        path: "/api/sandbox"
        backend:
          service:
            name: sandbox-service
            port: 
              number: 80




=================================


Now, let's look at the architecture.

Inside our main Kubernetes cluster, we will have 4 main application services:

1. Auth Service
2. Notification Service
3. AI Orchestration Service
4. Sandbox Service

Each service will have its own Pod(s) running inside the Kubernetes cluster. These are the **application Pods**, where our actual backend application services are running.

Now, suppose a user sends a request to the **Sandbox Service**.

The Sandbox Service will create a **new, dedicated Pod for that user**. This Pod will contain a container running the user's development environment, such as the **Vite development server**.

Once the user's Pod is created and the Vite dev server is running, the Sandbox Service can provide the user with:

* A **Preview URL** — so the user can see the running application.
* A **Terminal URL** — so the user can interact with the terminal/environment.

Therefore, each user can have their own isolated Sandbox Pod.

For example:

User A → Sandbox Pod A
User B → Sandbox Pod B
User C → Sandbox Pod C

Each user Pod runs independently and contains that user's development environment.

The **Sandbox Service is responsible for managing the lifecycle of these user Pods**. It can create a Pod when the user starts a session, monitor/manage it while the user is working, and delete it when the session is finished.

The user should normally request the Sandbox Service to end the session rather than directly deleting the Kubernetes Pod. The Sandbox Service then handles the deletion.

So, conceptually, we have **two categories of Pods**:

1. **Application Pods** — Pods running our main application services such as Auth, Notification, AI Orchestration, and Sandbox.
2. **User Sandbox Pods** — temporary, isolated Pods created by the Sandbox Service for individual users to run their code.

In short:

Kubernetes Cluster
│
├── Application Pods
│   ├── Auth Service Pod(s)
│   ├── Notification Service Pod(s)
│   ├── AI Orchestration Service Pod(s)
│   └── Sandbox Service Pod(s)
│
└── User Sandbox Pods
├── User A → Vite Dev Server
├── User B → Vite Dev Server
└── User C → Vite Dev Server

The important distinction is that the **Sandbox Service itself is part of our application**, while the **User Sandbox Pods are dynamically created workloads managed by the Sandbox Service**.


====================================================
now, we need to install ingress-controller, for that run the following command::
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml

once we run the above command, our ingress-controller will be installed inside our kubernetes-cluster. 

Now, lets create an image, for that go to the day-168/sandbox/server folder and run the following command::
docker build -t sandbox:latest .

then , go to the day-168 folder and run the following command:: 
- kubectl apply -f ./k8s
the command "kubectl apply -f ./k8s" will create the deployment, service and ingress for our sandbox service.

now, go to the browser and check "http://localhost/api/sandbox/health" , you will see the response from the server.

Till now, we have created a sandbox service but we have not created the functionality to create a new pod for each user. we have created an ingress called "codespace-ingress" , we have created a service called "sandbox-service". So, "codespace-ingress" will forward the request to "sandbox-service" and "sandbox-service" will forward the request to the pod which is running the sandbox service. The "user pods" will have its own ingress and service, so that the user can access the preview URL and terminal URL. The "user pods" will be created by the "sandbox service" when the user requests to start a new session. The "sandbox service" will create a new pod for the user and return the preview URL and terminal URL to the user. The "user pods" will be deleted by the "sandbox service" when the user requests to end the session. Eg: for Pod-1 , we have a pod1-service and pod1-ingress. Pod-1 will have its own preview URL as pod1.preview.localhost and this URL can be accessed by the ingress called pod1-ingress. pod1-ingress will forward the request to pod1-service and pod1-service will forward the request to Pod-1



ABOUT 99% EXPLAINATION IS DONE ABOVE, PLEASE LOOK AT THE VIDEO 2-3 TIMES MORE , WILL GET A BETTER IDEA OF HOW THE SANDBOX SERVICE WILL WORK.



//==========================================//
DAY-169
//==========================================//

In yesterday's code, we had main-pods like Auth, Notification, AI Orchestration and Sandbox. As of now, we have only created the sandbox Service Pod. This Sandbox Service Pod is responsible for creating user pods. The user pods will be created by the sandbox service when the user requests to start a new session. The user pods will have their own ingress and service, so that the user can access the preview URL and terminal URL. 


