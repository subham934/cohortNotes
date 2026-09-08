we will create a project like lovable where the user will give pormpt to AI. and with the basis of that prompt , the AI will create the entire website. 




Here, we have an AI chat screen, a Terminal, a place to writre the code, and a place to preview the code. The user can talk to AI and can make changes in code, and as the changes in the code happens, the user can chekc out the output of the code in preview. The user can also access our terminal aswell. As of now , we will use react. 

Here, the entire code appears in my browser, but the browser wont we able to show react JSX code on preview. For that, in the backend we will create a container. This container will have node, react_dependencies, react_codebase. The entire react code will run in this backend-container and will give a URL. And with the help of this URL , we can check our react output. 

This container will have vite-development-server, but it will be served in preview. Any code changes will be reflected on codebase. The terminal will also be connected to this container, any command we run on terminal will run inside container. When we chat with AI, any files that gets edited will happen inside this container.  


to create a terminal, we use node-pty 



//==================================================

So, our entire project has 4 services:

1. Auth
2. Notification
3. AI orchestration
4. Sandbox

Let's start with sandbox

