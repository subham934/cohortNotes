Yesterday, we did the authentication, today, we shell upload the song to imagekit and play depending on mood.


At first lets create a model for the information of the song::

---------------------------------------
Backend > src > models > song.model.js
---------------------------------------

const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  title:{
    type:String,
    required: true,
  }
});

const songModel = mongoose.model("songs", songSchema);

module.exports = songModel;


//======================================
=> Now, we will create an API , with which we can upload song, no authentication required. We can if we want to but not for now.

=> Lets create a routes file, for that we need to create a file inside routes folder.


---------------------------------------
Backend > src > routes > song.routes.js
---------------------------------------


const express = require("express")


const router = express.Router()

module.exports = router;


=> Now, we shell import this router file inside app.js


----------------------
Backend > src > app.js
----------------------

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors")
// Routes
const authRoutes = require('./routes/auth.routes');
const songRoutes = require('./routes/song.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))


app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);

module.exports = app;


=> Now, we need to create a simple API and its controller to upload the song.


=> also , to read the file from the req, we need to install multer package.
npm i multer

-> to handle this multer , we need to import multer and create a middleware to handle the file.


---------------------------------------
Backend > src > middlewares > upload.middleware.js
---------------------------------------

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB in bytes
});


module.exports = upload;

----------------------------------
Backend > src > controller > song.controller.js
----------------------------------

const songModel = require("../models/song.model");

async function uploadSong(req, res) {
  console.log(req.file);
}

module.exports = {
  uploadSong,
};

=> Now, if we upload a song in postman , over the termial , we get the details as below::

{
  fieldname: 'song',
  originalname: 'u_t60o3simia-hanuman-song-maker-song-abhi-404570.mp3',
  encoding: '7bit',
  mimetype: 'audio/mpeg',
  buffer: <Buffer ff fb d4 64 00 0e 05 f4 55 41 9b 6c 35 d2 5d ac 38 22 60 c3 34 1e 09 8e fc 0f 61 85 c9 46 b0 a1 a9 41 36 f8 00 00 01 1c e4 93 86 49 cc 84 44 c3 c4 4c ... 5887438 more bytes>,
  size: 5887488
}

=> in this .mp3 file , we can see the details of the song. apart from the song, we can also see the poster of the song, artist, title etc. to identify all the details of the song we need to install a package called "node-id3". 

npm i node-id3

=> with the help of this package, the song details can be read from the .mp3 file.

=> THIS node-id3 package is used to read the buffer of the .mp3 file.
------------------------------
Backend > src > controller > song.controller.js
------------------------------

const songModel = require("../models/song.model");
const id3 = require("node-id3");

async function uploadSong(req, res) {
  //   console.log(req.file);

  const tags = id3.read(req.file.buffer);
  console.log(tags);
}

module.exports = { uploadSong };



=> the response we get is as below:

{
  userDefinedText: [
    { description: 'major_brand', value: 'isom' },
    { description: 'minor_version', value: '512' },
    { description: 'compatible_brands', value: 'isomiso2mp41' }
  ],
  encodingTechnology: 'Lavf60.16.100',
  raw: { TXXX: [ [Object], [Object], [Object] ], TSSE: 'Lavf60.16.100' }
}
{
  artist: 'SonyMusicIndiaVEVO',
  title: 'Raanjhanaa - Lyrical Video | Dhanush, Sonam Kapoor | A. R. Rahman | Jaswinder Singh & Shiraz Uppal',
  encodingTechnology: 'Lavf60.3.100',
  raw: {
    TPE1: 'SonyMusicIndiaVEVO',
    TIT2: 'Raanjhanaa - Lyrical Video | Dhanush, Sonam Kapoor | A. R. Rahman | Jaswinder Singh & Shiraz Uppal',
    TSSE: 'Lavf60.3.100'
  }
}

=> Now , with the above detail, we can create a song in the database , but , we dont keep the song in the database, we keep the song's URL, which we get from imageKit, so we upload the songs URL + posterURL in the database.

