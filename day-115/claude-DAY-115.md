============================================
DAY-115
============================================

Aaj Day-115 hai. Aaj hum seekhenge:

  1. Redis kya hai aur kyun use karte hain
  2. Token Blacklisting ko MongoDB se Redis pe migrate karna
  3. Redis ko Node.js server se connect karna

=> Kal (Day-114) humne MongoDB se token blacklisting ki thi —
   aaj Redis se karenge jo bahut zyada fast hai!


==========================================


## Redis kya hai?

=> Redis = **Re**mote **Di**ctionary **S**erver
=> Yeh ek **key-value store** hai — data key aur value ke pair mein store hota hai:

```
key              value
---------------  -------------------
"token123"       "1711234567890"    (timestamp — kab blacklist hua)
"session:rahul"  "active"
"count:posts"    "42"
```

=> Redis ek **non-relational database** hai — MongoDB jaisa
=> Sabse bada fark — **data RAM mein store hota hai, disk pe nahi!**

---

## Redis vs MongoDB — Kyun Redis better hai blacklisting ke liye?

=> Dono databases hain — but kaam alag alag:

```
MongoDB (Disk pe data):              Redis (RAM mein data):
-------------------------------      ------------------------------
Request aaya                         Request aaya
    |                                    |
    v                                    v
Hard disk pe jaao                    RAM mein jaao
blacklist dhundo                     blacklist dhundo
    |                                    |
200-300ms lag sakta hai! 🐢           1-2ms! ⚡🚀
    |                                    |
    v                                    v
Response aaya                        Response aaya
```

=> **Simple Analogy:**

```
MongoDB = Library mein jaake book dhundho 📚
          — shelf dhundho, book nikalo, time lagta hai!

Redis   = Apni table pe hi book rakhi hai 📖
          — seedha uthao, instant!
```

---

## Kyun Redis specifically blacklisting ke liye perfect hai?

=> Yeh 4 APIs hain jo protected hain:

```
/api/post/like/:postId       => authUser middleware lagega
/api/post/save/:postId       => authUser middleware lagega
/api/post/comment/:postId    => authUser middleware lagega
/api/story/comment/:storyId  => authUser middleware lagega
```

=> Har API call pe `authUser` middleware chalta hai
=> `authUser` mein token blacklist check hota hai
=> Instagram pe **millions of requests per second** aati hain
=> Agar MongoDB use karo — har request pe ek DB disk query — SLOW! ❌
=> Redis se — RAM se instant check — FAST! ✅

---

## Redis ka TTL (Time To Live) feature:

=> Redis mein ek special feature hai — **TTL** — data automatically expire ho jaata hai!

```javascript
// Token 3 din baad automatically delete ho jaayega!
redis.set("token123", "blacklisted", "EX", 259200)
//                                    ^^   ^^^^^^^
//                                    |    3 din ke seconds
//                                    EX = Expire after n seconds

// MongoDB mein yeh manually karna padta — extra complexity! ❌
// Redis mein automatic! ✅
```

=> Hamara JWT token bhi 3 din mein expire hota hai —
   toh Redis se bhi 3 din baad delete karo — **memory waste nahi hoga!** 💪

---

## MongoDB vs Redis — Kab kya use karein:

```
MongoDB use karo jab:           Redis use karo jab:
  - Permanent data store karo     - Temporary data store karo
  - Complex queries hain          - Simple key-value operations
  - Relationships hain            - Super fast access chahiye
  - eg: users, posts, comments    - eg: blacklist, sessions, cache
```


==========================================


## STEP 1 — Redis install aur connect karo

=> Redis ka Node.js package: `ioredis`

```bash
npm i ioredis
```

=> Ek alag config file banao — `cache.js` — Redis connection yahan hoga
=> Config folder mein rakhna good practice hai — sab connections ek jagah!


---------------------------------
Backend > src > config > cache.js
---------------------------------

const Redis = require("ioredis").default;
// ioredis import kiya — Redis se connect karne ke liye
// .default isliye — ioredis ES module format mein export karta hai

const redis = new Redis({
  host: process.env.REDIS_HOST,
  // Redis server ka host address
  // .env se lena zaroori hai — code mein directly mat likho! ✅

  port: process.env.REDIS_PORT,
  // Redis ka port number
  // .env se lena zaroori hai!

  password: process.env.REDIS_PASSWORD,
  // Redis server ka password
  // .env se lena zaroori hai — KABHI code mein directly mat likho! ✅
});

redis.on("connect", () => {
  console.log("Server is connected to Redis! ✅");
  // jab Redis se connection successful ho — yeh message terminal mein aayega
  // server start karne pe yeh dikhega
});

redis.on("error", (err) => {
  console.log("Redis connection error:", err);
  // koi error aaye — connection fail ho — toh log karo
});

module.exports = redis;
// redis instance export karo
// middleware aur controller mein import karke use karenge

================================================

