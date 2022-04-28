const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Habit Tracker API!')
});

const userRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');

app.use('/users', userRoutes);
app.use(authRoutes);
app.use('/habits', habitRoutes);

module.exports = app;
