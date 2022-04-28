const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit');
const auth = require('../controllers/auth')

router.get('/', auth.verifyToken, habitController.getAllHabits);


// do we need a route for this?
router.get('/:habit_id', auth.verifyToken, habitController.getHabitById);

// will need a verify token function here, if we take out top one and change this one '/:username
router.get('/users/:username', auth.verifyToken, habitController.getHabitsByUsername);

router.post('/users/:username', auth.verifyToken, habitController.addHabit);

router.patch('/:habit_id', habitController.increaseRep);

router.delete('/delete/:id', auth.verifyToken, habitController.deleteHabit);

module.exports = router
