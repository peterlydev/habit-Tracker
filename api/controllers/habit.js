const Habit = require('../models/Habit');

async function getAllHabits(req, res) {
    try {
        const allHabits = await Habit.all
        res.status(200).json(allHabits)
    } catch (error) {
        res.status(500).send({error})
    }
}

async function getHabitById(req, res) {
    try {
        const habitData = await Habit.findByHabitId(req.params.habit_id)
        res.status(200).json(habitData)
    } catch (error) {
        res.status(500).send({error})
    }
}

async function getHabitsByUsername(req, res) {
    try {
        const habitsData = await Habit.findHabitsByUsername(req.params.username)
        res.status(200).json(habitsData)
    } catch (err) {
        res.status(404).send({ err: err.message });
    }
}

async function addHabit(req, res) {
    try {
        // console.log(req.body)
        const {username} = req.params
        const newHabit = await Habit.create({...req.body, username})
        res.status(201).json(newHabit)
    } catch (error) {
        res.status(500).send({error})
    }
}

async function deleteHabit(req, res) {
    try {
        const deletedHabit = await Habit.findByHabitId(req.params.id);
        await deletedHabit.destroy();
        res.status(204).json()
    } catch (error) {
        if (error.message === 'Error getting this habit'){
            res.status(404).send({error})
        } else {
        res.status(500).send({error})
        }
    }
}

async function increaseRep(req, res) {
    try {
        const habit = await Habit.findByHabitId(req.params.habit_id)
        await habit.increaseCurrRepetition()
        const updatedHabit = await Habit.findByHabitId(req.params.habit_id)
        res.status(200).json(updatedHabit)
    } catch (error) {
        res.status(500).json({msg: 'Max reached, cannot be updated.'})
    }
}

module.exports = { getAllHabits, getHabitById, getHabitsByUsername, addHabit, deleteHabit, increaseRep }
