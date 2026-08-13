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

// now , if we go to localhost:3000, we will be able to access my frontend, here in my backend ,we also have frontend,  now this backend server will serve both the frontend and the API's 



//===================================================

=> now, what happened in the above case introduces us to multistages build in docker.

=> now , we will create a dockerfile and .dockerignore file in day-161. but the question arise that we have both the dockerfile and .dockerignore file in frontend and backend folder, so why do we need them in day-161?

=> the answer is , the dockerfile in backend will create a standalone image for backend, the dockerfile in frontend will create a standalone image in frontend. when we run the image of backend, it will create a container for backend, when we run the image of frontend, it will create a container for frontend. But we want an image that has both our frontend and backend

=> there could be one solution where at first we run the `npm run build` in frontend, it will give us a `dist` folder, which , we will move to `backend` and rename it as `public` and then run the dockerfile, now the image which will be created will have both backend and frontend. this idea look good on paper but is not viable because the process is manual and we'll have to make it automatic. with the help of docker , we'll automate it.

=> we will create a dockerfile in the root, i.e., day-161, and this dockerfile will have both frontend and backend.





//===================================================
WATCH THE VIDEO AGAIN AND AGAIN