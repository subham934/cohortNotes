# Why Kubernetes?

Kubernetes is used to MANAGE and ORCHESTRATE containers at scale.

Before understanding Kubernetes, remember:

Docker → Creates and runs containers.

Kubernetes → Manages many containers.

For example:

Docker:

Application
    ↓
Docker Container
    ↓
Runs application


But imagine we have hundreds of containers:

                    Kubernetes
                        |
        +---------------+---------------+
        |               |               |
        ↓               ↓               ↓
    Container       Container       Container
    Container       Container       Container
       ...             ...             ...
    100s / 1000s of containers
  

Managing all of these containers manually becomes very difficult.

This is where Kubernetes comes in.


# 1. What Problem Does Kubernetes Solve?

Suppose we have a microservices application:

              E-Commerce Application
                       |
        +--------------+--------------+
        |              |              |
        ↓              ↓              ↓
   User Service   Order Service   Payment Service
        |              |              |
        ↓              ↓              ↓
   Containers     Containers     Containers


Now imagine:

User Service → 10 containers
Order Service → 20 containers
Payment Service → 15 containers
Product Service → 30 containers
Notification Service → 10 containers

Now we have 85 containers.

Managing these manually would be difficult.

We would have to:

- Start containers
- Stop containers
- Restart failed containers
- Add containers when traffic increases
- Remove containers when traffic decreases
- Distribute traffic
- Monitor containers
- Deploy new versions
- Handle failures

Kubernetes automates many of these tasks.


# 2. Kubernetes Is a Container Orchestrator

The word "Orchestration" is important.

Orchestration means:

Managing and coordinating many containers automatically.

So:

Docker
→ Containerization


Kubernetes
→ Container Orchestration


Simple example:

Docker:

Run one container.

Kubernetes:

"Run 10 copies of this container,
keep them running,
replace them if they crash,
and increase them to 20 if necessary."


# 3. Self-Healing

Suppose we have 3 replicas of a service:

              Kubernetes
                   |
          +--------+--------+
          ↓        ↓        ↓
       Pod 1     Pod 2     Pod 3
         ✅         ✅         ✅


Now Pod 2 crashes:

       Pod 1     Pod 2 ❌    Pod 3
         ✅                    ✅


Kubernetes detects that the desired number of replicas is 3.

So Kubernetes creates another Pod:

       Pod 1     Pod 2 ❌    Pod 3
         ✅                    ✅
                    +
                    ↓
                 Pod 4
                   ✅


Now:

       Pod 1     Pod 3     Pod 4
         ✅         ✅         ✅


Kubernetes automatically replaces the failed Pod.

This is called SELF-HEALING.


# 4. Scaling

Suppose our application normally needs 3 containers:

              Kubernetes
                   |
          +--------+--------+
          ↓        ↓        ↓
        Pod 1    Pod 2    Pod 3


Suddenly traffic increases.

For example:

Normal traffic:
1,000 requests/sec


Traffic increases:
10,000 requests/sec


We can increase the number of replicas:

              Kubernetes
                   |
       +-----------+-----------+
       ↓           ↓           ↓
     Pod 1       Pod 2       Pod 3
       ↓           ↓           ↓
     Pod 4       Pod 5       Pod 6


Kubernetes can manage this scaling.

This is called HORIZONTAL SCALING.


# 5. Load Balancing

Suppose we have 3 replicas:

       Pod 1
         |
         |
       Pod 2
         |
         |
       Pod 3


Users send requests.

Kubernetes can provide mechanisms to distribute traffic:

                  Users
                    |
                    ↓
                 Service
              /     |     \
             ↓      ↓      ↓
           Pod 1   Pod 2   Pod 3


Requests can be distributed among the Pods.


# 6. Rolling Updates

Suppose our application is currently running version 1:

Pod 1 → v1
Pod 2 → v1
Pod 3 → v1


Now we want to deploy version 2.

Without proper deployment management, we might have to
stop the old containers and start the new ones.

This can cause downtime.

Kubernetes can perform a rolling update:

Pod 1 → v1
Pod 2 → v1
Pod 3 → v1

        ↓

Pod 1 → v2
Pod 2 → v1
Pod 3 → v1

        ↓

Pod 1 → v2
Pod 2 → v2
Pod 3 → v1

        ↓

