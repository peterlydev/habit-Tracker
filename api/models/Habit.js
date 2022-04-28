const db = require('../dbConfig');

class Habit {
    constructor(data) {
        this.habit_id = data.habit_id
        this.user_id = data.user_id
        this.habit_name = data.habit_name
        this.current_streak = 0
        this.frequency = data.frequency
        this.curr_repetitions = data.curr_repetitions
        this.repetitions = data.repetitions
        this.date = data.date
    }

    static get all() {
        return new Promise(async (resolve, reject) => {
            try {
                let habitData = await db.query(`SELECT * FROM habits;`);
                let allHabits = habitData.rows.map(h => new Habit(h));
                resolve(allHabits)
            } catch (error) {
                reject(`Error retrieving all habits`)
            }
        })
    }

    static findByHabitId(habit_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const habitData = await db.query(`SELECT * FROM habits WHERE habit_id = $1;`, [habit_id ]);
                let habit = new Habit(habitData.rows[0])
                resolve(habit)
            } catch (error) {
                reject(`Error getting this habit`)
            }
        })
    }

    static findHabitsByUsername(username) {
        return new Promise(async (resolve, reject) => {
            try {
                const checkUsername = await db.query(`SELECT * FROM users WHERE username = $1;`, [ username ]);
                if (checkUsername.rows[0]) {
                    const userHabitData = await db.query(`SELECT * FROM habits JOIN users ON habits.user_id = users.id WHERE users.username = $1 ORDER BY habit_id;`, [ username ]);
                    let userHabits = userHabitData.rows.map(h => new Habit(h))
                    if (!userHabits[0]) {
                        throw new Error(`User has no habits`)
                    }     
                    resolve(userHabits)
                } else {
                    throw new Error(`Username does not exist`)
                }
            } catch (err) {
                reject(err);
            }
        })
    }

    static create({habit_name, frequency, repetitions, username}) {
        return new Promise(async (resolve, reject) => {
            try {
                const userData = await db.query(`SELECT id FROM users WHERE username = $1;`, [ username ]);
                let user = userData.rows[0]
                const newHabitQuery = await db.query(`INSERT INTO habits (user_id, habit_name, frequency, repetitions) VALUES ($1, $2, $3, $4) RETURNING *;`, [ user.id, habit_name, frequency, repetitions ])
                let newHabit = new Habit(newHabitQuery.rows[0])
                resolve(newHabit)
            } catch (error) {
                reject("Error adding habit")
            }
        })
    }

    increaseCurrRepetition() {
        return new Promise(async (resolve, reject) => {
            try {
                const findHabitInfo = await Habit.findByHabitId(this.habit_id)

                if (findHabitInfo.curr_repetitions === findHabitInfo.repetitions) {
                    reject('Max reached. Cannot update')
                } else {
                    const increaseRep = await db.query('UPDATE habits SET curr_repetitions = curr_repetitions + 1 WHERE habit_id = $1;', [ this.habit_id ])
                    resolve('Repetition increased successfully')
                }
            } catch (error) {
                reject('Failed to update counter to the database')
            }
        })
    }

    destroy() {
        return new Promise(async (resolve, reject) => {
            try {
                await db.query(`DELETE FROM habits WHERE habit_id = $1;`, [ this.habit_id ]);
                resolve('Habit deleted')
            } catch (error) {
                reject ('Error deleting habit')
            }
        })
    }
}

module.exports = Habit
