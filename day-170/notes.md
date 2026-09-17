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

In yesterday's code, we had main-pods like Auth, Notification, AI Orchestration and Sandbox. As of now, we have only created the sandbox Service Pod. This Sandbox Service Pod will be responsible for creating user pods. The user pods will be created by the sandbox service when the user requests to start a new session. The user pods will have their own ingress and service, so that the user can access the preview URL and terminal URL. 


Today, our architecture will be abit different, we wont create ingress all the time, instead of that, we will create a POD, which will have the vite-development-server, and along with that, we will also have a SERVICE to take the request to the POD. Now, the question arises that if there is no ingress, then how will the traffic reach SERVICE? we need ingress , so that the traffic coming from outside(from user which is outside the cluster) can be forwarded to the service. User cann't directly access the service, for that we need ingress. So the question is  how will the traffic reach SERVICE?


Answer:
Each user-pod has a preview URL, i.e., pod1.preview.localhost and pod2.preview.localhost, we will create an ingress which will look like "*.preview.localhost", if the user request for pod1.preview.localhost, then the ingress " *.preview.localhost" will handle it, it wont directly send the request to the service. The request such as  pod1.preview.localhost and pod2.preview.localhost will reach " *.preview.localhost", this ingress will send the request to "router server", this "router server" will see read the request and will see that the request is for pod1.preview.localhost, so it will forward the request to pod1-service, and pod1-service will forward the request to pod1-pod. Similarly, if the request is for pod2.preview.localhost, then the "router server" will forward the request to pod2-service, and pod2-service will forward the request to pod2-pod. This router-server is an express server. This router-server will also have a service called router-service, so that the ingress can forward the request to router-service, and router-service will forward the request to router-server. 


Yesterday, we have only created codespace-ingress, which was forwarding the request to sandbox-service, and sandbox-service was forwarding the request to sandbox-pod. So, these are the 3 things, i.e., codespace-ingress, sandbox-service and sandbox-pod which we have created yesterday. Today, we will setup the router-server and also, we will develop a functionality where the sandbox-service will create a new pod for the user, and this new pod will have its own service, and the router-server will forward the request to that service. 



//==========================================

Lets start with the sandbox-service where we will give a power to sandbox-service to create a new pod for the user and service. 

we know that user-pod will have react's vite-development-server, for that we will need image . Any pod has a container, and this container lets you run your application and for that we will need an image.

Inside sandbox folder, we will create a new folder called "template"

\day-169\sandbox\template > npm create vite .

Here, our user-pod will have vite-development-server, so we will create a react project with vite. We will create a react project with vite, and then we will create an image of that react project, and this image will be used by the sandbox-service to create a new pod for the user. Now, inside the template folder we have the react-vite code and we'll convert this code into image, for that lets create a dockerfile and .dockerignore . 


-----------------------------------
day-169>sandbox>template>dockerfile
-----------------------------------
FROM node:20-alpine

WORKDIR /workspace

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]




--------------------------------------
day-169>sandbox>template>.dockerignore
--------------------------------------

node_modules
.env

we'll also need to make some changes in vite.config.js file::


--------------------------------------
day-169>sandbox>template>vite.config.js
--------------------------------------

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true, // the vite-deployment-server that on user-pod, runs on localhost:5173, the request that comes to this pod is from pod1.preview.localhost, so the request pod1.preview.localhost is different from localhost:5173, so we need to allow the request from pod1.preview.localhost, so we set allowedHosts: true, so that the request from pod1.preview.localhost is allowed.

  }
})


now , lets create an image for this::

day-169>sandbox>template > docker build -t template:latest .

now, an image will be created, the name of this image is `template`, so indide the user-pod, we will have vite-development-server running. Now, lets write a code so that sandbox-service can create a new pod for the user. For that we have a package called "kubernetes-client" which will help us to create a new pod for the user.

we'll install the following packages inside sandbox/server folder:
npm i @kubernetes/client-node
npm i uuid


now , inside sandbox/server/src folder , we will create one more folder called "kubernetes" 


---------------------------------------
sandbox/server/src/kubernetes/config.js
---------------------------------------