Pod 1 → v2
Pod 2 → v2
Pod 3 → v2


The old Pods are gradually replaced by the new Pods.

This can help achieve ZERO or MINIMAL DOWNTIME deployments.


# 7. Service Discovery

In a microservices architecture, services need to communicate
with each other.

For example:

Order Service
      |
      ↓
Payment Service


But the IP address of a container can change.

For example:

Payment Service
    ↓
Pod 1
IP: 10.0.0.5


If Pod 1 dies:

Payment Service
    ↓
Pod 2
IP: 10.0.0.9


The IP address changed.

We don't want the Order Service to manually keep track of
every changing Pod IP.

Kubernetes provides SERVICE DISCOVERY.

We can communicate using a stable service name:

Order Service
      |
      ↓
payment-service
      |
      ↓
Kubernetes finds the correct Pod


So Kubernetes hides the constantly changing Pod IP addresses.


# 8. Desired State

This is one of the MOST IMPORTANT concepts in Kubernetes.

We tell Kubernetes what we WANT.

For example:

"I want 3 replicas of my application running."

Kubernetes continuously checks the actual state.

Desired state:

3 Pods


Actual state:

Pod 1 ✅
Pod 2 ❌
Pod 3 ✅

Kubernetes sees:

Desired = 3
Actual = 2


So it creates another Pod.

Pod 1 ✅
Pod 3 ✅
Pod 4 ✅


Now:

Desired = 3
Actual = 3


This is called DECLARATIVE MANAGEMENT.


# 9. Kubernetes vs Docker

This is a very important distinction.

Docker:

- Creates containers
- Builds container images
- Runs containers
- Provides container runtime functionality


Kubernetes:

- Manages containers
- Manages many containers
- Scales containers
- Restarts failed containers
- Performs rolling deployments
- Provides service discovery
- Helps distribute traffic
- Maintains desired state


Simple way to remember:

Docker:

"Run this container."


Kubernetes:

"Make sure 10 copies of this application
are always running and manage them for me."


# 10. Why Kubernetes Is Especially Useful for Microservices

Suppose our application has:

User Service
Order Service
Payment Service
Product Service
Inventory Service
Notification Service


Each service may have multiple replicas:

User Service
    ↓
  3 Pods

Order Service
    ↓
  5 Pods

Payment Service
    ↓
  4 Pods

Product Service
    ↓
  10 Pods


Now imagine managing all of these manually.

It becomes extremely difficult.

Kubernetes gives us a platform to manage all these workloads.


# 11. Kubernetes Architecture

At a very high level:

                 Kubernetes Cluster
                        |
              +---------+---------+
              |                   |
              ↓                   ↓
        Control Plane          Worker Nodes
                                  |
                     +------------+------------+
                     |            |            |
                     ↓            ↓            ↓
                   Pod          Pod          Pod
                     |            |            |
                 Container    Container    Container


The CONTROL PLANE manages the cluster.

WORKER NODES run the actual workloads.


# 12. Pod

A Pod is the smallest deployable unit in Kubernetes.

Usually:

Pod
 |
 └── Container


For example:

Pod 1
 |
 └── Node.js Container


We normally don't directly manage individual containers in
Kubernetes. We work with Pods and higher-level Kubernetes
objects such as Deployments.


# 13. Deployment

A Deployment tells Kubernetes how we want our application
to run.

For example:

Application:
my-node-app

Replicas:
3


Kubernetes will try to maintain:

Pod 1 → my-node-app
Pod 2 → my-node-app
Pod 3 → my-node-app


If one disappears:

Pod 1 → my-node-app
Pod 2 → my-node-app
Pod 3 → ❌


Kubernetes creates:

Pod 4 → my-node-app


So the Deployment helps maintain the desired number of replicas.


# 14. The Overall Picture

Now connect everything:

                     USERS
                       |
                       ↓
                 Load Balancer
                       |
                       ↓
                 Kubernetes
                       |
        +--------------+--------------+
        |              |              |
        ↓              ↓              ↓
   User Service   Order Service   Payment Service
        |              |              |
      Pods           Pods           Pods
        |              |              |
   Containers     Containers     Containers


Kubernetes manages these Pods and containers.

It can help with:

