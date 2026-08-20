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

//===============================================================================

In monolith we have one server, one database, the entire codebase runs on single server, and if the server can't handle load then we replicate entire server. (multiple monolith servers, one database). To balance the traffic on both the server , we use loadbalancer.

=> loadbalancer distribute the traffic to different server. 


For the case with microservices, we have multiple servers, multiple databases. This is not only beneficial for scaling and performance, but also for security and fault tolerance. Loadbalancer help in load distribution in microservices too. In microservices each server run one service. we can have multiple instances of same service running on different servers to handle the load. 

Example:
Auth Service - 100 instances
User Service - 200 instances
Post Service - 300 instances
Like Service - 400 instances
Notification Service - 500 instances

Each instance can have its own database. 


Loadbalancer mainly does two things:
1. Distributes traffic to different server.
2. send traffic to only healthy server and also to the server that is valid for that request. Eg: For auth request, it sends traffic to auth service instances. For post req, it sends traffic to post service instances. For get user profile req, it sends traffic to user service instances.

One load balancer is used for each service. so auth service will have one load balancer, user service will have one load balancer, post service will have one load balancer, like service will have one load balancer, notification service will have one load balancer.

In microservices, if one service shuts down, the other services will continue to work. Eg: if msg stops working, but still users can login, post, like, and comment.



=> The CAP theorem states that any distributed data store can provide at most two of three guarantees: Consistency (every read gets the newest data or an error), Availability (every non-failing node returns a response), and Partition Tolerance (the system keeps working despite network drops)

=> To stop DDOS attack we use cloudflare




-----------------------------------------------
-> Distributed System: A distributed system is a collection of independent computers that work together as if they were a single system. These computers communicate over a network to share data, coordinate tasks, and provide services.

Simple example

Imagine an online shopping website like Amazon.

When you search for a product:

One server handles your login.
Another searches the product database.
Another processes payments.
Another tracks inventory.
Another recommends products.

Although many computers are involved, you experience it as one website. This is a distributed system.

Key characteristics:

Multiple computers (nodes): The system consists of many machines.
Communication: Nodes exchange information over a network.
Resource sharing: Data and processing are distributed across machines.
Scalability: More machines can be added to handle increased demand.
Fault tolerance: If one machine fails, others can continue providing the service.


Advantages:
High availability: Services remain available even if some servers fail.
Better performance: Work is shared among multiple computers.
Scalability: Easy to expand by adding more nodes.
Reliability: Data can be replicated across different machines.

Challenges:
Network delays (latency): Communication between machines takes time.
Data consistency: Keeping copies of data synchronized is difficult.
Fault handling: Detecting and recovering from failures is complex.
Security: Data moving across networks must be protected.


Real-world examples:

Google Search
Facebook
Netflix
Banking systems
Cloud platforms like AWS, Microsoft Azure, and Google Cloud
Distributed databases such as Cassandra and MongoDB

Simple diagram
            User
              |
         Load Balancer
        /      |      \
   Server1  Server2  Server3
      |         |         |
      +---------+---------+
                |
          Shared Database

Here, multiple servers work together to process user requests. If one server goes down, the others continue serving users.

=> In one sentence: A distributed system is a group of networked computers that cooperate to perform tasks and appear to users as a single, unified system.


//======================================================


How does microservices communicate with each other, the Interservice Communication?

=> The communication is of two types , asynchronous, synchronous. 


# Interservice Communication

In a Microservices Architecture, different services need to communicate with each other to complete a particular task.

For example:

User Service
     |
     ↓
Order Service
     |
     ↓
Payment Service

Here, the Order Service may need to communicate with the Payment Service to process a payment.

This communication between different services is called Interservice Communication.

There are mainly two types of Interservice Communication:

1. Synchronous Communication
2. Asynchronous Communication


# 1. Synchronous Communication

In synchronous communication, one service sends a request to another service and WAITS for the response before continuing its work.

For example:

Order Service
     |
     | Request
     ↓
