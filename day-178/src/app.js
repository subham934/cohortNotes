let express = require("express");
let authRoutes = require('./routes/auth.routes');


let app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

module.exports = app;