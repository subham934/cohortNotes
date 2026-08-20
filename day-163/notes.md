Today, we'll see microservice.

=> There are two different architecture:: 
# Monolithic vs Microservices Architecture

There are two common ways to design and structure an application:

1. Monolithic Architecture
2. Microservices Architecture

## 1. Monolithic Architecture

In a Monolithic Architecture, the entire application is built as one single application/codebase.

For example, suppose Instagram is built using a Monolithic Architecture. It may have different functionalities such as:

* User Authentication
* User Profile
* Posts
* Likes and Comments
* Follow/Unfollow
* Messaging
* Notifications

Even though these are different functionalities, they all exist inside one large application/codebase.

So, the entire application is generally treated as one deployment unit.

For example:

Instagram Application
→ One Codebase
→ One Application
→ One Deployment Unit

### How does a Monolithic Application run?

Initially, we can run the entire application on one server.

For example:

Users
|
v
Server 1
|
└── Complete Instagram Application
├── Authentication
├── Users
├── Posts
├── Likes
├── Messages
└── Notifications

Here, Server 1 is running the complete monolithic application.

### Why do we need to replicate the server?

Suppose Instagram becomes very popular and millions of users start sending requests.

One server may not have enough CPU, memory, or network capacity to handle all those requests.

Instead of depending on only one server, we can create multiple copies of the same application.

For example:

Users
|
v
Load Balancer
|
├── Server 1 → Complete Instagram Application
├── Server 2 → Complete Instagram Application
└── Server 3 → Complete Instagram Application

Here, Server 1, Server 2, and Server 3 are all running the SAME monolithic application.

We are not splitting the application into different services.

Instead, we are creating multiple replicas of the entire application.

### How does the replicated server work?

Suppose we have three servers:

Server 1 → Instagram Application
Server 2 → Instagram Application
Server 3 → Instagram Application

A Load Balancer sits in front of these servers.

The user does not directly choose which server will handle the request.

Instead:

User
|
v
Load Balancer
|
├── Server 1
├── Server 2
└── Server 3

The Load Balancer receives incoming requests and distributes them among the available servers.

For example:

Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1
Request 5 → Server 2

This allows the traffic to be distributed instead of sending every request to a single server.

### What happens if one server crashes?

Suppose we have:

Server 1 → Running
Server 2 → Running
Server 3 → Running

Now Server 2 crashes:

Server 1 → Running
Server 2 → ❌ Crashed
Server 3 → Running

The Load Balancer performs health checks to determine which servers are healthy.

Once Server 2 is detected as unhealthy, the Load Balancer stops sending new requests to Server 2.

Traffic is then sent to the healthy servers:

User
|
v
Load Balancer
|
├── Server 1 → Running
├── Server 2 → ❌ Unhealthy
└── Server 3 → Running

If we are using ECS, the ECS Service can also detect that one of its Tasks has stopped.

Suppose the desired count is 3:

Desired Tasks = 3

Initially:

Task 1 → Running
Task 2 → Running
Task 3 → Running

If Task 2 crashes:

Task 1 → Running
Task 2 → ❌ Stopped
Task 3 → Running

The ECS Service notices that only 2 Tasks are running instead of the desired 3.

It then starts a new Task using the same Task Definition:

Task 1 → Running
Task 3 → Running
Task 4 → New Task → Running

Now the desired count is restored:

Running Tasks = 3

### Important Point About Replication

When we replicate a monolithic application, we replicate the ENTIRE application.

For example:

Monolithic Application

```
    |
    ├── Replica 1 → Complete Application
    ├── Replica 2 → Complete Application
    └── Replica 3 → Complete Application
```

Each replica contains:

* Authentication
* Users
* Posts
* Likes
* Comments
* Messages
* Notifications

So, if we have 3 replicas, we have 3 copies of the complete monolithic application running.

### What happens when we deploy a new version?

Because the application is monolithic, the different functionalities are part of the same application and deployment unit.

For example:

Old Version
|
└── Complete Instagram Application

When we create a new version, the new version contains the entire application.

The deployment system can gradually replace the old replicas with new replicas.

For example:

Old:
Server 1 → Version 1
Server 2 → Version 1
Server 3 → Version 1

During deployment:

Server 1 → Version 2
Server 2 → Version 1
Server 3 → Version 1

Then:

Server 1 → Version 2
Server 2 → Version 2
Server 3 → Version 1

Finally:

Server 1 → Version 2
Server 2 → Version 2
Server 3 → Version 2

This allows us to update the application while keeping multiple replicas available.

### Simple way to remember Monolithic Architecture

Monolith = Everything is inside one big application.

Even if we have multiple servers, every server is running a copy of the entire application.

So:

Monolithic ≠ One Server

Monolithic = One Application / One Codebase / One Deployment Unit

---

## 2. Microservices Architecture

In a Microservices Architecture, instead of building the entire application as one large application, we break it down into multiple smaller and independent services.

For example, Instagram could be divided into different services:

Instagram
|
├── User Service
├── Post Service
├── Comment Service
├── Like Service
├── Message Service
├── Notification Service
└── Authentication Service