Payment Service
     |
     | Response
     ↓
Order Service

For example, when a user places an order:

Order Service
     |
     | "Process this payment"
     ↓
Payment Service
     |
     | "Payment successful"
     ↓
Order Service
     |
     ↓
Order Completed

The Order Service has to wait for the Payment Service to respond.

Common technologies used for synchronous communication:

- HTTP / REST API
- gRPC
- GraphQL (in some architectures)

Example:

POST /payment

The Order Service sends an HTTP request to the Payment Service and waits for the response.


Advantages of Synchronous Communication:

- Simple to understand.
- Easy to implement.
- Immediate response.
- Useful when the calling service needs the result immediately.


Disadvantages of Synchronous Communication:

The biggest problem is dependency.

If the Payment Service is down:

Order Service
     |
     ↓
Payment Service ❌

The Order Service may have to wait, timeout, or fail.

So synchronous communication can create tight coupling between services.


# 2. Asynchronous Communication

In asynchronous communication, one service sends a message/event and DOES NOT wait for the other service to immediately respond.

For example:

Order Service
     |
     | Message/Event
     ↓
Message Broker
     |
     ↓
Payment Service

The Order Service sends the message and can continue doing its work.

For example:

Order Service
     |
     | "Order Created"
     ↓
Message Broker
     |
     ↓
Payment Service

The Payment Service can process that message whenever it is ready.

The Order Service DOES NOT have to wait for the Payment Service to respond immediately.


Common technologies used for asynchronous communication:

- RabbitMQ
- Apache Kafka
- Amazon SQS
- Amazon SNS
- Other Message Queues / Event Streaming systems


Advantages of Asynchronous Communication:

- Services are more loosely coupled.
- One service doesn't have to wait for another.
- Better for handling large amounts of traffic.
- Services can continue working even if another service is temporarily unavailable.
- Useful for event-driven architectures.


Disadvantages of Asynchronous Communication:

- More difficult to understand and debug.
- Response is not immediate.
- Messages can sometimes be delayed.
- Need to handle message failures, retries, duplicates, etc.


# Synchronous vs Asynchronous

Synchronous:

Service A
   |
   | Request
   ↓
Service B
   |
   | Response
   ↓
Service A

Service A WAITS.


Asynchronous:

Service A
   |
   | Message
   ↓
Message Broker
   |
   ↓
Service B

Service A DOES NOT WAIT.


Simple way to remember:

Synchronous = "I will ask you and wait for your answer."

Asynchronous = "I will send you the message and continue my work."


# Example in an E-Commerce Application

Suppose a user places an order.

There may be several microservices:

              Order Service
                    |
        +-----------+-----------+
        ↓           ↓           ↓
   Payment       Inventory   Notification
   Service        Service      Service


Synchronous Approach:

The Order Service might directly call the Payment Service:

Order Service
     |
     | HTTP Request
     ↓
Payment Service
     |
     | Response
     ↓
Order Service

The Order Service waits for the payment response.


Asynchronous Approach:

The Order Service can publish an event:

Order Service
     |
     | "Order Created"
     ↓
 Message Broker
     |
     +--------------→ Payment Service
     |
     +--------------→ Inventory Service
     |
     +--------------→ Notification Service

Each service can consume the event independently.

For example:

- Payment Service → processes payment
- Inventory Service → updates stock
- Notification Service → sends confirmation email

The Order Service doesn't need to directly wait for all three services.


# Important Point

Microservices can use BOTH synchronous and asynchronous communication.

                 Microservices
                      |
             Interservice Communication
                      |
             +--------+--------+
             ↓                 ↓
       Synchronous       Asynchronous
             |                 |
       REST / gRPC       Kafka / RabbitMQ


The choice depends on the requirement.

If you need an immediate response → Synchronous

If you can process the task/event later → Asynchronous


//==========================================================================================



# Why Transform from Monolith to Microservices?

A Monolithic Architecture means the entire application is built and deployed as one single unit.

