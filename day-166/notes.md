# Skaffold + Docker + Kubernetes — Complete Hinglish Notes

## 1. Sabse pehle: Skaffold ki zarurat kyun padti hai?

Maan lo hum ek MERN application bana rahe hain jo Docker containers ke andar run ho rahi hai aur Kubernetes us application ko manage kar raha hai.

Development ke time hum baar-baar code change karenge.

Example:

```text
user.js mein code change
        ↓
Docker image rebuild
        ↓
Container update
        ↓
Kubernetes deployment update
        ↓
Application test
```

Agar har chhote code change ke baad ye sab manually karna pade, development bahut slow aur irritating ho jayega.

Skaffold isi problem ko solve karta hai.

---

# 2. Skaffold kya hai?

Simple definition:

Skaffold ek development tool hai jo Docker aur Kubernetes based applications ke development workflow ko automate karta hai.

Ye tumhare project ki files ko watch karta hai.

Jab koi file change hoti hai, Skaffold decide karta hai:

1. Kya sirf changed file ko running container mein copy/sync karna hai?
2. Ya Docker image ko dobara build karna hai?

Isliye basic idea:

```text
Code Change
    ↓
Skaffold
    ↓
┌──────────────────────┐
│                      │
│   Simple change?     │
│       ↓              │
│      SYNC             │
│                      │
│   Dependency change? │
│       ↓              │
│     REBUILD           │
│                      │
└──────────────────────┘
```

Skaffold ka main purpose development ko fast aur automatic banana hai.

---

# 3. Docker, Kubernetes aur Skaffold mein difference

Ye teen alag cheezein hain.

## Docker

Docker ka kaam application ko container/image ke form mein package karna hai.

```text
Application
     ↓
 Dockerfile
     ↓
 Docker Image
     ↓
 Container
```

Example:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "nodemon", "src/index.js"]
```

Docker basically bol raha hai:

"Is Node.js application ko ek container ke andar kaise run karna hai?"

---

## Kubernetes

Kubernetes containers ko manage karta hai.

Kubernetes ke through hum define kar sakte hain:

* kitne Pods chalenge
* Pods ko kaise run karna hai
* networking kaise hogi
* application ko kaise expose karna hai
* failed Pods ko kaise replace karna hai

Example:

```text
Deployment
    ↓
┌──────────────┐
│              │
Pod 1        Pod 2
│              │
Container    Container
```

---

## Skaffold

Skaffold development workflow ko automate karta hai.

```text
             CODE
              ↓
          Skaffold
          ↙      ↘
       Docker   Kubernetes
       Build      Deploy
          ↘      ↙
         Running App
```

Short mein:

```text
Docker     = container/image banata hai
Kubernetes = containers/Pods manage karta hai
Skaffold   = development workflow automate karta hai
```

---

# 4. Real-life example

Maan lo tumhare paas do microservices hain:

```text
mern-app/
│
├── core/
│
└── notification/
```

Core service aur notification service dono alag applications/services hain.

Har service ka apna:

* Dockerfile
* package.json
* source code
* Kubernetes Deployment
* Kubernetes Service

ho sakta hai.

Project structure:

```text
mern-app/
│
├── skaffold.yaml
│
├── core/
│   ├── dockerfile.dev
│   ├── .dockerignore
│   ├── nodemon.json
│   ├── package.json
│   └── src/
│       └── index.js
│
├── notification/
│   ├── dockerfile.dev
│   ├── .dockerignore
│   ├── nodemon.json
│   ├── package.json
│   └── src/
│       └── index.js
│
└── k8s/
    ├── core-deployment.yml
    ├── core-service.yml
    ├── notification-deployment.yml
    ├── notification-service.yml
    └── ingress.yml
```

---

# 5. `skaffold.yaml` kya hai?

`skaffold.yaml` Skaffold ki configuration file hai.

Jaise:

```text
Dockerfile
    ↓
Docker ko instructions deta hai

deployment.yml
    ↓
Kubernetes ko instructions deta hai

skaffold.yaml
    ↓
Skaffold ko instructions deta hai
```

Skaffold ko is file ke through bataya jata hai:

* kaunse Docker images build karni hain
* Docker build context kya hai
* kaunsi files sync karni hain
* Kubernetes ke kaunse manifests use karne hain
* port forwarding kaise karni hai

Isliye `skaffold.yaml` ko setup ka heart samajh sakte ho.

---

# 6. Skaffold ka sabse important concept: SYNC vs REBUILD

Ye sabse important part hai.

## SYNC

Agar sirf source code change hua hai, toh Docker image ko dobara build karna unnecessary hai.

Example:

```text
core/src/routes/user.js
```

Tumne `user.js` mein code change kiya.

Skaffold check karega:

```text
Kya .js file sync rule ke andar aati hai?
        ↓
       YES
        ↓
