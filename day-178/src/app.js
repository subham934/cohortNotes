let express = require('express');
let cookieParser = require('cookie-parser');
let authRoutes = require('./routes/auth.routes');
let homeRoutes = require('./routes/home.routes'); 





let app = express();
app.use(express.json());
app.use(cookieParser());




app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);

module.exports = app;