For example:

                  E-Commerce Application
                          |
        +-----------------+-----------------+
        |                 |                 |
        ↓                 ↓                 ↓
   User Module       Order Module      Payment Module
        |                 |                 |
        +-----------------+-----------------+
                          |
                      Database


Initially, this can be completely fine.

But as the application becomes very large, the monolith can start creating problems.

At that point, we may transform the monolith into Microservices.


# 1. Independent Scaling

This is one of the biggest reasons.

Suppose our monolithic application has:

- User functionality
- Product functionality
- Order functionality
- Payment functionality

Now imagine the Product module receives 10 times more traffic than the other modules.

In a monolith, we generally have to replicate the ENTIRE application.

For example:

                Monolithic Application
                        |
          +-------------+-------------+
          ↓             ↓             ↓
       Server 1      Server 2      Server 3
          |             |             |
     Entire App    Entire App    Entire App


Even if only the Product functionality needs more capacity,
we are replicating the entire application.

With microservices:

              Product Service
                    |
          +---------+---------+
          ↓         ↓         ↓
       Server 1  Server 2  Server 3


We can scale ONLY the Product Service.

Other services don't need to be replicated unnecessarily.


So:

Monolith:

Scale entire application.

Microservices:

Scale only the service that needs more resources.


# 2. Independent Deployment

In a monolith, suppose we have:

User Module
Order Module
Payment Module
Product Module

Now we make a small change to the Payment Module.

Because everything is part of one application, we generally have to:

1. Build the entire application.
2. Test the entire application.
3. Deploy the entire application.

For example:

Payment Module changed
        |
        ↓
Build entire application
        |
        ↓
Deploy entire application


With microservices:

Payment Service
      |
      ↓
Make changes
      |
      ↓
Build Payment Service
      |
      ↓
Deploy Payment Service


We don't necessarily need to redeploy the User Service,
Order Service, or Product Service.

This is called:

INDEPENDENT DEPLOYMENT.


# 3. Fault Isolation

In a large monolith, different modules are tightly connected.

For example:

                  Monolithic Application
                          |
        +-----------------+----------------+
        |                 |                |
        ↓                 ↓                ↓
      User             Order           Payment
     Module            Module           Module


If there is a serious problem inside the application,
it can potentially affect the entire application.

With microservices:

                 Microservices
                      |
       +--------------+--------------+
       |              |              |
       ↓              ↓              ↓
 User Service    Order Service   Payment Service


If Payment Service fails:

Payment Service ❌

User Service    ✅
Order Service   ✅


The entire application doesn't necessarily have to go down.

This gives us better FAULT ISOLATION.


# 4. Different Services Can Scale Differently

Different parts of an application may have completely different traffic patterns.

For example:

Product Service:
10,000 requests/sec

User Service:
1,000 requests/sec

Admin Service:
100 requests/sec


In a monolith:

All of them are inside the same application.

So scaling becomes:

Entire Application → More Servers


In microservices:

Product Service → 10 servers
User Service → 2 servers
Admin Service → 1 server


Each service can be scaled according to its own requirements.


# 5. Technology Flexibility

In a monolithic application, the entire application is usually built around a common technology stack.

For example:

Frontend → React
Backend → Node.js
Database → MongoDB


But in microservices, different services can use different technologies if there is a good reason.

For example:

User Service
→ Node.js

Recommendation Service
→ Python

Payment Service
→ Java

Analytics Service
→ Python


Each service can use the technology that best fits its requirements.

However, this does NOT mean we should randomly use different technologies everywhere.

Too many technologies can make the system harder to maintain.


# 6. Smaller Codebases

A large monolithic application can eventually become huge.

For example:

                    Monolith
                       |
              1,000,000+ lines
                       |
        +--------------+--------------+
        |              |              |
      Users          Orders        Payments


Understanding and modifying such a huge codebase can become difficult.

With microservices:

User Service
    ↓
Smaller codebase

Order Service
    ↓
Smaller codebase

Payment Service
    ↓