import * as K8sApi from '@kubernetes/client-node';

const kc = new K8sApi.KubeConfig();
kc.loadFromDefault();

export const k8sCoreV1Api = kc.makeApiClient(K8sApi.CoreV1Api);

// with the help of k8sCoreV1Api we can create a pod, and service.




=> now we'll write a code on how to create a pod. To create a pod we will write code inside pod.js




---------------------------------------
sandbox/server/src/kubernetes/pod.js
---------------------------------------

import { k8sCoreV1Api } from './config.js';

export async function createPod(sandboxId) {
  const podManifest = {
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: 'sandbox',
        sandboxId: sandboxId,
      },
    },
    spec: {
      containers: [
        {
          image: 'template', // this is the image name called "template"
          imagePullPolicy: 'IfNotPresent',
          name: 'sandbox-container',
          ports: [{ containerPort: 5173, name: 'http' }],
          resources: {
            limits: { cpu: '500m', memory: '1Gi' },
            requests: { cpu: '250m', memory: '500Mi' },
          },
        },
      ],
    },
  };

  const response = await k8sCoreV1Api.createNamespacedPod({
    namespace: 'default',
    body: podManifest,
  });

  return response;
}

//when we execute this code, we will create a pod which will have a container, and inside this container, the image called "template" will be running


---------------------------------------------------

now that POD is created, still udhar tak request nahi pahooch sakti hai, so we need to create a service for that pod, for that we will write a code inside service.js


---------------------------------------------------
sandbox/server/src/kubernetes/service.js
---------------------------------------------------

import { k8sCoreV1Api } from "./config.js";

export const createService = async (sandboxId) => {
    const serviceManifest = {
        metadata: {
            name: `sandbox-service-${sandboxId}`,
            labels: {
                app: 'sandbox',
                sandboxId: sandboxId
            }
        },
        spec: {
            selector: {
                app: 'sandbox',
                sandboxId: sandboxId
            },
            ports: [
                {
                    name: "http",
                    port: 80,
                    targetPort: 5173,
                    protocol: "TCP"
                }
            ],
            type: "ClusterIP"
        }
    }
    
    const response = await k8sCoreV1Api.createNamespacedService({
        namespace: 'default',
        body: serviceManifest
    })

    return response;
}



now, lets make changes in app.js file, so that when user requests to start a new session, we will create a new pod and service for that user. For that we will create a new API called "/api/sandbox/start" , when user requests to this API, we will create a new pod and service for that user.



-------------------------
sandbox/server/src/app.js
-------------------------

import express from "express";
import morgan from "morgan";
import {createPod} from "./kubernetes/pod.js";
import {createService} from "./kubernetes/service.js";
import {v7 as uuid} from "uuid";

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

app.post("/api/sandbox/start", async (req, res) => {
    const sandboxId = uuid() // with this we generate a sandbox id

    await Promise.all([
        createPod(sandboxId),
        createService(sandboxId)
    ]) // with this we create a new pod and service for that user

// we have created an API called /api/sandbox/start, when user requests to this API, we generate a sandboxId and with this Id we will create a POD and a SERVICE for that user. The POD will have the image called "template" which we created earlier, and this image will have the vite-development-server running. The SERVICE will forward the request to the POD, so that user can access the preview URL and terminal URL. The preview URL will be like "sandboxId.preview.localhost" and the terminal URL will be like "sandboxId.terminal.localhost". The ingress will forward the request to the service, and the service will forward the request to the pod.


    res.status(200).json({
        message: "Sandbox environment created successfully",
        status: "ok",
        sandboxId,
        previewUrl : `http://${sandboxId}.preview.localhost`
    })

})

export default app;



=> Now, we will again create a new image for the sandbox-service, for that go to the day-169/sandbox/server folder and run the following command::
docker build -t sandbox:latest .

now , our image is created, go to D:\cohort\day-169\ and run the following command::
kubectl apply -f ./k8s


we will get the below response::
ingress.networking.k8s.io/codespace-ingress created
deployment.apps/sandbox-deployment created
service/sandbox-service created



we need to install ingress-controller, for that run the following command::
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml


now, go to browser and type http://localhost/api/sandbox/health, you will get the response "Sandbox API is healthy"


now, lets go to postman and give a POST request to http://localhost/api/sandbox/start, we will get error


To check the error thats coming, we will check the logs of the sandbox-service pod, for that run the following command::

kubectl logs deployment/sandbox-deployment -f

Error: HTTP-Code: 403
Message: Unknown API Status Code!
=> this is a forbidden error, we have sandbox-service and we with this snadbox-service we are trying to create a new pod and service, the entire process is inside the kubernetes cluster, but by default, kubernetes cluster doesn't allow any pod to create a new pod or service, for that we need to give some permissions to the sandbox-service pod, so that it can create a new pod and service. Let's create a file called "rbac.yml" inside the day-169/k8s folder, this file will have the rules for the sandbox-service pod, so that it can create a new pod and service. 


--------------------
day-169/k8s/rbac.yml
--------------------

apiVersion: v1
kind: ServiceAccount
metadata:
  name:  resource-manager # this is the name of the service account

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: resource-manager
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch", "create", "delete"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: resource-manager-binding
subjects:
- kind: ServiceAccount
  name: resource-manager
roleRef:
  kind: Role
  name: resource-manager
  apiGroup: rbac.authorization.k8s.io


we are creating a service account called "resource-manager" and we are giving this service account the permission to "get", "list", "watch", "create", "delete" pods and services. Now, we need to give this service account to the sandbox-service pod, for that we will make some changes in the sandbox-deployment.yml file.


//==========================================

----------------------------------
day-169/k8s/sandbox-deployment.yml
----------------------------------


apiVersion: apps/v1
kind: Deployment
metadata:
  name: sandbox-deployment
  labels:
    name: sandbox-deployment
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
    # - this one , we have created now called serviceAccountName, this will give the permission to the sandbox-service pod to create a new pod and service
      serviceAccountName: resource-manager # this is the name of the service account that we created in the rbac.yml file, this will give the permission to the sandbox-service pod to create a new pod and service   
      containers:
        - image: sandbox:latest
          imagePullPolicy: IfNotPresent # this is used to check if the image is present in the local machine or not, if not then it will pull the image from the docker hub, if yes then it will use the local image
          name: main-sandbox-container
          resources:
            limits:
              cpu: '500m'
              memory: '400Mi'
            requests:
              cpu: '250m'
              memory: '200Mi'
          livenessProbe: # this is used to check if the container is alive or not, kubernetes will request on the api at the given path "/api/sandbox/health" and if the response is not 200 then it will restart the container, if the container is not ready then it will not forward the request to the container , if its working fine then it will keep running , after 90 seconds of startup it will start checking for the health
            httpGet:
              path: /api/sandbox/health # this is the path where the health check will be performed, if the response is not 200 then it will restart the container
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
            - containerPort: 3000
              name: main-sandbox


Now, we have created a service account called "resource-manager" , with this , the sandbox-deployment pod will have the permission to create a new pod and service. Now, we need to apply the changes in the kubernetes cluster, for that go to the day-169 folder and run the following command::
kubectl apply -f ./k8s

wait for few minutes so that the sandbox-deployment pod is restarted and the new changes are applied. Now, go to postman and give a POST request to http://localhost/api/sandbox/start, you will get the response with sandboxId and previewUrl. 


so, when reqeusting on postman with POST http://localhost/api/sandbox/start we get the below response:

{
    "message": "Sandbox environment created successfully",
    "status": "ok",
    "sandboxId": "01a0957b-3c9a-7026-8e81-ff741d83ac50",
    "previewUrl": "http://01a0957b-3c9a-7026-8e81-ff741d83ac50.preview.localhost"
}


we can check the docker desktop, we will see that a new pod is created with the name "sandbox-pod-01a0957b-3c9a-7026-8e81-ff741d83ac50" and a new service is created with the name "sandbox-service-01a0957b-3c9a-7026-8e81-ff741d83ac50". The pod will have the image called "template" which we created earlier, and this image will have the vite-development-server running. The service will forward the request to the pod, so that user can access the preview URL and terminal URL. The preview URL will be like "sandboxId.preview.localhost" and the terminal URL will be like "sandboxId.terminal.localhost".