File ko directly running Pod mein copy karo
        ↓
Nodemon change detect karega
        ↓
Node server restart
```

Is case mein Docker image rebuild nahi hoti.

---

## REBUILD

Ab maan lo tumne new npm package install kiya:

```bash
npm install express-validator
```

Ab package.json change hua.

Sirf package.json ko container mein copy karne se kaam nahi chalega.

Container ke andar package install bhi hona chahiye.

Isliye:

```text
package.json changed
       ↓
Skaffold detects change
       ↓
SYNC nahi
       ↓
Docker image REBUILD
       ↓
npm install
       ↓
New image
       ↓
New/updated Pod
```

---

# 7. Simple rule yaad rakho

```text
Source code change
       ↓
      SYNC
       ↓
Fast
```

Lekin:

```text
Dependencies / Dockerfile change
       ↓
     REBUILD
       ↓
Docker image dobara banti hai
```

Example:

```text
src/index.js
src/routes/user.js
src/controllers/user.js
        ↓
      SYNC
```

Whereas:

```text
package.json
package-lock.json
dockerfile.dev
        ↓
     REBUILD
```

---

# 8. Skaffold + Nodemon ka relationship

Ye dono ko confuse mat karna.

## Skaffold

Skaffold tumhare computer par file changes watch karta hai.

```text
Your Computer
      ↓
    Skaffold
      ↓
Running Pod
```

## Nodemon

Nodemon container ke andar Node.js application ko watch karta hai.

```text
Running Container
       ↓
     Nodemon
       ↓
 Node.js process
```

Complete flow:

```text
Tum code change karte ho
        ↓
Skaffold change detect karta hai
        ↓
File container mein sync hoti hai
        ↓
Nodemon change detect karta hai
        ↓
Node server restart
```

Therefore:

```text
Skaffold = file ko container tak pahunchata hai

Nodemon = container ke andar Node server restart karta hai
```

Ye difference bahut important hai.

---

# 9. Dockerfile ko samjho

Development Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npx", "nodemon", "src/index.js"]
```

Ab line-by-line:

## `FROM`

```dockerfile
FROM node:18-alpine
```

Node.js ka environment use karo.

---

## `WORKDIR`

```dockerfile
WORKDIR /app
```

Container ke andar working directory `/app` hogi.

---

## `COPY package*.json`

```dockerfile
COPY package*.json ./
```

Pehle package.json aur package-lock.json ko copy karo.

---

## `RUN npm install`

```dockerfile
RUN npm install
```

Application ki dependencies install karo.

---

## `COPY . .`

```dockerfile
COPY . .
```

Ab baaki source code container ke andar copy karo.

---

## `EXPOSE`

```dockerfile
EXPOSE 3000
```

Application container ke andar port 3000 use karegi.

---

## `CMD`

```dockerfile
CMD ["npx", "nodemon", "src/index.js"]
```

Container start hote hi Nodemon ke through Node application start hogi.

---

# 10. Dockerfile mein `package.json` pehle kyun copy karte hain?

Ye Docker layer caching ke liye important hai.

Dockerfile:

```dockerfile
COPY package*.json ./
RUN npm install

COPY . .
```

Suppose tumne sirf:

```text
src/index.js
```

change kiya.

`package.json` change nahi hua.

Toh Docker bol sakta hai:

```text
package.json same hai
        ↓
npm install dobara karne ki zarurat nahi
        ↓
Cached layer use karo
```

Isse rebuild much faster hota hai.

Simple idea:

```text
package.json unchanged
        ↓
npm install layer cached
        ↓
FAST REBUILD
```

---

# 11. `.dockerignore` kya hai?

`.dockerignore` Docker ko batata hai ki kaunsi files Docker build context mein include nahi karni hain.

Example:

```text
node_modules
.git
*.log
.env
dist
build
.DS_Store
```

Sabse important:

```text
node_modules
```

`node_modules` bahut bada ho sakta hai.

Isliye local `node_modules` ko Docker context mein bhejna unnecessary hai.

Container apna `npm install` khud karega.

Simple:

```text
.dockerignore

node_modules
     ↓
Docker ko bolo:
"Isko ignore karo."
```

---

# 12. Kubernetes Deployment kya hai?

Example:

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: core-deployment

spec:
  replicas: 2
```

Important part:

```yaml
replicas: 2
```

Meaning:

```text
Core application ke 2 Pods maintain karo.
```

Conceptually:

```text
             Deployment
                 │
        ┌────────┴────────┐
        ↓                 ↓
      Pod 1             Pod 2
        │                 │
     Node app          Node app
