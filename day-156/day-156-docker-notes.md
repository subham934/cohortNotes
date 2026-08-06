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
- Image = static blueprint; Container = running instance of that blueprint.
- Dockerfile defines how the image is built, layer by layer.
- Port mapping (`-p host:container`) is required to access a containerized server from the host.
- Images are immutable — any code change requires a **rebuild** of the image and a **new container run**.
