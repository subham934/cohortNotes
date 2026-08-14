Today, we'll see ECR and ECS and how we use them to deploy the entire application, we'll also see how to link a domain.

## Docker Multi-Stage Build

=> Yesterday, we created a Dockerfile at the root of our project. This Dockerfile had **two stages**.

**Stage 1 — Frontend Builder:**

In Stage 1, we copied the frontend code and ran:

```bash
npm run build
```

This generated the frontend's production build inside the `dist` folder.

**Stage 2 — Final Application:**

In Stage 2, we prepared the backend and copied the `dist` folder from Stage 1 into the final image as the `public` folder.

```text
Stage 1
Frontend
   ↓
npm run build
   ↓
dist/
   │
   │ COPY --from=frontend_builder
   ↓
Stage 2
Backend
   +
public/
   ↓
Final Image
```

So the final image contains the **backend application + frontend production build**.

---

## What Happens to Stage 1?

When we use a multi-stage build, the **final image is based on the last stage** of the Dockerfile.

In our case:

```dockerfile
FROM node:20-alpine AS frontend_builder
```

is Stage 1, while:

```dockerfile
FROM node:20-alpine
```

is Stage 2 and becomes the basis of our final image.

However, we should **not think of Stage 1 as a normal image that is created and then immediately deleted**.

Stage 1 is an **intermediate build stage**. It has its own filesystem and is used to build the frontend.

From Stage 1, we only copy the required output:

```dockerfile
COPY --from=frontend_builder /app/dist /app/public
```

into Stage 2.

The entire Stage 1 filesystem does **not** become part of the final image.

So conceptually:

```text
Stage 1
/app
├── frontend source code
├── node_modules/
└── dist/
        │
        │ only dist is copied
        ↓
Stage 2
/app
├── backend
├── node_modules/
└── public/
        ↓
Final Image
```

The frontend source code and the build dependencies from Stage 1 are therefore not included in the final production image.

---

## What Happens When We Run the Root Dockerfile?

When we run the root Dockerfile to build our final image, Docker goes through the stages in order.

### Step 1 — Stage 1 is built

Docker creates the environment required for `frontend_builder`.

```text
Frontend Source Code
        ↓
Stage 1
        ↓
npm run build
        ↓
dist/
```

### Step 2 — Stage 2 is built

Docker starts the final stage and prepares the backend.

```text
Backend
   ↓
Stage 2
```

Then Docker executes:

```dockerfile
COPY --from=frontend_builder /app/dist /app/public
```

which copies the frontend production build from Stage 1 into Stage 2.

### Step 3 — Final Image is produced

After the last stage finishes, Docker produces the final image from Stage 2.

Conceptually:

```text
Stage 1
Frontend Builder
     │
     │ produces dist
     ↓
Stage 2
Backend + public/
     │
     ↓
Final Image
```

So the correct mental model is:

> **Stage 1 is an intermediate build stage used to produce the frontend's `dist` folder. Stage 2 is the final stage, and the final image is based on Stage 2. Only the files we explicitly copy from Stage 1 are included in the final image.**

### Important:

Don't remember it as:

```text
Stage 1 image is created
        ↓
Stage 1 image is deleted
        ↓
Stage 2 image is created
```

Instead, remember it as:

```text
Stage 1
  ↓
Intermediate build stage
  ↓
Produces dist/
  ↓
Required files are copied to Stage 2
  ↓
Stage 2
  ↓
Final image
```

Docker may also **cache the intermediate stage/layers**, so saying "Stage 1 is deleted" is not technically accurate.


=> Yesterday, we created a Dockerfile at the root of our project. It had two stages: **Stage 1**, where we built the frontend and generated the `dist` folder, and **Stage 2**, where we copied the `dist` folder from Stage 1 and placed it as `public` in the backend. Finally, Stage 2 became our final image.

=> When we use a multi-stage build, the **final image is created from the last stage**. In our case, the final image is created from Stage 2. Stage 1 is an **intermediate build stage** used to generate the frontend's `dist` folder. Its complete filesystem does not become part of the final image; only the files we explicitly copy from it are included.

=> When we run the root Dockerfile, Docker first executes **Stage 1**, where the frontend is built and `dist` is generated. Then Docker executes **Stage 2**, where the backend is prepared and the required files from Stage 1 are copied into it. Finally, Stage 2 becomes our final image.

=> **What happens to the Stage 1 image/layers?** They are not part of the final image. Docker may keep the intermediate layers in its **build cache** so that they can be reused in future builds. So, we should not say that the Stage 1 image is simply "deleted"; rather, **it is an intermediate build result that is excluded from the final image and may remain cached by Docker.**


