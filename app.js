const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
require('dotenv').config({ path: 'envir.env' });
const cors = require('cors');

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const fs = require('fs');
const path = require('path');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Connect Database
connectDB();
// Middleware
app.use(cors());
app.use(express.json());

//Routes For APIS 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/jobs', require('./routes/job'));
app.use("/api/profile-views", require("./routes/Profile-view"));
app.use("/api/message", require("./routes/message"));
app.use("/api/cities", require("./routes/city"));
app.use('/api/user', require('./routes/user'));
app.use('/api/job-posting', require('./routes/job-posting'));
app.use('/api/job-offers', require('./routes/job-offer'));
app.use('/api/chat', require('./routes/message'));
app.use('/api/porposals', require('./routes/propsals'));

// Define Routes
console.log('JWT Secret:', process.env.JWT_SECRET);
app.listen(5000);