```

Agar ek Pod fail ho jata hai, Kubernetes desired number of Pods maintain karne ki koshish karega.

---

# 13. Kubernetes Service kya hai?

Pods ke IP addresses stable nahi hote.

Example:

```text
Pod
IP = 10.1.1.5
```

Pod delete/recreate hone ke baad:

```text
Pod
IP = 10.1.1.9
```

Agar applications directly Pod IP use karein, toh problem hogi.

Isliye Kubernetes Service use hoti hai.

```text
             core-service
                  │
          ┌───────┴───────┐
          ↓               ↓
        Pod 1           Pod 2
```

Service ek stable network endpoint provide karti hai.

Tumhare example mein:

```yaml
kind: Service

metadata:
  name: core-service

spec:
  selector:
    app: core

  type: ClusterIP
```

Service `app: core` label wale Pods ko target karegi.

---

# 14. `ClusterIP` kya hai?

```yaml
type: ClusterIP
```

ka simple meaning:

Service cluster ke andar accessible hai.

External users directly Service ko access nahi karte.

External HTTP traffic ke liye yahan Ingress use kiya ja raha hai.

---

# 15. Ingress kya hai?

Ingress ko ek traffic router samjho.

Suppose user request karta hai:

```text
http://localhost/
```

Aur:

```text
http://localhost/api/notification
```

Ingress decide karega ki request kis Service ke paas jaani chahiye.

Example:

```text
                     Ingress
                        │
             ┌──────────┴──────────┐
             ↓                     ↓
            "/"          "/api/notification"
             ↓                     ↓
       core-service       notification-service
```

So:

```text
/ 
↓
core-service
```

and:

```text
/api/notification
↓
notification-service
```

---

# 16. Complete request flow

Ab sabko connect karo:

```text
                   USER
                    │
                    │ HTTP request
                    ↓
                 INGRESS
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
    core-service      notification-service
          ↓                   ↓
      core Pods         notification Pods
          ↓                   ↓
       Node.js             Node.js
```

Ingress decide karta hai request kahan jayegi.

Service appropriate Pods tak request pahunchati hai.

Pods ke andar tumhari actual application run ho rahi hoti hai.

---

# 17. `portForward` kya karta hai?

Skaffold config mein:

```yaml
portForward:
  - resourceType: service
    resourceName: core-service
    port: 80
    localPort: 3000
```

Meaning:

```text
localhost:3000
      ↓
core-service:80
      ↓
core Pod:3000
```

Similarly notification service:

```text
localhost:4000
      ↓
notification-service:80
      ↓
notification Pod:3000
```

Isse local machine se Kubernetes ke andar chal rahi service ko access karna easy ho jata hai.

---

# 18. `context: core` ka kya meaning hai?

Skaffold config:

```yaml
artifacts:

  - image: core
    context: core
```

Yahan:

```yaml
context: core
```

ka meaning hai:

```text
core/
```

folder Docker build ka context hai.

Project:

```text
mern-app/
│
├── skaffold.yaml
│
└── core/
    ├── dockerfile.dev
    ├── package.json
    └── src/
```

Agar context `core` hai, toh sync paths bhi `core` folder ke perspective se dekhe jaate hain.

Isliye:

```yaml
src: '**/*.js'
```

correct hai.

Lekin:

```yaml
src: 'core/**/*.js'
```

wrong hoga.

Kyun?

Because Skaffold already `core` context ke andar dekh raha hai.

Tum agar `core/**/*.js` likhoge, toh effectively `core/core/...` type path search ho jayega.

---

# 19. `sync.manual` kya karta hai?

Example:

```yaml
sync:
  manual:
    - src: '**/*.js'
      dest: /app
```

Meaning:

```text
Agar koi JavaScript file change ho
        ↓
Docker rebuild mat karo
        ↓
File ko /app ke andar running container mein sync karo
```

Similarly:

```yaml
- src: '**/*.json'
  dest: /app
```

JSON files bhi directly sync ho sakti hain.

---

# 20. Full Skaffold flow

Jab tum:

```bash
skaffold dev
```

run karte ho:

```text
              skaffold dev
                   ↓
          Read skaffold.yaml
                   ↓
             Build images
                   ↓
        Deploy to Kubernetes
                   ↓
             Start watching
                   ↓
             Code changes?
                   ↓
          ┌────────┴────────┐
          ↓                 ↓
       Sync rule          No sync rule
        matches              │
          ↓                  ↓
        SYNC              REBUILD
          ↓                  ↓
      File copied       Docker image
      into Pod            rebuilt
          ↓                  ↓
       Nodemon          New container
       restart                ↓
          └────────┬──────────┘
                   ↓
             App updated