- Scaling
- Self-healing
- Service discovery
- Load balancing
- Rolling updates
- Desired state
- Container management


# 15. The Main Reason We Use Kubernetes

When we have only a few containers:

Docker may be enough.


When we have many containers and services:

                  Many Containers
                        ↓
                  Management
                        ↓
                   Kubernetes


Kubernetes automates the management of these containers.


# Simple Definition

Kubernetes is an open-source container orchestration platform
that automates the deployment, scaling, networking, and management
of containerized applications.


# One-Line Memory Trick

Docker = RUN CONTAINERS

Kubernetes = MANAGE MANY CONTAINERS


And in a microservices architecture:

Microservices
      ↓
Many Services
      ↓
Many Containers
      ↓
Kubernetes
      ↓
Manage, Scale, Recover and Deploy them


//======================================================================


In day-164, let's create a folder called backend in day-164

npm i express morgan

=> we'll create a server, then create a docker image of it, then , with the help of that docker image, we will deploy that particular server with the help of kubernetes.

---------
server.js
---------

import express from "express";
import morgan from "morgan";


const app = express()

app.use(express.json())
app.use(morgan('dev'))


app.get('/', (req, res) => {
    let sum = 0;
    for(let i = 0; i < 1000000000; i++) {
        sum += i;
    }
    res.status(200).json(`Hello World! Sum is ${sum}`)
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

// Here, we have added a computation that calculates the sum of 1 billion numbers.
// The API is intentionally made CPU-intensive so that, in the future, when the
// load on the server increases, we can demonstrate how auto-scaling works
// with the help of Kubernetes.

// now when we run the server, it will run on port 3000. check on localhost:3000 in browser to see the sum of 1 billion numbers.

now, lets create a docker image of this server. for that we need two files:

1. dockerfile
2. .dockerignore

-------------
# backend > dockerfile
-------------

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]



-------------------------
# backend > .dockerignore
-------------------------

node_modules
.env



=> now that we have created a basic docker file, when we run this dockerfile, we will get an image::
docker build . -t cohort_2_express:latest


=> now, we will run this image
docker run -p 3000:3000 cohort_2_express

=> now , we can access this server on http://localhost:3000. check the sum of 1 billion numbers.
=> now, stop the container and delete it, docker ps < containerId > docker stop < containerId > docker rm < containerId>
=> here, we have an image called cohort_2_express, now we will see kubernetes, and with the help of kubernetes , we will deploy this image and make it live.


# Kubernetes
  - Cluster: It is network of computers. Our server runs inside a cluster of computers. 

Inside a container, we have a server.
now suppose , we have a container that can server 1000 users, but , the number of users increases, now we have to create more containers and run them parallel to serve the users. so , when the load is high, we have to create more containers, and when the load is low, we have to remove containers. but , we can't do this manually. we have to do this automatically.
so , here , we will use kubernetes to manage our containers.


POD: A Pod is a wrapper around one or more containers. All containers in a pod share the same network (same IP address) and storage. In practice, most pods contain a single container — your app. You rarely create pods directly — a Deployment creates and manages them for you.

as of now, we will consider pod & container to be the same thing.

========================

Deployment: It tells which image to run for the container, how much CPU is required, how much RAM is required, & max replicas (how many containers to run in parallel). so , basically , deployment manages pods/containers.
-> replica states that we have to maintain a minimum of N containers.
-> containers can crash because the developer may have written wrong code, which cause error during run-time that leads to error in server & hence container crashes.
-> when a new container is created , it has a new IP, user ka jo traffic hai, wo, service k through guzar ta hain, kyun ki container crash ho jata hain aur naya container ki zaroorat hoti hain, aur kyuun ki naya container ka IP address pata nahi hota humko, toh jo bhi traffic hai wo service k through hi guzar ta hain, service automatically new container ka IP address discover kar leti hain aur traffic ussi IP address pr bhej deti hain.


Ingress: they are rules which tells, kaun si traffic kaha jana chahiye, eg: if traffic comes on localhost:3000/login --> goes to user-service, and if traffic comes on localhost:3000/orders --> goes to order-service.

Ingress Controller: It is the actual implementation of ingress rules. It is a pod that runs in our cluster and manages the ingress rules. For example, nginx is a popular ingress controller.


========================

Now, with the help of kubernetes, we will deploy our container.