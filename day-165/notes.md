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
│ ├── Server → server-v1
│ ├── Server → server-v1
│ ├── Server → server-v1
│ │
│ ├── Server → server-v2
│ ├── Server → server-v2
│ └── Server → server-v2
│
└── Manages the lifecycle of these Pods

Service ka kaam hain ki traffic ko pods ke beech route karna. Ingress ka kaam hain ki HTTP routing rules ko define karna. Ingress Controller ka kaam hain ki Ingress rules ko read karke real traffic ko route karna. Namespace ka kaam hain ki alag alag environments ko separate karna. ConfigMap ka kaam hain ki non-secret config ko store karna. Secret ka kaam hain ki sensitive config ko store karna.

//=============================================================

Kubernetes k ander hota hain deployment aur deployment k ander hota hain pods. Lets name pods as Pod1, Pod2, Pod3. every pod k ander hota hain server jo run karta hain. Inn sabhi pod ko manage karne ka kaam hota hain deployment ka. Manage ka matlab hain ki agar server ka version update karna hain toh purane server ko rakhega but parallelly naye server ko deploy karega phir wo check karega ki jo naya version hain wo sahi se kaam kar raha hain ya nahi. Agar sahi se kaam kar raha hain toh purane server ko ak ak karke down kar dega aur traffic ko naye server se route kar dega. Agar nahi kar raha hain toh purane server ko rakhega aur naye server ko hata dega.

Apart from deployment , we also have service. service k pass traffic aata hain aur service wo traffic ko pods ke beech equally distribute kar deta hain. Ingress controller, user ki request accept karta hain aur Ingress rules ko read karke uss request ko forward kar deta hain service ke pass. service uss request ko pods ke beech equally distribute kar deta hain.

=> Ingress controller ko batana padta hain ki jo traffic hamare paas aayega wo kis service ke pass jayega. Hamare pass multiple services ho sakte hain jaise ki service1, service2 aur hamare ingress controller ko batana padta hain ki service1 k liye kaunsa domain/path hain aur service2 k liye kaunsa domain/path hain. Ingress controller ko ye information Ingress rules ke through milti hain. Ingress rules define karte hain ki kaunsa domain/path kis service ke pass jayega.

//=============================================================

Now, let's code::

In the folder day-165, create a folder named `backend`.

Inside `backend`, npm i express morgan

---

## server.js

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

---

## .dockerignore

node_modules
.env

---

## dockerfile

FROM node:20-alpine

WORKDIR /app

COPY package\*.json ./

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

aab hum deployment create karenge aur uske ander 3 pods create karenge. har pod k ander server run karega. hum service create karenge jo traffic ko pods ke beech equally distribute karega. hum ingress controller create karenge jo user ki request accept karega aur Ingress rules ko read karke uss request ko forward karega service ke pass. service uss request ko pods ke beech equally distribute karega.

---

## day-165/k8s/deployment.yml

apiVersion: apps/v1
kind: Deployment
metadata:
name: express-deployment # yeh deployment ka naam hai
spec:
replicas: 3 # kitne pods chahiye, agar 3 hai toh 3 pods maintain honge
selector:
matchLabels:
app: main-server
template:
metadata:
labels:
app: main-server
spec:
containers: # ek pod multiple containers run kar sakta hai, lekin hum sirf ek container rakh rahe hain, if we want multiple containers, we can add them here with different names and images but generally we keep one container per pod - name: main-server # container ka naam
image: express_cohort_2:latest # image ka naam, agar locally present nahi hai toh kahi aur se leke aah jao
imagePullPolicy: Always # agar locally present nahi hai toh kahi aur se (docker hub) leke aah jao
ports: # ports bolta hain ki jo container banega, iss container k ander traffic kis port ke through aayega - containerPort: 3000
resources:
limits:
memory: "128Mi" # RAM 128 megabytes
cpu: "500m" # CPU 500 millicores (0.5 CPU core) # 1 core = 1000m (1000 millicores)
requests:
memory: "64Mi" # RAM 64 megabytes
cpu: "250m" # CPU 250 millicores (0.25 CPU core)

=> avi tak , humne deployment create kiya jiska naam hain "express-deployment", yeh pod k 3 replication create kar raha hain (matlab ki 3 pod create kar rha hain). Kubernetes lakho pod ko easily maintain kar raha hota hai. Jitne bhi pod humne create kiye hain, uss har ak pod ko lebel dete hain `app: main-server`, toh deployment jitne bhi pod manage karega, uss sabhi pod ko lebel `app: main-server` milega.