we will verify if everything inside the POD is working fine or not, for that we will check the logs of the pod, for that run the following command::

kubectl logs sandbox-pod-01a0957b-3c9a-7026-8e81-ff741d83ac50

we can see that the vite-development-server is running inside the pod. 


-------------------------------------------------------

As of now, we have created user-pod and service, now, we need to create an ingress which looks like "*.preview.localhost" and a router-server which will forward the request to the user-service. 

Inside the sandbox folder, we'll create one new folder called `router` and istall `npm i express morgan http-proxy-middleware`. In this folder , we'll help to create router-server

with the help of http-proxy-middleware, we will forward the request, which comes from router-server, to the user-service . 

we'll create an app.js and server.js

-------------------------
sandbox/router/src/app.js
-------------------------

import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";


const app = express();
app.use(morgan("combined"));


// this below middleware will forward the request to the user-service, the request that comes to router-server, comes from pod1.preview.localhost, so we need to extract `pod1`, because this will be ID. 

app.use((req, res, next)=>{
    const host = req.headers.host;
    const sandboxId = host.split(".")[0]; // we are extracting the sandboxId from the host
    
    const target = `http://sandbox-service-${sandboxId}`; // we are forwarding the request to the user-service which is running on the sandbox namespace in the kubernetes cluster
    
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        ws: true,
    })(req, res, next);

});

export default app;


-------------------------
sandbox/router/server.js
-------------------------

import app from "./src/app.js";


app.listen(3000, () => {
  console.log("Sandbox Router server is running on port 3000");
});


now we need to create a dockerfile for the router-server and then run it in the kubernetes cluster, we'll create a dockerfile in the router folder, and then we'll run it in the kubernetes cluster. 


//==========================================

------------------------
  sandbox/router/dockerfile
------------------------

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]



-----------------------------
  sandbox/router/dockerignore
-----------------------------

.env
node_modules

also, install nodemon inside router and make changes in package.json

sandbox/router > npm i -D nodemon 



"dev": "nodemon -L server.js"


now, lets create an image:

sandbox/router>  docker build -t router:latest .



//==========================================




now we'll create a deployment for the router-server, we'll create a deployment in the k8s folder, and then we'll run it in the kubernetes cluster. 


//==========================================

------------------------
  sandbox/k8s/router-deployment.yml
------------------------


apiVersion: apps/v1
kind: Deployment
metadata:
  name:  router-deployment
  labels:
    name:  router-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app:  router
  template:
    metadata:
      labels:
        app:  router
    spec:
      containers:
      - image:  router
        name:  router-server
        resources:
          requests:
            cpu: "250m"
            memory: "250M"
          limits:
            cpu: "500m"
            memory: "500M"
        livenessProbe:
          httpGet:
            path: /api/status/healthz
            port: 3000
          initialDelaySeconds: 90
          timeoutSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/status/readyz
            port: 3000
          initialDelaySeconds: 30
          timeoutSeconds: 10    
        ports:
        - containerPort:  3000
          name:  my-name

//==========================================


since, in the livenessProbe and readinessProbe, we have given new API, we'll need to create an API inside app.js

-------------------------
sandbox/server/src/app.js
-------------------------
import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";


const app = express();
app.use(morgan("combined"));

app.get('/api/status/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
})

app.get('/api/status/readyz', (req, res) => {
    res.status(200).json({ status: 'ready' });
})

// this middleware will forward the request to the user-service, the request that comes to router-server, comes from pod1.preview.localhost, so we need to extract `pod1`, because this will be ID. 


app.use((req, res, next)=>{
    const host = req.headers.host;
    const sandboxId = host.split(".")[0]; // we are extracting the sandboxId from the host
    
    const target = `http://sandbox-service-${sandboxId}`; // we are forwarding the request to the user-service which is running on the sandbox namespace in the kubernetes cluster
    
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        ws: true,
    })(req, res, next);

});

export default app;


since, we have created new API, we need to create the image again::

sandbox/router >  docker build -t router:latest .




we'll also need to create a router-service.yml inside k8s folder, which will forward the request to the router-deployment pod. 


