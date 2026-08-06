# Day 156 — Docker Basics (Express Server → Image → Container)

## 1. The Problem Docker Solves

A team builds a website together. Each developer's machine may have a **different Node.js version**, different OS, different dependency versions. Code that works on one machine may break on another — the classic *"it works on my machine"* problem.

**Docker's job:** guarantee every team member runs the **exact same environment** — same Node.js version, same OS, same dependencies — no matter what's installed locally.

An Express server depends on:
```
codebase + dependencies + Node.js + Operating System
```

## 2. Image vs Container

| Term | Meaning |
|---|---|
| **Image** | A frozen, read-only bundle of codebase + dependencies + Node.js + OS. Like a recipe — you can't "run" a recipe, only follow it to make something. |
| **Container** | A **running instance** of an image. Like the actual cake made from the recipe. One image can spin up multiple containers. |

> Image = blueprint (static)
> Container = execution of that blueprint (running virtual environment)

### 2.1 Why do we need an Image?

Sharing just the codebase (e.g. via GitHub) isn't enough — the receiving machine still needs the right Node.js version, OS, and dependencies manually installed. Without a fixed environment, "works on my machine" bugs keep happening.

An **image bundles everything needed to run the app** — code + dependencies + Node.js + OS — into one self-contained, portable package. Whoever runs the image gets an identical environment automatically; nothing needs to be installed manually.

**Analogy:** a takeaway pizza box. Base (dough) = OS, sauce+cheese = Node.js runtime, toppings = npm dependencies, garnish = actual code. Once boxed (image built), anyone can open it and use it as-is — no cooking (manual setup) required.

**How an image is formed from the codebase:** each Dockerfile instruction executes top-to-bottom and produces a **layer**, stacked on top of the previous one:

```
FROM node:20-alpine      → Layer 1: base OS + Node.js
COPY package.json .      → Layer 2: dependency manifest added
RUN npm install           → Layer 3: dependencies installed inside the image
COPY server.js .         → Layer 4: actual source code added
CMD ["node","server.js"]  → metadata: command to run when a container starts
```

Running `docker build .` executes these layers in order and produces one final, frozen image.

**Practical uses of an image:**
- **Consistency** — every teammate, CI/CD pipeline, or cloud server gets the identical environment.
- **Portability** — push to Docker Hub, pull and run anywhere without manual setup.
- **Reproducibility** — a production bug can be reproduced locally using the exact same image.
- **Deployment unit** — cloud platforms (AWS ECS, Kubernetes, Render, etc.) deploy images, not raw codebases.
- **Scaling** — one image can be used to spin up many identical containers.

### 2.2 Why do we need a Container?

An image is just a **packed, static bundle** — it doesn't do anything by itself. Nothing is actually running, no server is listening, no port is open. A container is what turns that static package into a **live, running process**.

**Analogy continued:** the pizza box (image) is fully packed and ready, but nobody can eat until the box is opened and the pizza is actually served on a plate. The container is that served, live pizza — the actual usable output.

**How a container is formed from an image:** running `docker run cohort_2` makes Docker:
1. Load the frozen image from disk
2. Spin up a new isolated environment on top of it — its own filesystem, network, and process space
3. Execute the image's `CMD` (e.g. `node server.js`)
4. The result is a live, running process — the container

A container is not a copy of the image — it runs on top of the image with a thin **writable layer** added, so any runtime changes (logs, temp files) stay in the container and never modify the underlying image.

**Practical uses of a container:**
- **Isolation** — each container has its own process/network space; one crashing doesn't affect others.
- **Actual execution unit** — this is what's "running" in production, not the image.
- **Multiple instances from one image** — spin up several containers from the same image for scaling.
- **Disposable & recreatable** — a broken container can be deleted and a fresh one spun up from the same image in seconds.
- **Lightweight** — containers share the host OS kernel (unlike a full VM), so they start in seconds rather than minutes.