Each service is responsible for one specific business functionality.

For example:

User Service
→ Responsible for user-related functionality.

Post Service
→ Responsible for creating, updating, and retrieving posts.

Like Service
→ Responsible for likes.

Notification Service
→ Responsible for notifications.

### How do Microservices communicate?

These services are independent applications/services.

They communicate with each other using APIs or other communication mechanisms.

For example:

Post Service
|
| API
v
Like Service

Or:

Post Service
|
| API
v
Notification Service

For example, when a user likes a post:

1. The request reaches the Like Service.
2. The Like Service processes the like.
3. The Like Service may communicate with the Notification Service.
4. The Notification Service creates the appropriate notification.

### Main advantage of Microservices

The major advantage is that individual services can be developed, deployed, maintained, and scaled independently.

For example, suppose the Notification Service receives a huge amount of traffic.

Instead of scaling the entire Instagram application, we can scale only the Notification Service.

For example:

Authentication Service → 2 replicas
User Service → 3 replicas
Post Service → 5 replicas
Like Service → 10 replicas
Notification Service → 20 replicas

The number of replicas can be different depending on how much traffic each service receives.

### Monolithic Scaling vs Microservices Scaling

In a Monolithic Architecture:

We generally scale the entire application.

For example:

Monolith
|
├── Replica 1 → Complete Application
├── Replica 2 → Complete Application
└── Replica 3 → Complete Application

Every replica contains the entire application.

In a Microservices Architecture:

We can scale individual services independently.

For example:

User Service
├── Replica 1
└── Replica 2

Post Service
├── Replica 1
├── Replica 2
├── Replica 3
├── Replica 4
└── Replica 5

Like Service
├── Replica 1
├── Replica 2
└── Replica 3

Notification Service
├── Replica 1
├── Replica 2
├── Replica 3
├── Replica 4
└── Replica 5

So each service can have a different number of replicas based on its workload.

## Quick Difference

Monolithic:

One large application containing all functionalities.

Microservices:

Multiple smaller and independent services, where each service is responsible for a specific functionality and communicates with other services through APIs.

## Simple Visual Difference

Monolithic:

```
             Users
               |
               v
          Load Balancer
               |
      ┌────────┼────────┐
      |        |        |
      v        v        v
   Server 1 Server 2 Server 3
   Monolith Monolith Monolith
```

Each server contains the COMPLETE application.

Microservices:

```
             Users
               |
               v
          Load Balancer
               |
   ┌───────────┼───────────┐
   |           |           |
   v           v           v
```

User Service Post Service Like Service
|           |           |
Replicas     Replicas     Replicas

Each service is independent and can be scaled separately.

## Important Connection with Docker and ECS

In a Microservices Architecture, each service can be packaged into its own Docker image and run inside its own container.

For example:

User Service → Docker Image → ECS Tasks
Post Service → Docker Image → ECS Tasks
Like Service → Docker Image → ECS Tasks
Notification Service → Docker Image → ECS Tasks

ECS can then manage these Tasks through Services.

For example:

Post Service
|
└── ECS Service
|
├── Task 1
├── Task 2
└── Task 3

If one Task stops, the ECS Service can start another Task to maintain the desired number of running Tasks.

## Most Important Things to Remember

1. Monolithic Architecture means the entire application is one application/codebase and generally one deployment unit.

2. Monolithic does NOT mean there can only be one server.

3. We can create multiple replicas of a monolithic application to handle more traffic and provide high availability.

4. A Load Balancer distributes incoming requests among the healthy replicas.

5. If one replica/server becomes unhealthy, the Load Balancer stops sending traffic to it.

6. In ECS, the Service maintains the desired number of running Tasks and can replace a stopped Task.

7. In Microservices Architecture, the application is divided into multiple independent services.

8. Each microservice is responsible for a specific business functionality.

9. Microservices communicate with each other using APIs or other communication mechanisms.

10. The biggest difference in scaling is:

Monolithic → Scale the entire application.

Microservices → Scale individual services independently.


Microservices: Multiple smaller independent services, each responsible for a specific functionality, communicating through APIs.

In short:

Monolithic:

        Instagram
   ┌─────────────────┐
   │ Auth            │
   │ Users           │
   │ Posts           │
   │ Likes           │
   │ Messages        │
   │ Notifications   │
   └─────────────────┘
    One Application


Microservices:


 ┌─────────────┐
 │ Auth        │
 └──────┬──────┘
        │ API
 ┌──────▼──────┐
 │ User        │
 └──────┬──────┘
        │ API
 ┌──────▼──────┐
 │ Post        │
 └──────┬──────┘
        │ API
 ┌──────▼──────┐
 │ Like        │
 └─────────────┘


   Multiple Independent Services

The important connection with Docker/ECS is that in a microservices architecture, we can run each service in its own container, and ECS can manage those containers independently.



In monolith we have one server, one database, the entire codebase runs on single server, and if the server can't handle load then we replicate entire server. (multiple monolith servers, one database). To balance the traffic on both the server , we use loadbalancer.

=> loadbalancer distribute the traffic to different server. 







