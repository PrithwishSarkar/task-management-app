const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const taskRoutes = require('./routes/taskRoutes')

const app = express();

app.use(express.json());
app.use(cors());

const dbURI = "mongodb+srv://nodeuser:Abcd123@nodelearn.qpw8i2d.mongodb.net/task-management?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("Database Connection Successful"))
  .catch((err) => console.log(err));

app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