=> .env file mein yeh add karo:

```
REDIS_HOST=redis-17157.c305.ap-south-1-1.ec2.cloud.redislabs.com
REDIS_PORT=17157
REDIS_PASSWORD=your_password_here
```

=> ⚠️ SECURITY WARNING: Redis credentials ko KABHI bhi code mein directly mat likho!
=> Teri notes mein credentials directly likhe the — yeh bada security risk hai! ❌
=> Hamesha .env file mein rakho aur .gitignore mein .env add karo!

```
# .gitignore
.env
node_modules
```


==========================================


## STEP 2 — Auth Middleware update karo

=> Pehle (Day-114) MongoDB se blacklist check karte the:
```javascript
// Day-114 — SLOW ❌
const isTokenBlacklisted = await blacklistModel.findOne({ token });
// har request pe disk query — 200-300ms
```

=> Aaj Redis se check karenge:
```javascript
// Day-115 — FAST ✅
const isTokenBlacklisted = await redis.get(token);
// RAM se instant — 1-2ms ⚡
```


-----------------------------------------------
Backend > src > middlewares > auth.middleware.js
-----------------------------------------------

const jwt = require("jsonwebtoken");
// jwt import kiya — token verify karne ke liye

const redis = require("../config/cache");
// Redis instance import kiya — blacklist check karne ke liye

// NOTE: teri notes mein yeh unnecessary imports the — hata do!
// ❌ const userModel = require("../models/user.model");  — use nahi hota yahan
// ❌ const blacklistModel = require("../models/blacklist.model"); — ab Redis use kar rahe hain