Smaller codebase


Developers can focus on a smaller part of the system.


# 7. Team Independence

Imagine a large company with different teams:

Team A → User functionality
Team B → Payment functionality
Team C → Order functionality
Team D → Recommendation functionality


In a monolith, all teams may work inside the same large codebase.

As the number of developers increases, this can create:

- Merge conflicts
- Coordination problems
- Dependency issues
- Difficult deployments


With microservices:

Team A → User Service
Team B → Payment Service
Team C → Order Service
Team D → Recommendation Service


Each team can own and manage its service more independently.


# 8. Faster Development

Because services are smaller and independently deployable,
teams can potentially develop and release features faster.

For example:

Team A → Payment Service
Team B → Order Service
Team C → Recommendation Service


Team A can deploy a Payment Service change without waiting for
Team B and Team C to finish their work.

This can improve development velocity.


# 9. Technology Can Be Changed Gradually

Suppose we have a very old monolithic application.

For example:

                 Old Monolith
                     |
              PHP Application
                     |
        +------------+------------+
        |            |            |
      Users        Orders       Payments


Rewriting the entire application at once would be very risky.

Instead, we can gradually extract services.

Step 1:

                 Old Monolith
                     |
              PHP Application
                     |
        +------------+------------+
        |            |
      Users        Orders

                    +
                    |
                    ↓
              Payment Service
                 Node.js


Later:

                 Old Monolith
                     |
              PHP Application
                     |
                  Users

                    +
          +---------+---------+
          ↓                   ↓
     Order Service       Payment Service


Eventually, more and more functionality can be extracted.

This approach is often called the:

STRANGLER PATTERN


# 10. Better Organizational Structure

A large monolith can become difficult to understand because everything
is connected to everything else.

For example:

Users
  ↕
Orders
  ↕
Payments
  ↕
Inventory
  ↕
Notifications


Microservices try to divide the application according to
business responsibilities.

For example:

User Service
Order Service
Payment Service
Inventory Service
Notification Service


Each service has a clear responsibility.


# IMPORTANT: Microservices Are NOT Always Better

This is extremely important.

We should NOT think:

Microservices > Monolith

Instead:

Small/medium application
        ↓
Monolith may be better


Very large and complex application
        ↓
Microservices may make more sense


Microservices introduce their own complexity:

- Network communication
- Service discovery
- Load balancing
- Distributed logging
- Distributed tracing
- Message queues
- Data consistency
- Deployment complexity
- Monitoring
- Security
- Failure handling


A monolith is much simpler to develop and operate when the
application is small enough.


# Simple Comparison

Monolith:

                 One Large Application
                         |
        +----------------+----------------+
        |                |                |
      Users            Orders          Payments


Scaling:
→ Scale entire application

Deployment:
→ Usually deploy entire application

Codebase:
→ One large codebase

Communication:
→ Mostly internal function/method calls

Complexity:
→ Lower initially


Microservices:

             Multiple Independent Services
                       |
       +---------------+---------------+
       |               |               |
       ↓               ↓               ↓
 User Service    Order Service    Payment Service


Scaling:
→ Scale individual services

Deployment:
→ Deploy services independently

Codebase:
→ Multiple smaller codebases

Communication:
→ Network communication
   (REST, gRPC, Kafka, RabbitMQ, etc.)

Complexity:
→ Higher


# Most Important Reason

The main reason to move from a monolith to microservices is:

As the application becomes very large, we may need to
scale, deploy, develop, and maintain different parts of the
application independently.

Microservices allow us to divide the application into
independently manageable services.


# One-Line Summary

Monolith:

ONE BIG APPLICATION


Microservices:

MANY SMALL INDEPENDENT SERVICES


The transformation is mainly done to achieve:

- Independent Scaling
- Independent Deployment
- Fault Isolation
- Team Independence
- Smaller Codebases
- Better Scalability
- Technology Flexibility

But we should introduce microservices ONLY when the benefits
justify the additional complexity.