=> At first we will upload the song and song's poster in imageKit and then provide (songs URL + posterURL) in the database. 


//=================================
=> since imageKit is a 3rd party service, its code goes inside services folder.

install npm i @imagekit/nodejs


---------------------------------------------
Backend > src > services > storage.service.js
---------------------------------------------

const ImageKit = require("@imagekit/nodejs").default;

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile({ buffer, filename, folder = "" }) {
  const file = await client.files.upload({
    file: await ImageKit.toFile(Buffer.from(buffer), "file"),
    fileName: filename,
    folder
  });

  return file;
}

module.exports = { uploadFile };


select the mood of the song::

--------------------------------------
Backend > src > models > song.model.js
--------------------------------------

const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  title:{
    type:String,
    required: true,
  },
  mood:{
    type: String,
    enum:{
        values: ['sad', 'happy', 'surprised'],
        message: "Enum this is "
    }
  }

});

const songModel = mongoose.model("songs", songSchema);

module.exports = songModel;



=> to upload the song , we write as 

----------------------------------------------
Backend > src > controller >song.controller.js
----------------------------------------------

const songModel = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");

async function uploadSong(req, res) {
  const songBuffer = req.file.buffer;
  const { mood } = req.body;

  const tags = id3.read(songBuffer);

  const songFile = await storageService.uploadFile({
    buffer: songBuffer,
    filename: tags.title + ".mp3",
    folder: "/cohort-2/moodify/songs",
  });
  const posterFile = await storageService.uploadFile({
    buffer: tags.image.imageBuffer,
    filename: tags.title + ".jpeg",
    folder: "/cohort-2/moodify/posters",
  });

  const song = await songModel.create({
    title: tags.title,
    url: songFile.url,
    posterUrl: posterFile.url,
    mood,
  });

  res.status(201).json({
    message: "song created successfully",
    song,
  });
}



module.exports = { uploadSong };


=> now, go to postman and type the url as http://localhost:3000/songs/upload and select the song from the device and select the mood to upload the song on imageKit and then provide the song URL and poster URL in the database. 


//====================================
=> now, let us optimize the song.controller.js, in the above code, at first the songFile goes to imagekit and then the posterFile goes to imagekit, so we can optimize it by uploading the song and poster in one go. it reduce the upload time by big margin::

----------------------------------------------
Backend > src > controller >song.controller.js
----------------------------------------------

const songModel = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");

async function uploadSong(req, res) {
  const songBuffer = req.file.buffer;
  const { mood } = req.body;

  const tags = id3.read(songBuffer);

  const [songFile, posterFile] = await Promise.all([
    storageService.uploadFile({
      buffer: songBuffer,
      filename: tags.title + ".mp3",
      folder: "/cohort-2/moodify/songs",
    }),
    storageService.uploadFile({
      buffer: tags.image.imageBuffer,
      filename: tags.title + ".jpeg",
      folder: "/cohort-2/moodify/posters",
    }),
  ]);

  const song = await songModel.create({
    title: tags.title,
    url: songFile.url,
    posterUrl: posterFile.url,
    mood,
  });

  res.status(201).json({
    message: "song created successfully",
    song,
  });
}

module.exports = { uploadSong };


//====================================

=> now, we will create one more api, it will return the song based on mood 

=> let create the controller first::


----------------------------------------------
Backend > src > controller >song.controller.js
----------------------------------------------
const songModel = require("../models/song.model")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")


async function uploadSong(req, res) {

    const songBuffer = req.file.buffer
    const { mood } = req.body

    const tags = id3.read(songBuffer)

    const [ songFile, posterFile ] = await Promise.all([
        storageService.uploadFile({
            buffer: songBuffer,
            filename: tags.title + ".mp3",
            folder: "/cohort-2/moodify/songs"
        }),
        storageService.uploadFile({
            buffer: tags.image.imageBuffer,
            filename: tags.title + ".jpeg",
            folder: "/cohort-2/moodify/posters"
        })
    ])

    const song = await songModel.create({
        title: tags.title,
        url: songFile.url,
        posterUrl: posterFile.url,
        mood
    })

    res.status(201).json({
        message: "song created successfully",
        song
    })

}