------------------------
  sandbox/k8s/router-service.yml
------------------------

kind: Service
apiVersion: v1
metadata:
  name:  router-service
  labels:
    app:  router
spec:
  selector:
    app:  router
  type:   ClusterIP
  ports:
  - name:  http
    port:  80
    targetPort:  3000



we'll also need to make changes in ingress.yml    


------------------------
  sandbox/k8s/ingress.yml
------------------------
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
              # new line of code for router
   - host: '*.preview.localhost'
      http:
        paths:
          - pathType: Prefix
            path: '/'
            backend:
              service:
                name: router-service
                port:
                  number: 80            


what this ingress does it,  any request coming to the wildcard ending with ".preview.localhost" will be forwarded to the router-service, which will then forward the request to the user-service.


now, go to day-169 and type:: kubectl apply -f ./k8s

we'll see the following::
router-deployment	Available	1/1
router-deployment-6c4cc798c4-xsh4j	Running


if we go to day-169/> kubectl logs router-deployment-6c4cc798c4-xsh4j,we can see that `Sandbox Router server is running on port 3000` stating that the server is live. 


----------------------------------------


now, if we click on previewURL "previewUrl": "http://01a0957b-3c9a-7026-8e81-ff741d83ac50.preview.localhost", we can see the react-vite-app, but it's jittery, and it's because for every request that comes to the router-server, it's creating a new sandbox-service, which is not efficient. It limits the request of the http 

Let's delete some deployment::

- kubectl delete -f ./k8s

now, let's fix the deployment of router-server, we dont want to create a new proxy every time, for that let's make changes in app.js

---------------------------
sandbox/router/src/app.js
---------------------------

import express from 'express';
import morgan from 'morgan';
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express();
app.use(morgan('combined'));

app.get('/api/status/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
})

app.get('/api/status/readyz', (req, res) => {
    res.status(200).json({ status: 'ready' });
})

const proxies = {}

function getProxy(sandboxId) {

    const target = `http://sandbox-service-${sandboxId}`; // Construct target URL based on sandboxId

    if (!proxies[ sandboxId ]) {
        proxies[ sandboxId ] = createProxyMiddleware({
            target,
            changeOrigin: true,
            ws: true,
        })
    }
    return proxies[ sandboxId ];
    // here, for each request, we wont create a new proxy, for one sandbox, we have one proxy and with that proxy, we will forward the request 
}

app.use((req, res, next) => {
    const host = req.headers.host;
    const sandboxId = host.split('.')[ 0 ]; // Extract sandboxId from subdomain



    return getProxy(sandboxId)(req, res, next);
})

export default app



now, create the image again::
sandbox/router >  docker build -t router:latest .


now, go to day-169 and type:: kubectl apply -f ./k8s



now, finally, we can see our vite development server, whose domain is `http://01a0957b-3c9a-7026-8e81-ff741d83ac50.preview.localhost`

we have successfully implemented a working sandbox

------------------------

so, today, we have done that the sandbox-service can create a new pod, and a new service for that pod, and also we have created a router-server, and with the help of it, any request that comes to the domain `*.preview.localhost` will be forwarded to the router-server, which will then forward the request to the user-service  and then to user-pod.

------------------------


//============================================================
DAY-170
//============================================================

Yesterday, we have seen that our sandbox service could create a POD, this POD has a previewURL and with this previewURL we could access the user-pod. 

let's restart kubernetes, then let's apply  "kubectl apply -f ./k8s" in day-170, and let's install ingress controller, wait for 2mins and go to postman and give a POST request with the URL "http://localhost/api/sandbox/start"


we can see the response :
{
    "message": "Sandbox environment created successfully",
    "sandboxId": "01a0a583-3641-7415-825c-606eab818733",
    "previewUrl": "http://01a0a583-3641-7415-825c-606eab818733.preview.localhost"
}


here, we got a preview URL, when we use this previewURL in a browser, we can see the react-vite-app


now, we need to update the files on user-pod, so we will work on this feature today


Lets understand the architecture, there is a sandbox service, and when we request on api/sandbox/start, it create a new pod, and inside this pod, we have a vite-development-server that runs inside a container and also we get a previewURL, we also create a service so that the pod that was created could receive some requests. 