### 2.3 Relating Image and Container

| Aspect | Image | Container |
|---|---|---|
| Nature | Static, frozen, read-only | Live, running, dynamic |
| Analogy | Recipe / packed pizza box | Cooked cake / pizza being served |
| State | Doesn't do anything by itself | Actively runs the process (e.g. server listening) |
| Relationship | One image → many containers possible | Each container derives from one specific image |
| Changes | Immutable — needs a rebuild to change | Runtime changes possible (writable layer) but not permanent |
| Created via | `docker build` | `docker run` (from an image) |
| Purpose | Portable, shareable package — "what to run" | Actual execution — "running it" |

**Core relationship:** an image is a template — like a class in programming — from which any number of independent, isolated running instances (containers) can be created, similar to how a class produces multiple objects.

## 3. Building the Express Server

```js
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World!" });
});

app.get("/api/data", (req, res) => {
    res.status(200).json({ id: 1, name: "John Doe", desc: "This is a description" });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

Setup: `npm i express`, Node.js and OS already available locally.

**Before Dockerizing:** delete the local `node_modules` folder. Dependencies will be freshly installed *inside* the image (matching its OS/Node version) — carrying over local `node_modules` can bloat the image or cause OS-specific binary conflicts.

## 4. The Dockerfile — Line by Line

```dockerfile
FROM node:20-alpine
# Base image: Node.js v20 + Alpine Linux (lightweight OS)

COPY ./package.json .
COPY ./package-lock.json .
# Copy dependency manifests first (enables Docker layer caching —
# npm install is skipped on rebuild if dependencies haven't changed)

RUN npm install
# Fresh install of dependencies inside the image's own environment

COPY ./server.js .
# Copy actual source code (done after npm install to preserve caching benefits)

CMD ["node", "server.js"]
# Command executed when the container starts (array-of-strings format)
```

## 5. Building the Image and Running the Container

```bash
docker build . -t cohort_2
# Builds an image named "cohort_2" from the Dockerfile in current directory

docker run cohort_2
# Runs the image → creates a container. Server starts on port 3000 *inside* the container.
```

## 6. Port Mapping

A container is an isolated environment. A server listening on port 3000 **inside** the container is not reachable via `localhost:3000` on the host machine by default.

```bash
docker run -p 8080:3000 cohort_2
```

Format: `-p <host_port>:<container_port>`

This maps host port `8080` → container port `3000`. Now `localhost:8080` on the host reaches the server running inside the container.

## 7. Image Immutability

Images are **immutable** — once built, the code inside a running container's image cannot be changed live.

**Example problem:** Added a new route to `server.js`:
```js
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "OK", time: Date.now() });
});
```
The *already-running* container was built from the *old* image — it has no knowledge of this new route. Hitting `/api/health` fails.

**Fix:** Stop the old container, rebuild the image with the updated code, and run a new container:
```bash
docker build . -t cohort_2
docker run -p 2000:3000 cohort_2
```

## 8. Container Management Commands

| Command | Purpose |
|---|---|
| `docker ps` | List **running** containers only |
| `docker ps -a` | List all containers, including stopped ones |
| `docker stop <name/id>` | Stop a container (state preserved, not deleted) |
| `docker start <name>` | Start a stopped container |
| `docker restart <name>` | Stop + start together |
| `docker rm <name>` | Permanently delete a container |

## Key Takeaways

- Docker solves environment inconsistency across team machines.
- An image bundles code + dependencies + Node.js + OS into one portable package — solves "works on my machine" and enables consistent deployment.
- A container is the live, running execution of an image — nothing actually runs until an image is turned into a container.
- Image = static blueprint (like a class); Container = running instance of that blueprint (like an object) — one image can produce many containers.
- Dockerfile defines how the image is built, layer by layer.
- Port mapping (`-p host:container`) is required to access a containerized server from the host.
- Images are immutable — any code change requires a **rebuild** of the image and a **new container run**.