async function authUser(req, res, next) {

  // LINE 1: Cookie se token nikalo
  // jab tak user login nahi karta — uske paas token nahi hoga
  const token = req.cookies.token;

  // LINE 2: Token nahi hai toh 401 bhejo
  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  // LINE 3: Redis mein check karo — token blacklisted hai ya nahi
  // redis.get(token) =>
  //   agar token Redis mein stored hai  => value return karega (blacklisted!)
  //   agar token Redis mein nahi hai    => null return karega (valid!)
  const isTokenBlacklisted = await redis.get(token);
  // yeh line pehle aisi thi: await blacklistModel.findOne({ token })
  // ab Redis use kar rahe hain — same kaam — 100x faster! ⚡

  if (isTokenBlacklisted) {
    // token Redis mein mila — matlab logout ho chuka hai!
    return res.status(401).json({
      message: "Invalid Token — please login again",
    });
  }

  // LINE 4: Token verify karo
  // jwt.verify 2 kaam karta hai:
  //   1. Token valid hai ya tampered/expired check karta hai
  //   2. Token ke andar ka data nikalta hai — { id, username }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    // req.user mein { id, username } store ho gaya
    // ab koi bhi controller req.user se user ka data read kar sakta hai!

    next();
    // next() => request agle step (controller) pe forward karo

  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

module.exports = { authUser };

================================================


==========================================


## STEP 3 — Auth Controller update karo (logoutUser)

=> Logout mein blacklistModel ki jagah Redis use karenge!
=> Baaki sab controllers same hain — sirf logoutUser mein change hai


-----------------------------------------------
Backend > src > controller > auth.controller.js
-----------------------------------------------

const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");
// Redis import kiya — logout mein token blacklist karne ke liye
// NOTE: blacklistModel ab zaroorat nahi — Redis use kar rahe hain! ✅


// =========================================================
// FUNCTION 1: registerUser — same as Day-114
// =========================================================
async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyRegistered) {
    return res.status(400).json({
      message: "Username or email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}


// =========================================================
// FUNCTION 2: loginUser — same as Day-114
// =========================================================
async function loginUser(req, res) {
  const { email, password, username } = req.body;

  const user = await userModel
    .findOne({ $or: [{ email }, { username }] })
    .select("+password");
  // .select("+password") => model mein select:false tha
  // login mein password compare karna hai — explicitly mangao!

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}


// =========================================================
// FUNCTION 3: getMe — same as Day-114
// =========================================================
async function getMe(req, res) {

  const user = await userModel.findById(req.user.id).select("-password");
  // .select("-password") => password response mein mat bhejo!
  // NOTE: teri notes mein yeh missing tha — add kiya! ✅

  return res.status(200).json({
    message: "User fetched successfully",
    user,
  });
}


// =========================================================
// FUNCTION 4: logoutUser — UPDATED with Redis!
// Kaam: User logout karo + token Redis mein blacklist karo
// =========================================================
async function logoutUser(req, res) {

  // LINE 1: Cookie se token nikalo
  const token = req.cookies.token;

  // LINE 2: Client side se cookie delete karo
  res.clearCookie("token");
  // clearCookie => browser se token cookie delete ho jaayegi
  // but yeh sirf client side se delete hoga!
  // token abhi bhi valid hai — koi bhi use kar sakta hai — SECURITY RISK! ❌
  // isliye server side pe bhi blacklist karna zaroori hai!

  // LINE 3: Token Redis mein store karo — server side blacklisting
  await redis.set(token, Date.now().toString(), "EX", 259200);
  // redis.set() ke 4 arguments:
  //
  // Argument 1 — KEY: token
  //   => yahi woh token hai jo blacklist karna hai
  //   => koi bhi is token se request kare => Redis mein check hoga => blocked!
  //
  // Argument 2 — VALUE: Date.now().toString()
  //   => timestamp store kar rahe hain — kab blacklist hua
  //   => Redis mein value kuch bhi ho sakti hai
  //   => "blacklisted" bhi likh sakte the — but timestamp zyada useful hai
  //
  // Argument 3 — "EX": Expire flag
  //   => Redis ko bolta hai ki yeh key expire karni hai
  //
  // Argument 4 — 259200: Seconds mein TTL
  //   => 259200 seconds = 3 din (3 * 24 * 60 * 60)
  //   => 3 din baad Redis automatically yeh token delete kar dega! ✅
  //   => JWT token bhi 3d mein expire hota hai — sync mein hai!
  //   => Bina TTL ke Redis mein forever store rahega — memory waste! ❌
  //
  // NOTE: Teri notes mein "EX" aur TTL nahi tha — yeh add karna zaroori hai!

  return res.status(200).json({
    message: "User logged out successfully",
  });
}

module.exports = { registerUser, loginUser, getMe, logoutUser };

================================================


==========================================


## MISTAKES JO NOTES MEIN THI:

**1. Redis credentials directly code mein likhe the — SECURITY RISK!**
```javascript
// ❌ GALAT — yeh GitHub pe visible ho jaayenge!
const redis = new Redis({
  host: "redis-17157.c305.ap-south-1-1.ec2.cloud.redislabs.com",
  port: 17157,
  password: "xrHTSV9bmc4jK64RqgMdeiifnisenbGF"
})

// ✅ SAHI — hamesha .env se lo!
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
})
```

**2. Middleware mein unnecessary imports the:**
```javascript
// ❌ GALAT — yeh use nahi hote middleware mein
const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");

// ✅ SAHI — sirf yeh chahiye
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");
```

**3. redis.set mein TTL missing tha:**
```javascript
// ❌ GALAT — bina TTL ke token forever Redis mein rahega!
await redis.set(token, Date.now().toString());

// ✅ SAHI — TTL lagao!
await redis.set(token, Date.now().toString(), "EX", 259200);
// 3 din baad automatically delete! ✅
```

**4. getMe mein .select("-password") missing tha:**
```javascript
// ❌ GALAT — password bhi response mein aa jaayega!
const user = await userModel.findById(req.user.id);

// ✅ SAHI
const user = await userModel.findById(req.user.id).select("-password");
```

**5. Controller mein blacklistModel import tha — zaroorat nahi:**
```javascript
// ❌ GALAT — ab Redis use kar rahe hain
const blacklistModel = require("../models/blacklist.model");

// ✅ SAHI — remove karo, Redis import karo
const redis = require("../config/cache");
```


==========================================


FULL FLOW SUMMARY:

  SERVER START HONE PE:
  ---------------------
  Node.js server start hota hai
      |
      v
  cache.js load hota hai
      |
      | Redis se connection establish hota hai
      v
  Terminal pe dikhta hai:
  "Server is connected to Redis! ✅"
  "Server is connected to MongoDB! ✅"


  LOGOUT FLOW (Redis ke saath):
  ------------------------------
  POST /api/auth/logout
      |
      v
  authUser middleware:
      | token verify karo
      | redis.get(token) => null (abhi blacklisted nahi)
      | next()
      v
  logoutUser controller:
      | res.clearCookie("token")  => client se delete
      | redis.set(token, timestamp, "EX", 259200) => Redis mein blacklist!
      v
  200 — User logged out! ✅


  FUTURE REQUEST US TOKEN SE:
  ---------------------------
  Koi bhi us token se request kare
      |
      v
  authUser middleware:
      | redis.get(token) => MILA! (blacklisted hai) ⚡
      v
  401 — Invalid Token! 🚫


  SPEED COMPARISON:
  -----------------
  MongoDB (Day-114):    Request => Disk query (200-300ms) => Response 🐢
  Redis   (Day-115):    Request => RAM query  (1-2ms)     => Response ⚡


==========================================


## Redis Key Commands Summary:

```javascript
// Value store karo
redis.set("key", "value")

// Value store karo with TTL (auto-expire)
redis.set("key", "value", "EX", seconds)

// Value nikalo
redis.get("key")          // => "value" ya null

// Key delete karo
redis.del("key")

// Key exist karta hai ya nahi
redis.exists("key")       // => 1 ya 0

// TTL check karo (kitne seconds mein expire hoga)
redis.ttl("key")          // => seconds remaining
```

======================================