Now, we need develop a feature ki jo vite ka development server hain, yeh jin files pe run ho rha hain un files ko hum change kar paye. Jo vite-development-server hain wo chal raha hain `workspace` folder mein. To verify, check on sandbox>template>dockerfile. Now, in the user-pod we have one container, but we will create one more container, which will be express-server and we'll call it "Agent". Jo vite-development-server hain wo chal raha hain `workspace` folder k ander, aur jo `workspace` folder hain wo hain container k ander. Toh jo `Agent` wala container hain `workspace` wala container kaise access karega, cause, generally aisa toh nahi hota,toh aisa hoga bhi nahi, so, what we are gonna do is, we wont create `workspace` folder inside container, instead  of that , the `workspace` folder will be mounted directly inside the `user-pod`. we will give access of the `workspace` folder to the `agent` container and the `vite-container` will also have access to the `workspace` folder. Hamare pass do container hain, aur inn dono container ke paas `workspace` folder ka access hoga. Jo `workspace` folder ka content hain, that content will be accessible by both the containers.


the vite-dev-server will read the content of `workspace`, which has the react-jsx file, and will be serving it in previewUrl. 


The `agent` is an express-server , so it will give API and with this API, we can read file, list file, update file, create new file, delete file inside `workspace` folder. It is done with `VOLUMES`. `VOLUMES` k andar jitni bhi files hone wali hain, wo store hone wali hain POD k andar hi , aur POD ko delete karne se wo files bhi delete ho jayengi. 


Hamare pass ak template image hota hain aur uski help se vite ka devlopment server banta hain, aur similarly, jo agent container hain, usko create karne k liye ak aur image create karni padegi, jiska naam hoga agent.

Jo agent hoga, wo workspace folder k andar files ki modify karega ,aur jo workspace folder hain wo dono container share kar raha hain, toh jb ye files modify ho jayengi, toh unko live update karne k liye hum ek command chalayenge jo vite-dev-server ko restart karegi, so, that it can read the modified files.


Now, lets create the `Agent` , for that create a new folder inside sandbox as "agent". 

sandbox>agent> npm init -y
sandbox>agent> npm i morgan express
sandbox>agent> npm i -D nodemon

make changes in package.json file

--------------------------
sandbox>agent>package.json
--------------------------

{
  "name": "agent",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon -L server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "express": "^5.2.1",
    "morgan": "^1.12.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}


=> Now, what we are creating is an Agent, this Agent will have some API to read, list, update, create, delete files. we will use this API to modify the files in `workspace` folder. 

---------------------------
sandbox>agent>src>app.js
---------------------------

import express from "express"
import morgan from "morgan"
import fs from "fs";



const WORKING_DIR = "/workspace" // this is the working directory, because it is the only folder that is accessible to this agent and also the container


const app = express()

app.use(morgan("dev"))

app.get("/", (req, res)=>{
    res.status(200).json({
        message: "Hello from Sandbox agent!!",
        status: "success"
    })
})

app.get("/list-files", async (req, res)=>{
    const elements = await fs.promises.readdir(WORKING_DIR);
    return res.status(200).json({
        message: "Elements in working directory",
        elements
    })
})


export default app


-----------------------
sandbox>agent>server.js
-----------------------


import app from "./src/app.js"


app.listen(5000, ()=>{
    console.log(`Sandbox agent is running on port ${5000}`)
})


=> Now, lets convent the agent into a docker image, for that we need a dockerfile and .dockerignore



-----------------------
sandbox>agent>dockerfile
-----------------------

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]



---------------------------
sandbox>agent>.dockerignore
---------------------------

node_modules
.env


Now, lets create an image::

D:\cohort\cohortNotes\day-170\sandbox\agent> docker build -t agent:latest .


now, that the image is created, we will run the image::
docker run -p 8080:3000 agent:latest


we will see the response as:: Sandbox agent is running on port 3000

now, when we try to access the api that we have just created using localhost:8080/list-files, we will see the response as::

