import { log } from "console";
import app from "./src/app.js";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  /* options */
});

// hum pehle app.listen(3000) likha karte the, uski jagah hum httpServer.listen(3000) likhenge, as httpServer is made from http module and with this module , we can create a server.

// socket.io dont work with express very well, for that we use http module
// -> import { createServer } from "http";
// IS module k upar express banta hai
// socket.io , express k saath direct kam nahi karega, for that we use http module so that we can use http server and socket.io together

// => humne express server wala part "app.js" ko httpServer k sath create kar diya
// const httpServer = createServer(app);

// isi httpServer ko, hum attach kar deta hai socket.io k saath
// const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // io ka matlab hai server aur "on" ka matlab hai 'event ko listen karna', toh io.on ka matlab hai ki jab server pe koi event trigger hoga, eg: connection toh is function k andar jo bhi code hai, wo run hoga.

  console.log("new connection created");

  socket.on("message", (msg) => {
    console.log("User fired message event");
    console.log(msg);
    // io.emit -> sabhi clients ko message bhejna
    io.emit("abc");   
    
  })
});

// finally hum listen karta hai, httpServer ko, na ki app ko

httpServer.listen(3000, () => {
  console.log("server is running on port 3000");
});
