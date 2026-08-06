What is AWS?
-> its a cloud service provider

AWS is a cloud provider providing IAAS, PAAS, 

VPC- Virtual Private Cloud
-> A Virtual Private Cloud (VPC) is a secure, isolated private network hosted within a public cloud. It gives you full control over your cloud environment, letting you run servers, store data, and set up network rules away from other users.
-> VPC is a big private network
-> subnet : 
---> A smaller network built inside your big VPC network.
---> Used to group and isolate your servers (like keeping databases private and web servers public).
---> Lives inside a specific data center area called an Availability Zone (AZ).
=> public vs private subnet: a VPC has public and private subnet, public is used for public facing resources like web servers, private is used for private resources like databases. with the help of internet , we can access public subnet but not private subnet.


ALB - Application Load Balancer: it sits infront of our containers and distributes incoming traffic across all running ECS tasks. It's also the single public-facing entry point.
- we have a zomato dilivery guy (containers). ALB is the dispatcher who fairly assigns orders (requests) to whichever guy is free.

In VPC we have public and private subnet. In public subnet, we have our server which has deployed both the frontend and backend. now, generally , ALB is inside VPC.  since ALB has multiple server since one server is not able to handle the incoming traffic. so, when the user , with the help of internet, makes a request at ALB ,  this ALB forward the request to the available server based on available capacity (kis server pe kam load hai aur kispe zyada load hai, jis server pe kam load hota hai, uss server pe request forward karta hai). ALB is the thing , jo actual load balancing perform kar raha hota hai, multiple server k beech main.  

--------------
Security Group
--------------

-> A securiy group is a virtual firewall that controls which traffic is allowed IN(inbound) and OUT (outbound) of your resource.
-> It's the bouncer at a club. You write Rules: "Allow HTTP on port 8O", "Allow only from the IP". Everything else is blocked by default. 

When we run an application locally, we usually access it using a URL like:

`http://localhost:5173`

Here, **5173** is the port on which the Vite development server is running.

However, in **production**, we usually don't specify a port in the URL. For example:

`http://example.com`
or
`https://example.com`

This is because browsers automatically use **default ports** based on the protocol:

* **HTTP** → Port **80**
* **HTTPS** → Port **443**

So, when we type `http://example.com`, the browser actually sends the request to **port 80**. Similarly, `https://example.com` automatically sends the request to **port 443**.

Now let's understand what happens when the request reaches the **Application Load Balancer (ALB)**.

The ALB receives incoming requests from the internet only on its **listener ports**, which are generally:

* **Port 80** for HTTP traffic
* **Port 443** for HTTPS traffic

So, every request coming from the internet reaches the ALB on **either port 80 or port 443**, depending on the protocol being used.

However, the actual backend application (for example, a Node.js/Express server) is usually **not running on port 80 or 443**. It might be running on **port 3000**, **5000**, or any other internal port.

For example:

* Client → `https://example.com`
* Browser sends the request to **ALB on port 443**
* ALB forwards the request to the backend server on **port 3000**

The communication between the **ALB and the EC2 server** happens over the **TCP protocol** (Layer 4). The ALB establishes a TCP connection to the target server (for example, port 3000) and forwards the HTTP/HTTPS request to it.

### Complete Flow

```
Client
   │
   │ HTTPS Request
   ▼
Application Load Balancer (Port 443)
   │
   │ TCP Connection
   ▼
EC2 Instance (Node.js Server running on Port 3000)
```

**Important Points to Remember:**

* During development, we access the app using ports like **5173**, **3000**, etc.
* In production, the browser automatically uses:

  * **Port 80** for HTTP
  * **Port 443** for HTTPS
* The **ALB listens only on ports 80 and/or 443**.
* The backend application can run on **any internal port** (e.g., 3000).
* The ALB receives the client's request and forwards it to the backend server on the configured target port.
* The ALB communicates with the backend server over **TCP**, while the application data being carried is **HTTP/HTTPS**.


-> Security control karte hai ki kis protocol se kis PORT pe request aah sakti hain, matlab ALB pe PORT 8080 pe kya internet se request aah sakti hain ya nahi. 

-> Security group rules define karte hain ki kis PORT pe traffic aah sakta hai, aur kis port se traffic bahar ja sakta hain. 
-> agar hum rule na banaye toh traffic block ho jayega. 

-> we also need to make a rule to forward the traffic from ALB to the server, for that, we need to define the protocol and port on which the server is running, which is TCP and port 3000 in our case. 


//=====================================
Target Group: A Target Group is like a list of the healthy servers/containers on which ALB can send traffic. 

//=====================================

here, for practice, we have two image for frontend and backend, but for production , we create a single image, and when we run this image, we get a fullStack server. we need to store this image in AWS. we store image in ECR. so, ECR is the storage place for Image. 
-> ECS is the place where we run image.