Error: ENOENT: no such file or directory, scandir '/workspace'
    at async Object.readdir (node:internal/fs/promises:950:18)
    at async file:///app/src/app.js:22:22
    
-> with the help of docker, when we create an image of `agent`, the entire code will be stored inside app folder(check dockerfile),   the `WORKDIR /app` means the code of `agent` will be stored in `app` folder of the container. We want to access the code of `workspace` and for that only, we have done as `const WORKING_DIR = "/workspace"` inside app.js. This `workspace` folder still dont exist, so we need to create the `workspace` folder. For that we make the below changes in dockerfile. Also, please stop the agent container first.


--------------------------
sandbox>agent>dockerfile
--------------------------

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN mkdir /workspace

CMD ["node", "server.js"]

now, create the `agent` image again and run the image::

D:\cohort\cohortNotes\day-170\sandbox\agent> docker build -t agent:latest .
docker run -p 8080:3000 agent:latest

now, if we check the container of the agent in a docker desktop, we will see that in `/app` folder, we have the code of `agent` and in `/workspace` folder, we have the empty folder. 

if we check in browser with the link http://localhost:8080/list-files, we will get the response as::

{
    "message": "Elements in working directory",
    "elements": []
}

=> Now, our `agent` is almost ready, but there is a problem, if  deploy the `agent` with the code we have written till now, then the `agent` wont access the `workspace` folder of the POD, instead of POD's `workspace` folder, it will only have access to the `agent` container's `/workspace` folder.We want to sync the `agent` workspace with the POD's `workspace` folder. Similarly, for the `vite-dev-server`, we want to sync the `vite-dev-server`'s `workspace` folder with the POD's `workspace` folder. The `vite-dev-server` container is running the vite-dev-server on the `workspace` folder(check template/dockerfile). Now, we want the `workspace` folder, which is inside the POD, to be sync with `agent` container's `/workspace` folder and `vite-dev-server` container's `/workspace` folder.  So that if the `agent` makes any changes in its `workspace`, the same changes will be reflected in the POD's `workspace` folder and similarly the `vite-dev-server` will also be able to read the changes made by the `agent` in the `workspace` folder and get synced with its `workspace` folder.  Now, let's implement this in kubernetes.

At first , let's deploy the `agent`. We have already created an image of `agent`. Now , the sandbox-server which creates the POD, has `vite-dev-server` and also it must have `agent` container. for that let's make some changes in code::


-------------------------------------
sandbox/server/src/kubernetes/pod.js
-------------------------------------

import { k8sCoreV1Api } from './config.js';

export async function createPod(sandboxId) {
  const podManifest = {
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: 'sandbox',
        sandboxId: sandboxId,
      },
    },
    spec: {
      containers: [
        {
          image: 'template', // this is the image name called "template"
          imagePullPolicy: 'IfNotPresent',
          name: 'sandbox-container',
          ports: [{ containerPort: 5173, name: 'http' }],
          resources: {
            limits: { cpu: '500m', memory: '1Gi' },
            requests: { cpu: '250m', memory: '500Mi' },
          },
        },
        // with this code, the `agent` container will be created, along with the `template` container
        {
          image: "agent",
          imagePullPolicy: "IfNotPresent",
          name: "agent-container",
          ports: [{containerPort: 3000, name: "http"}],
          resources:{
            limits: { cpu: "500m", memory: "1Gi"},
            requests: { cpu: "250m", memory: "500Mi"}
          }
        }
      ],

    },
  };

  const response = await k8sCoreV1Api.createNamespacedPod({
    namespace: 'default',
    body: podManifest,
  });

  return response;
}

=> now , both the containers are created but they are not synced , for that we need to add `VOLUMES` to the POD called `workspace`

-------------------------------------
sandbox/server/src/kubernetes/pod.js
-------------------------------------

import { k8sCoreV1Api } from './config.js';