=> now , when we run this image, we get a fullstack container, which helps run my fullstack application.


//==============================================================


EC2 = Amazon Elastic Compute Cloud  => It is a web service by Amazon Web Services that lets you rent virtual computers (called "instances") to run your own computer programs in the cloud. Its a machine, where we define the configuration of the machine (like RAM, CPU, etc.) and then run our application on it.

S3 = Amazon Simple Storage Service => It is a service provided by AWS that allows us to store our files in the cloud. It is a object storage service, where we can store our files and access them when needed.

Bedrock = AWS Bedrock is a fully managed service from Amazon Web Services (AWS) that makes it easy for developers to build and deploy generative AI applications. It provides access to a wide range of high-performing foundation models (FMs) from Amazon and leading AI startups, all through a single API. Developers can use these models to perform tasks like text generation, image and video creation, code writing, and data analysis, without needing to manage the underlying infrastructure or model training.

SageMaker = AWS SageMaker is a fully managed service from Amazon Web Services (AWS) that makes it easy for developers to build, train, and deploy machine learning models. It provides a comprehensive set of tools and services for every stage of the machine learning lifecycle, including data preparation, model training, hyperparameter tuning, model deployment, and model monitoring. Developers can use SageMaker to build and deploy machine learning models without needing to manage the underlying infrastructure or model training.

ECR = Amazon Elastic Container Registry => It is a managed Docker container registry that makes it easy to store, manage, and deploy Docker container images.

ECS = Amazon Elastic Container Service => It is a managed container orchestration service that allows us to run, stop, and manage containers on a cluster of Amazon EC2 instances.

RDS = Amazon Relational Database Service => It is a managed relational database service that allows us to run relational databases in the cloud.

Route 53 = Amazon Route 53 => It is a managed DNS service that allows us to route traffic to our application.
 
//==========================================================

We'll use ECR and ECS together. ECR is the storage area of images. It stores multiple versions of images. 

ECS is the actual one who runs the images. ECS has two parts:

1. Task Definition = In Task Definition, we define which image to run, how much CPU and RAM it requires, what environment variables it needs, etc.
Eg: ECR can have multiple images. In task definition, we say run image-1, with vCPU: 8 and RAM: 32GB 

2. Services = Services is the actual one who runs the task. It reads the task definition and runs them.

//==========================================================


# ECR and ECS

We'll use **ECR and ECS together** to store and run our Docker images.

### 1. ECR — Elastic Container Registry

**ECR is the storage/repository for Docker container images.**

It stores our Docker images, including different **versions/tags** of those images.

For example, ECR can contain:

* `image-1:v1`
* `image-1:v2`
* `image-2:v1`

So, **ECR = Where our Docker images are stored.**

---

### 2. ECS — Elastic Container Service

**ECS is the service that runs and manages our Docker containers using the images stored in ECR.**

ECS mainly involves two important concepts:

#### a. Task Definition

**Task Definition is a blueprint/configuration that tells ECS how to run a container.**

In the Task Definition, we define:

* Which Docker image to run
* How much CPU it requires
* How much RAM it requires
* Environment variables
* Port mappings
* Networking configuration
* Logging configuration, etc.

**Example:**

ECR contains multiple images:

`image-1`, `image-2`, `image-3`

In the Task Definition, we can specify:

> Run `image-1` with **8 vCPU** and **32 GB RAM**.

So, **Task Definition = Defines how a container should run.**

#### b. Service

**Service is responsible for maintaining and managing the desired number of running Tasks based on a Task Definition.**

For example:

> Service → Use this Task Definition → Keep **3 Tasks** running.

If one Task crashes or stops, the Service can start another Task to maintain the desired number of running Tasks.

So, **Service = Makes sure the required number of Tasks are running.**

---

### Easy way to remember

**ECR → Stores the Docker Image** 📦

**Task Definition → Defines how to run the Image** 📋

**Service → Maintains the required number of Tasks** ⚙️

**Task → An actual running instance of the container** 🚀

### Overall Flow

**Docker Image → ECR → Task Definition → ECS Service → Running Task → Container**

=> Docker hub pe images publically available rehta hain, koi bhi unko access kar pata hain, lekin ECR ak private repository hain aur usko bus hum access kar pate hain.

//==========================================================


## IAM = Identity and Access Management

In AWS, we have root user. we dont use root user to create services. Instead, we create users and assign permissions to them. That is what IAM does.

at first we create an image and pass it to ECR, the image in ECR is private, so , when we push image in ECR, we give access of that image to ECS