=> Humare pass deployment bhi 100 or more hota hai. But the question arises ki jo hamare pass deployment hain, "express-deployment" wo kaun sa pods ko manage kar raha hain, kyunki pods toh 100000+ se jyada hota hain, the answer is jinke pass lebels `app: main-server` hoga, usko manage karega hamara deployment named "express-deployment".

=> now, go to the day-165 in terminal and run the following command to create the deployment in Kubernetes:

kubectl apply -f ./k8s/deployment.yml

=> after we run the above code, we can see that, we have 3 pods running in parallel and a deployment named "express-deployment". So, we can say that, deployment is managing the lifecycle of these 3 pods. If any pod crashes, deployment will create a new pod to maintain the desired count of 3 pods.

To check the number of pods running, we can run the following command:

- kubectl get pods

This below is the output of the above command:

NAME READY STATUS RESTARTS AGE
express-deployment-5897776fc7-blxgt 1/1 Running 0 4m44s
express-deployment-5897776fc7-rp2hp 1/1 Running 0 4m44s
express-deployment-5897776fc7-vf85n 1/1 Running 0 4m44s

now , we will delete one pod to see if deployment creates a new pod to maintain the desired count of 3 pods. We can run the following command to delete one pod:

- kubectl delete pod express-deployment-5897776fc7-blxgt

Now, we can see that, deployment has created a new pod to maintain the desired count of 3 pods.

- kubectl get pods
  => the old pod express-deployment-5897776fc7-blxgt has been deleted and a new pod express-deployment-5897776fc7-588pq has been created to maintain the desired count of 3 pods.
  NAME READY STATUS RESTARTS AGE
  express-deployment-5897776fc7-588pq 1/1 Running 0 44s
  express-deployment-5897776fc7-rp2hp 1/1 Running 0 7m35s
  express-deployment-5897776fc7-vf85n 1/1 Running 0 7m35s

//==========================================================

=> Now, to send user's request to the pods, we need Ingress controller and service. Ingress controller will accept the user's request and read the Ingress rules to forward the request to the service. The service will then distribute the request equally among the pods.

=> to setup service, we will create a file named service.yml in the k8s folder and add the following code:

---

## service.yml

kind: Service
apiVersion: v1
metadata:
name: main-server-service # name of the service
spec:
selector: # we have pods which has the label as "app: main-server", if any traffic comes to this service, it will be forwarded to the pods which has the label "app: main-server"
app: main-server # name of the pod which we want to expose, this should match the label of the pod
type: ClusterIP
ports:

- name: name-of-the-port
  port: 80
  targetPort: 3000 # this is the port on which the container is running, so if any traffic comes to this service on port 80, it will be forwarded to the pods on port 3000

=> > now, go to the day-165 in terminal and run the following command to create the service in Kubernetes:
kubectl apply -f ./k8s/service.yml

we will get the service/main-server-service created. The service has been created successfully. To check the service, we can run the following command:

- kubectl get services

This below is the output of the above command:

kubectl get services
NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE
kubernetes ClusterIP 10.96.0.1 <none> 443/TCP 24h
main-server-service ClusterIP 10.96.139.247 <none> 80/TCP 2m19s

//==========================================================
now, we will create Ingress controller and Ingress rules to route the traffic to the service. We will create a file named ingress.yml in the k8s folder. Also , we need to install ingress controller in our cluster. We can use the following command to install ingress controller in our cluster:

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml

=> now that we have installed ingress-controller, it will do nothing. To route the traffic to the service , we need ingress rules. we will create a file named ingress.yml in the k8s folder and add the following code:

---

## ingress.yml

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
name: express-app # name of the ingress
labels:
app.kubernetes.io/name: express-app # label of the ingress
spec:
ingressClassName: nginx
rules:

- http:
  paths:
  - pathType: Prefix
    path: "/" # koi bhi api agar / ke sath start hoti hai, toh usko forward kar do main-server-service ke through
    backend:
    service:
    name: main-server-service
    port:
    number: 80

=> > now, go to the day-165 in terminal and run the following command to create the ingress :
kubectl apply -f ./k8s/ingress.yml

we will get the ingress/express-app created. The ingress has been created successfully. To check the ingress, we can run the following command:

- kubectl get ingress

This below is the output of the above command:
NAME CLASS HOSTS ADDRESS PORTS AGE
express-app nginx \* 172.18.0.2 80 61s

=> now, if we go to browser and hit http://localhost , we will get the response after some time because the server is calculating the sum of numbers from 1 to 1 billion. The request is accepted by the ingress controller, which reads the ingress rules and forwards the request to the service. The service then distributes the request equally among the pods, and one of the pods processes the request and sends back the response.

//==========================================================
//==========================================================

The HorizontalPodAutoscaler (HPA) watches CPU usage across your pods and automatically scales the replica count up or down. When CPU usage exceeds your threshold, it adds pods; when traffic drops, it removes them. It requires metrics-server to read CPU data — on Docker Desktop this is not pre-installed and must be added manually.

Metrics-server by default nahi rehta cluster mein, isliye humein ise install karna padta hai. Yeh metrics-server cluster ke andar jitne bhi pods hain, unko monitor karta hai ki kitna CPU aur kitna memory use kar rahe hain. Agar CPU usage zyada ho raha hai, toh metrics-server HPA ko inform karega ki pods ko scale up karo. Agar CPU usage kam ho raha hai, toh metrics-server HPA ko inform karega ki pods ko scale down karo.

Now, we need to install metrics-server in our cluster to enable Horizontal Pod Autoscaler (HPA). We can use the following command to install metrics-server in our cluster day-165:

 - kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

 - kubectl patch deployment metrics-server -n kube-system --type json -p '[{\"op\":\"add\",\"path\":\"/spec/template/spec/containers/0/args/-\",\"value\":\"--kubelet-insecure-tls\"}]'

 - kubectl rollout status deployment/metrics-server -n kube-system

The above 3 commands helps us to setup metrics-server in our cluster to enable Horizontal Pod Autoscaler (HPA).

## kubectl top pods

=> `kubectl top pods` => shows the CPU and memory usage of the pods.

This below is the output of the above command:
NAME CPU(cores) MEMORY(bytes)  
express-deployment-5897776fc7-588pq 1m 10Mi  
express-deployment-5897776fc7-rp2hp 1m 40Mi  
express-deployment-5897776fc7-vf85n 1m 11Mi


//============================================================

We also have CLI tools called watch cli.
watch = automatically re-run a command at a fixed interval and refresh the output.
I've used the watch CLI using antigravity AI. The prompt was ::

there is this tool for linux or mac called `brew install watch` which is install watch but i've no idea how to do it for my windows pc , how do i do it, so, watch = automatically re-run a command at a fixed interval and refresh the output. please install it, only install watch, nothing else

# `watch` CLI

`watch` ek CLI utility hai jo kisi command ko fixed interval par automatically baar-baar run karta hai aur uska latest output screen par refresh karta rehta hai.

Simple words mein:

watch = kisi command ko automatically repeat karna aur uska output continuously refresh karna.

Example:

watch -n 2 kubectl top pods

Iska matlab:

watch
↓
`kubectl top pods` command run karo
↓
2 seconds wait karo
↓
Command dobara run karo
↓
Latest output refresh karo
↓
Repeat...

## Windows par `watch` kaise install kiya?

Mac/Linux par hum normally `watch` ko package manager se install kar sakte hain:

brew install watch

Lekin Windows mein `watch` natively available nahi hota.

Isliye Windows par humne BusyBox ka use kiya.

## BusyBox kya hai?

BusyBox ek single `.exe` file hai jisme bahut saare common Linux/Unix CLI commands bundled hote hain.

For example:

watch
grep
ls
cat
wget
etc.

Isko simple way mein ek "box full of Linux commands" samajh sakte hain.

Iska benefit ye hai ki hume har Linux command ko separately install karne ki zarurat nahi padti.

## Windows par humne kya kiya?

Humne BusyBox ka Windows executable download kiya:

Invoke-WebRequest `  -Uri "https://frippery.org/files/busybox/busybox64.exe"`
-OutFile "$env:APPDATA\npm\watch.exe" `
-UseBasicParsing

Yahan humne `busybox64.exe` ko directly `watch.exe` naam se save kiya.

## `watch.exe` hi kyun?

BusyBox ye check karta hai ki executable ko kis naam se call kiya gaya hai.

For example:

watch.exe → watch command
grep.exe → grep command
cat.exe → cat command

Isliye agar file ka naam:

watch.exe

hai, aur hum run karte hain:

watch -n 2 kubectl top pods

to BusyBox samajh jaata hai ki hume `watch` command execute karna hai.

## `watch.exe` ko `$env:APPDATA\npm` mein kyun rakha?

Ye folder generally Node.js/npm installation ke through PATH mein available hota hai.

Example:

C:\Users\<username>\AppData\Roaming\npm\

Agar hum `watch.exe` ko is folder mein rakh dete hain, to Windows us command ko kisi bhi terminal se recognize kar sakta hai.

Isliye hume har baar executable ka complete path nahi dena padega.

Instead of:

C:\some-folder\watch.exe -n 2 kubectl top pods

we can simply run:

## watch -n 2 kubectl top pods

# Overall Flow

Mac/Linux:

brew install watch
↓
watch command ready

Windows:

Download BusyBox
↓
busybox64.exe
↓
Rename/save it as `watch.exe`
↓
Put it inside a folder that's already in PATH
↓
watch command ready

## Short Version

Windows mein `watch` natively available nahi hota. Isliye hum BusyBox ka Windows executable download karke usse `watch.exe` ke naam se npm ke PATH folder mein rakh sakte hain.

BusyBox executable ko jis naam se call kiya jaata hai, woh usi corresponding command ko execute karta hai.

Iske baad hum terminal mein directly:

## watch -n 2 kubectl top pods

use kar sakte hain.

Yahan:

watch → command ko repeatedly run karta hai
-n 2 → har 2 seconds mein command run karta hai
kubectl top pods → Pods ka CPU aur memory usage dikhata hai

//==========================================================

We have one more CLI tool called heyCLI

this is a tool jo kisi bhi server pe kuch numbers of traffic bhej raha hota hain,

I've installed it using antigravity AI. The prompt was ::
there is one more cli called brew install hey, but its not available for windows, how do i install in my system

the command i've to write is below::

## hey -z 2m -c 200 http://localhost
=> 2 minutes ke liye 200 concurrent requests bhej raha hain http://localhost pe



//==========================================================


also , jo hamare 3 pods hain, unke andar jo traffic chal raha hain , unko nikalne k liye we can use the following command:


## kubectl logs deployment/express-deployment --tail=100 -f

Iska matlab hain ki humne jitne bhi pods hain, unke andar jo traffic chal raha hain, usko nikalne k liye humne `kubectl logs` command ka use kiya hain. Is command mein humne deployment ka naam diya hain aur `--tail=100` ka matlab hain ki last 100 lines ko show karo aur `-f` ka matlab hain ki continuously follow karo aur latest logs ko show karo. Overall, iska matlab hain ki humne jitne bhi pods hain, unke andar jo traffic chal raha hain, usko nikalne k liye `kubectl logs` command ka use kiya hain.




//==========================================================
//==========================================================


Now, when we run all the 3 command, i.e., watchCLI, heyCLI and kubectl logs, we will see the traffic on all 3 pods simultaneously. Aur kyunki jo hamara route tha wo thoda heavy tha, toh response aane main time lag raha hain, hamare pods ka CPU usage bhi badh chuka hain. Hamre pods ko scale karna hain, for that we need to run the below command::

kubectl autoscale deployment express-deployment `
  --min=3 `
  --max=10 `
  --cpu-percent=50

Iska matlab:

express-deployment ke pods minimum 3 aur maximum 10 ke beech scale honge
Agar average CPU usage 50% se zyada ho jaata hai, to Kubernetes automatically naye pods add karega (max 10 tak)
Agar CPU usage kam ho jaata hai, to pods bhi automatically kam ho jayenge (min 3 tak)

Yani ye ek HorizontalPodAutoscaler (HPA) setup hai jo CPU load ke hisaab se pods ki count dynamically adjust karta hai.

Now, we will delete all the previous pods with the below command, this will delete all the pods and because the heyCLI and kubectl logs commands are running in the background, they will continue to run even after the pods have been deleted and stop after 10-15mins , after that they will stop running and the number of pods will reduce to 3.

kubectl delete pod express-deployment-5897776fc7-588pq --grace-period=0 --force
kubectl delete pod express-deployment-5897776fc7-rp2hp --grace-period=0 --force
kubectl delete pod express-deployment-5897776fc7-vf85n --grace-period=0 --force




