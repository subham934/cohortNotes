Kubernetes is a tool for creating new containers, scaling them, and routing traffic between them. We can scale up or down as needed to handle traffic spikes. We can deploy new version of our app as needed.

Pod ⇒ The smallest deployable unit in Kubernetes. A Pod contains one or more containers that run together. If traffic increases, we can increase the number of Pods to handle the additional load. If traffic is low, we can reduce the number of Pods to save resources.

Deployment ⇒ Manages the desired number and lifecycle of Pods. It keeps the specified number of Pods running and handles updates, rollbacks, and replacements. For example, if we set replicas: 3, the Deployment ensures that 3 Pods are running. If a Pod crashes, the Deployment creates a replacement Pod to maintain the desired count. When we deploy a new version of our application, the Deployment manages the process of replacing the old Pods with new Pods running the new version.

If we want the number of Pods to automatically increase or decrease based on application load/traffic, we can use HPA (Horizontal Pod Autoscaler) with the Deployment.


Service => Stable network endpoint that finds pods using labels and routes traffic to them. Pods crash hote rehte hain aur naye Pods create hote rehte hain. Jab naya Pod create hota hai, uska IP address different ho sakta hai. Isliye hum directly Pod ke IP address par traffic nahi bhejte. Hum Service ko traffic dete hain, aur Service apne labels ke through matching Pods ko automatically find karke traffic unke beech route karta hai.

So, simple flow:
Client → Service → Matching Pods

Ingress => HTTP routing rules — which domain/path goes to which service.

Ingress Controller => The actual pod (nginx) that reads Ingress rules and routes real traffic.



Namespace => Virtual cluster inside a cluster. Used to separate environments.
ConfigMap => Store non-secret config (env variables) separately from your image.
Secret => Store sensitive config (passwords, tokens) encoded in the cluster.  



//==================================================
Pod is a server. agar load badh gaya toh number of pods increase karenge. Deployment is the one that manages the pods. Deployment ka kaam hain ki agar server ka version update karna hain toh purane server ko rakhega but parallelly naye server ko deploy karega phir wo check karega ki jo naya version hain wo sahi se kaam kar raha hain ya nahi. Agar sahi se kaam kar raha hain toh purane server ko ak ak karke down kar dega aur traffic ko naye server se route kar dega. Agar nahi kar raha hain toh purane server ko rakhega aur naye server ko hata dega.


                    Deployment
        ┌─────────────────────────────────┐
        │                                 │
        │   Pod =                         │
        │                                 │
        │   ┌─────────┐  ┌─────────┐     │
        │   │ Server  │  │ Server  │     │
        │   │ server  │  │ server  │     │
        │   │   -v1   │  │   -v1   │     │
        │   └─────────┘  └─────────┘     │
        │                                 │
        │              ┌─────────┐        │
        │              │ Server  │        │
        │              │ server  │        │
        │              │   -v1   │        │
        │              └─────────┘        │
        │                                 │
        │   ┌─────────┐  ┌─────────┐     │
        │   │ Server  │  │ Server  │     │
        │   │ server  │  │ server  │     │
        │   │   -v2   │  │   -v2   │     │
        │   └─────────┘  └─────────┘     │
        │                                 │
        │              ┌─────────┐        │
        │              │ Server  │        │
        │              │ server  │        │
        │              │   -v2   │        │
        │              └─────────┘        │
        │                                 │
        └─────────────────────────────────┘

Deployment
│
├── Pod
│   ├── Server → server-v1
│   ├── Server → server-v1
│   ├── Server → server-v1
│   │
│   ├── Server → server-v2
│   ├── Server → server-v2
│   └── Server → server-v2
│
└── Manages the lifecycle of these Pods



 Service ka kaam hain ki traffic ko pods ke beech route karna. Ingress ka kaam hain ki HTTP routing rules ko define karna. Ingress Controller ka kaam hain ki Ingress rules ko read karke real traffic ko route karna. Namespace ka kaam hain ki alag alag environments ko separate karna. ConfigMap ka kaam hain ki non-secret config ko store karna. Secret ka kaam hain ki sensitive config ko store karna. 


//=============================================================

Kubernetes k ander hota hain deployment aur deployment k ander hota hain pods. Lets name pods as Pod1, Pod2, Pod3. every pod k ander hota hain server jo run karta hain. Inn sabhi pod ko manage karne ka kaam hota hain deployment ka. Manage ka matlab hain ki agar server ka version update karna hain toh purane server ko rakhega but parallelly naye server ko deploy karega phir wo check karega ki jo naya version hain wo sahi se kaam kar raha hain ya nahi. Agar sahi se kaam kar raha hain toh purane server ko ak ak karke down kar dega aur traffic ko naye server se route kar dega. Agar nahi kar raha hain toh purane server ko rakhega aur naye server ko hata dega.

Apart from deployment , we also have service. service k pass traffic aata hain aur service wo traffic ko pods ke beech equally distribute kar deta hain.  Ingress controller, user ki request accept karta hain aur Ingress rules ko read karke uss request ko forward kar deta hain service ke pass. service uss request ko pods ke beech equally distribute kar deta hain.  

=> Ingress controller ko batana padta hain ki jo traffic hamare paas aayega wo kis service ke pass jayega. Hamare pass multiple services ho sakte hain jaise ki service1, service2 aur hamare ingress controller ko batana padta hain ki service1 k liye kaunsa domain/path hain aur service2 k liye kaunsa domain/path hain. Ingress controller ko ye information Ingress rules ke through milti hain. Ingress rules define karte hain ki kaunsa domain/path kis service ke pass jayega.


//=============================================================

Now, let's code::

In the folder day-165, create a folder named `backend`. 

Inside `backend`, npm i express morgan


---------
server.js
---------
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  let sum = 0;
  for (let i = 1; i <= 1000000000; i++) {
    sum += i;
  }
  res.status(200).json({ message: 'Sum calculated successfully', sum });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


-------------
.dockerignore
-------------
node_modules
.env    


----------
dockerfile
----------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]



now, lets create a docker image :::
docker build . -t express_cohort_2:latest


now, lets run the docker image to create a container :::
docker run -p 3000:3000 express_cohort_2:latest


now, go to browser and hit http://localhost:3000. You will see the response after some time because the server is calculating the sum of numbers from 1 to 1 billion.

here, we have an image called `express_cohort_2`, and when we run this image, we get a container(which is a running instance of the image). We can say that "container k andar server aah gaya hain jo run kar raha hain port 3000 pe".  