async function getSong(req, res) {
    
    const { mood } = req.query
    
    const song = await songModel.findOne({
        mood,
    })

    res.status(200).json({
        message: "song fetched successfully.",
        song,
    })

}


module.exports = { uploadSong, getSong }


=> now, let put this controller on routes as below::


---------------------------------------
Backend > src > routes > song.routes.js
---------------------------------------

const express = require("express")
const upload = require('../middlewares/upload.middlware')
const songController = require('../controller/song.controller')


const router = express.Router()



/**
 * POST /api/songs
 */
router.post("/", upload.single("song"), songController.uploadSong)

router.get('/', songController.getSong)

module.exports = router;



//====================================

now we shell integrate the backend to the frontend, now we will create a home page::


---------------------------------------------------
Frontend > src > features > home > pages > Home.jsx
---------------------------------------------------

import React from 'react'
import FaceExpression from '../components/FaceExpression'

const Home = () => {
  return (
    <div>
      <FaceExpression />
    </div>
  )
}

export default Home


=> in this Home.jsx , we have the FaceExpression component, we will change the routes aswell, for that let create the routes first::

------------------------------
Frontend > src > app.routes.js
------------------------------

import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/home/pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

=> now, when we login, we go to the home page, and based on the expression our mood will be detected. based on expression on our face , we call that api to take the details of the songs, and show them.

now we will create a music player with 4 layer architecture.

--------------------------------------
Frontend > src > features > home > song.context.jsx
--------------------------------------

// Lets create State Layer:

import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    /**
     * Paste one or more documents here
     */

    url: "https://ik.imagekit.io/lq7qd2rhd/cohort-2/moodify/songs/Jatt_Mehkma__RiskyjaTT.CoM__Si89sazt3r.mp3",
    posterUrl:
      "https://ik.imagekit.io/lq7qd2rhd/cohort-2/moodify/posters/Jatt_Mehkma__RiskyjaTT.CoM__K_NTsbz43.jpeg",
    title: "Jatt Mehkma (RiskyjaTT.CoM)",
    mood: "happy",
  });

  const [loading, setLoading] = useState(false);
  return (
    <SongContext.Provider value={{ song, setSong, loading, setLoading }}>
      {children}
    </SongContext.Provider>
  );

};


=> Now, we will wrap the App.jsx with the SongContextProvider.

------------------------
Frontend > src > App.jsx
------------------------

import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import "./features/shared/styles/global.scss";
import { AuthProvider } from "./features/auth/auth.context";
import { SongContextProvider } from "./features/home/song.context.jsx";
const App = () => {
  return (
    <AuthProvider>
      <SongContextProvider>
        <RouterProvider router={router} />
      </SongContextProvider>
    </AuthProvider>
  );
};

export default App;





//====================================

Now, lets create the API layer

-------------------------------
Frontend >src > features > home > service > song.api.js
-------------------------------

import axios from "axios";

const api = api.create({
    baseURL: "http://localhost:3000",
    withCredentials: true


})

export async function getSong() {
    const response = await api.get("/api/songs?mood=" + mood);
    return response.data;
}


//====================================

Now, we will create the Hook layer::


---------------------------------
Frontend > src > features > home > hooks > useSong.js
---------------------------------

import { getSong } from "../service/song.api";
import { useContext } from "react";
import {SongContext} from "../song.context";

export const useSong = ({children})=>{
    const context = useContext(SongContext)

    const {song, setSong, loading, setLoading} = context;

    async function handleGetSong({mood}) {
        setLoading(true);
        const data = await getSong(mood);
        setSong(data.song);
        setLoading(false);
    }

    return {song, loading, handleGetSong};
}



//====================================
=> now, for the UI layer, 



//====================================
//====================================
//====================================
//====================================
//====================================
//====================================