to edit the HPA again apply it to the cluster, we can use the following command:

# kubectl edit hpa express-deployment





//==========================================================
//==========================================================


=> Hamare pass Metrics Server hain aur uske saath hain HPA(Horizontal Pod AutoScaler). HPA pod ko autoscale karta rehta hain on the basis of load. Metrics Server monitor karta hain ki pod ki CPU usage aur memory usage ko. Metrics server se HPA continuously data leta rehta hain aur HPA ko agar lagta hain ki CPU usage zyada ho raha hain toh pods ko scale up karega. Agar CPU usage kam ho raha hain toh HPA ko inform karega ki pods ko scale down karo.

Kubernetes ka usage hain ki wo microservice support karta hain. 

Toh humne abhi tak jitne bhi files banaya hain inside `backend` folder , unko dalange ek folder jiska naam hain `main-server` , which is inside the `backend` folder. Also inside the `backend` folder, we'll create one more folder called `product`

Inside the `product` folder we'll create `npm init -y`
then we'll install express and morgan axios
- `npm i express morgan axios`

-----------------
product/server.js
-----------------

import express from "express";
import morgan from "morgan";
import axios from "axios";


const app = express();

app.use(morgan("dev"));
app.use(express.json());


app.get("/", async (req, res)=>{
    const response = await axios.get("http://main-server-service/"); // this http://main-server-service/ means that we have created a service called main-server-service (check service.yml), so, now we are creating a server that calls this service and then return the response.  
    res.send(response.data);
})

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})


---------------------
product/.dockerignore
---------------------
node_modules
.env

------------------
product/dockerfile
------------------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]


Now, lets create an image for this product server and run it. Go to the directory:: `D:\cohort\day-165\backend\product` and run the below command::

# docker build . -t product_server:latest


Now, we'll create a deployment file and a service file for this product server.


------------------
k8s/deployment-product.yml
------------------
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: product
  template:
    metadata:
      labels:
        app: product
    spec:
      containers:
      - name: product
        image: product_server:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
          requests:
            memory: "64Mi"
            cpu: "250m"

now , apply this deployment using the below command::


kubectl apply -f  ./k8s/deployment-product.yml

Here, we have created one more deployment, and once we run this command, we will see the product-deployment in the output with 3 pods running.


Now, lets create a service for the product deployment, 



------------------
k8s/service-product.yml
------------------
kind: Service
apiVersion: v1
metadata:
  name:  product-service
spec:
  selector:
    app:  product
  type:  ClusterIP 
  ports:
  - name:  product-service-port
    port:  80
    targetPort:  8080




Now, lets apply this service using the below command::


kubectl apply -f  ./k8s/service-product.yml



now, we need to make changes in ingress.yml

---------------
k8s/ingress.yml
---------------



apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: express-app # name of the ingress
  labels:
    app.kubernetes.io/name: express-app # label of the ingress
spec:
  ingressClassName: nginx
  rules:
    - http:
        paths:
          - pathType: Prefix
            path: '/' # koi bhi api agar / ke sath start hoti hai, toh usko forward kar do main-server-service ke through
            backend:
              service:
                name: main-server-service
                port:
                  number: 80
    - http:
        paths:
          - pathType: Prefix
            path: '/api/product'
            backend:
              service:
                name: product-service
                port:
                  number: 80

Now, lets apply the ingress using the below command::

kubectl apply -f  ./k8s/ingress.yml


now, lets run logs for product-deployment:

# kubectl logs deployment/product-deployment --tail=100 -f



//==========================================================
//==========================================================

now, if we go and type http://localhost/api/product in our browser, we will get the response as ::
Cannot GET /api/product

so, we need to make changes in server.js and change the path from "/" to "/api/product".


--------------- 
product/server.js
---------------

import express from "express";
import morgan from "morgan";
import axios from "axios";


const app = express();

app.use(morgan("dev"));
app.use(express.json());


app.get("/api/product", async (req, res)=>{
    const response = await axios.get("http://main-server-service/"); // this http://main-server-service/ means that we have created a service called main-server-service (check service.yml), so, now we are creating a server that calls this service and then return the response.  
    res.send(response.data);
})

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})

now , lets create an image for the product server using the below command:

# docker build . -t product_server:latest


now, that image is created again, we also need to update the deployment file , for that we have another command called ::

# kubectl rollout restart deployment/product-deployment

  

//==========================================================
//==========================================================