```

---

# 21. `skaffold dev` kya hai?

```bash
skaffold dev
```

Skaffold ka development loop start karta hai.

Ye broadly:

```text
Build
  ↓
Deploy
  ↓
Watch
  ↓
Sync/Rebuild
  ↓
Keep running
```

karta hai.

Development ke liye ye primary command hai.

---

# 22. `skaffold dev --tail`

```bash
skaffold dev --tail
```

Dev loop ke saath Pods ke logs stream karne ke liye useful hai.

Concept:

```text
Skaffold
   ↓
Kubernetes Pods
   ↓
Logs
   ↓
Terminal
```

---

# 23. `skaffold dev --verbosity=info`

```bash
skaffold dev --verbosity=info
```

Useful hai jab tum dekhna chahte ho ki Skaffold kya decision le raha hai.

Example:

```text
Syncing 1 files for core
```

iska matlab:

```text
File sync hui
Docker rebuild nahi hua.
```

Agar:

```text
Building [core]...
```

dikhe:

```text
Docker image rebuild ho rahi hai.
```

---

# 24. New npm package install karne ka correct workflow

Maan lo tumhe:

```bash
express-validator
```

install karna hai.

Service folder mein jao:

```bash
cd core
npm install express-validator
```

Ab:

```text
npm install
     ↓
package.json changed
     ↓
Skaffold detects change
     ↓
REBUILD
     ↓
Docker runs npm install
     ↓
New image
     ↓
Pod updated
     ↓
Package container ke andar available
```

Important:

Local machine ke `node_modules` aur container ke `node_modules` alag environments hain.

Isliye package ko container ke andar bhi install hona zaroori hai.

---

# 25. SYNC ka real example

Tum change karte ho:

```text
core/src/routes/user.js
```

Flow:

```text
user.js saved
     ↓
Skaffold detects change
     ↓
**/*.js rule matches
     ↓
No Docker rebuild
     ↓
File copied into Pod
     ↓
Nodemon detects change
     ↓
Node server restarts
     ↓
DONE
```

Fast development.

---

# 26. REBUILD ka real example

Tum change karte ho:

```text
package.json
```

Flow:

```text
package.json saved
      ↓
Skaffold detects change
      ↓
Not a normal source sync
      ↓
Docker rebuild
      ↓
npm install
      ↓
New Docker image
      ↓
Kubernetes updated
      ↓
Application restarted
```

---

# 27. `imagePullPolicy: IfNotPresent`

Deployment mein:

```yaml
image: core:latest

imagePullPolicy: IfNotPresent
```

Meaning:

```text
Agar image locally available hai
        ↓
Use local image
```

Remote registry se unnecessarily image pull karne ki zarurat nahi.

Local Docker Desktop Kubernetes development mein ye useful hai.

---

# 28. Docker Desktop Kubernetes

Tumhara setup roughly:

```text
Windows
  ↓
Docker Desktop
  ↓
Kubernetes
  ↓
Pods
  ↓
Containers
```

Pehle Kubernetes enable hona chahiye.

Docker Desktop:

```text
Settings
   ↓
Kubernetes
   ↓
Enable Kubernetes
```

Phir check:

```bash
kubectl config use-context docker-desktop
```

Aur:

```bash
kubectl get nodes
```

Node `Ready` hona chahiye.

---

# 29. nginx Ingress Controller

Ingress resource sirf rule define karta hai.

Actual traffic handle karne ke liye Ingress Controller chahiye.

Tumhare setup mein:

```text
Ingress
   ↓
nginx Ingress Controller
   ↓
Kubernetes Services
```

Use ho raha hai.

Isliye nginx Ingress Controller install karna zaroori hai.

Check:

```bash
kubectl get pods -n ingress-nginx
```

---

# 30. Common problems

## Problem 1: ImagePullBackOff

Meaning:

Kubernetes image ko remote registry se pull karne ki try kar raha hai.

Local image available hai.

Possible fix:

```yaml
imagePullPolicy: IfNotPresent
```

---

## Problem 2: Nginx 404

Possible causes:

```text
Ingress class wrong/missing
        OR
Service port configuration wrong
```

Check:

```yaml
ingressClassName: nginx
```

---

## Problem 3: Har save par rebuild ho raha hai

Possible causes:

```text
Wrong sync path
        OR
.dockerignore missing
        OR
File sync rules mein match nahi ho rahi
```

Correct example:

```yaml
src: '**/*.js'
```

Agar:

```yaml
context: core
```

hai toh:

```yaml
src: 'core/**/*.js'
```

mat likhna.

---

## Problem 4: `sync + infer` error

Ek artifact ke same sync configuration mein:

```text
manual
```

aur:

```text
infer
```

ko mix mat karo.

Ek approach choose karo.

Tumhare backend Node services ke example mein:

```yaml
sync:
  manual:
```

use kiya gaya hai.

---

# 31. Important commands

Start development:

```bash
skaffold dev
```

Development + logs:

```bash
skaffold dev --tail
```

Sync/rebuild information:

```bash
skaffold dev --verbosity=info
```

Debug information:

```bash
skaffold dev --verbosity=debug
```

Images build only:

```bash
skaffold build
```

Kubernetes resources delete:

```bash
skaffold delete
```

Final Kubernetes YAML preview:

```bash
skaffold render
```

Pods check:

```bash
kubectl get pods
```

Services check:

```bash
kubectl get services
```

Ingress check:

```bash
kubectl get ingress
```

Pod logs:

```bash
kubectl logs -f deploy/core-deployment
```

Pod ke andar shell:

```bash
kubectl exec -it deploy/core-deployment -- /bin/sh
```

Pod details:

```bash
kubectl describe pod <pod-name>
```

---

# 32. Sab kuch ek final diagram mein

Is diagram ko yaad rakhna:

```text
                         YOU
                          │
                          │
                    Code Change
                          │
                          ↓
                   ┌─────────────┐
                   │   Skaffold  │
                   └──────┬──────┘
                          │
                 ┌────────┴────────┐
                 │                 │
          Source code          Dependency/
             change            Dockerfile change
                 │                 │
                 ↓                 ↓
               SYNC              REBUILD
                 │                 │
                 ↓                 ↓
          File copied         Docker image
          into Pod              rebuilt
                 │                 │
                 ↓                 ↓
             Nodemon          New container
             restart               │
                 │                 │
                 └────────┬────────┘
                          ↓
                     Kubernetes
                          │
             ┌────────────┴────────────┐
             ↓                         ↓
        core Deployment       notification Deployment
             ↓                         ↓
          Pods                      Pods
             ↓                         ↓
       core-service          notification-service
             │                         │
             └────────────┬────────────┘
                          ↓
                       Ingress
                          ↓
                         USER
```

---

# 33. One-line definition of every technology

```text
Docker
→ Application ko container/image mein package karta hai.

Kubernetes
→ Containers/Pods ko manage aur run karta hai.

Deployment
→ Desired number of Pods maintain karta hai.

Pod
→ Kubernetes mein application container run karne ki basic unit.

Service
→ Pods ko stable network endpoint provide karti hai.

Ingress
→ Incoming HTTP traffic ko correct Service tak route karta hai.

nginx Ingress Controller
→ Ingress rules ko actually implement karke traffic route karta hai.

Nodemon
→ Container ke andar Node.js code changes detect karke server restart karta hai.

Skaffold
→ Docker + Kubernetes development workflow automate karta hai.

skaffold.yaml
→ Skaffold ko batata hai ki build, sync aur deploy kaise karna hai.

.dockerignore
→ Docker build context se unnecessary files exclude karta hai.
```

---

# 34. Sabse important 5 cheezein

Agar tum abhi poora topic nahi yaad rakh pa rahe ho, toh sirf ye 5 points yaad rakho:

```text
1. Skaffold development automation tool hai.

2. Ye files ko watch karta hai.

3. Simple source-code changes ko SYNC karta hai
   instead of rebuilding Docker image.

4. package.json / dependency changes par REBUILD karta hai.

5. Skaffold Docker aur Kubernetes ke beech
   development workflow ko automate karta hai.
```

---

# 35. Final mental model

Sabse simple way mein:

```text
Tum
 ↓
Code likhte ho
 ↓
Skaffold
 ↓
"Change kis type ka hai?"
 ↓
 ┌──────────────────┐
 │                  │
Simple code       Dependency
change             change
 │                  │
 ↓                  ↓
SYNC              REBUILD
 │                  │
 ↓                  ↓
Pod update        Docker image
 │                  │
 ↓                  ↓
Nodemon           New Pod
restart              │
 └────────┬─────────┘
          ↓
      Kubernetes
          ↓
       Running
      Application
```

Bas ek sentence yaad rakho:

**"Skaffold mera development assistant hai jo mere code changes ko watch karta hai aur decide karta hai ki running Kubernetes Pod mein file sync karni hai ya Docker image rebuild karni hai."**

Yahi Skaffold ka core purpose hai.