export async function createPod(sandboxId) {
  const podManifest = {
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: 'sandbox',
        sandboxId: sandboxId,
      },
    },
    spec: {
      volumes: [
        {
          name: 'workspace_volume',
          emptyDir: {},
        },
      // with this code, we have created a volume named 'workspace_volume', we have not synced it yet, till now, `vite-dev-server` /workspace is different and the `agent` /workspace is different, now we need to sync it
      ],
      containers: [
        {
          image: 'template', // this is the image name called "template"
          imagePullPolicy: 'IfNotPresent',
          name: 'sandbox-container',
          ports: [{ containerPort: 5173, name: 'http' }],
          resources: {
            limits: { cpu: '500m', memory: '1Gi' },
            requests: { cpu: '250m', memory: '500Mi' },
          },
        },
        // with this code, the `agent` container will be created, along with the `template` container
        {
          image: 'agent',
          imagePullPolicy: 'IfNotPresent',
          name: 'agent-container',
          ports: [{ containerPort: 3000, name: 'http' }],
          resources: {
            limits: { cpu: '500m', memory: '1Gi' },
            requests: { cpu: '250m', memory: '500Mi' },
          },
        },
      ],
    },
  };

  const response = await k8sCoreV1Api.createNamespacedPod({
    namespace: 'default',
    body: podManifest,
  });

  return response;
}

   // with this code, we have created a volume named 'workspace_volume', we have not synced it yet, till now, `vite-dev-server` /workspace is different and the `agent` /workspace is different, now we need to sync it, the 'workspace_volume' is empty folder, to sync it, we have done 'volumeMounts' in the below code::


-------------------------------------
sandbox/server/src/kubernetes/pod.js
-------------------------------------

import { k8sCoreV1Api } from './config.js';

export async function createPod(sandboxId) {
  const podManifest = {
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: 'sandbox',
        sandboxId: sandboxId,
      },
    },
    spec: {
      volumes: [
        {
          name: 'workspace-volume',
          emptyDir: {},
        },
      ],
      containers: [
        {
          image: 'template', // this is the image name called "template"
          imagePullPolicy: 'IfNotPresent',
          name: 'sandbox-container',
          ports: [{ containerPort: 5173, name: 'http' }],
          resources: {
            limits: { cpu: '500m', memory: '1Gi' },
            requests: { cpu: '250m', memory: '500Mi' },
          },

          // with the below volumeMounts, we have synced the 'workspace-volume' with the 'vite-dev-server' workspace
          volumeMounts: [
            {
              name: 'workspace-volume',
              mountPath: '/workspace',
            },
          ],
        },
          // with this code, the `agent` container will be created, along with the `template` container
        { 
          image: 'agent',
          imagePullPolicy: 'IfNotPresent',
          name: 'agent-container',
          ports: [{ containerPort: 3000, name: 'http' }],
          resources: {
            limits: { cpu: '500m', memory: '1Gi' },
            requests: { cpu: '250m', memory: '500Mi' },
          },
          // with the below volumeMounts, we have synced the 'workspace-volume' with the 'agent' workspace
          volumeMounts: [
            {
              name: 'workspace-volume',
              mountPath: '/workspace',
            },
          ],
        },
      ],
    },
  };

  const response = await k8sCoreV1Api.createNamespacedPod({
    namespace: 'default',
    body: podManifest,
  });

  return response;
}


The syncing part is done, now, there is one problem, how will we send request to that agent, previously, we have created router-server , service, *.preview.localhost and all they could do is give response to previewURL. with the help of previewURL only we could access the vite dev server running on 5173 port. Now, we'll do it for *.agent.localhost

Let's make changes in ingress

----------------------------------------
k8s/ingress.yml
----------------------------------------


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
            path: '/api/sandbox'
            backend:
              service:
                name: sandbox-service
                port:
                  number: 80

    - host: '*.preview.localhost'
      http:
        paths:
          - pathType: Prefix
            path: '/'
            backend:
              service:
                name: router-service
                port:
                  number: 80

    - host: '*.agent.localhost'
      http:
        paths:
          - pathType: Prefix
            path: '/'
            backend:
              service:
                name: router-service
                port:
                  number: 80


Our router-server will handle both the pod1.preview.localhost and pod1.agent.localhost URL's.

=> The user-pod has both the `'vite-dev-server` and `'agent'` containers running inside it, and for this pod we have created a service at /server/src/kubernetes/service.js . the `'vite-dev-server` runs on port:5173 and `agent` runs on port:3000