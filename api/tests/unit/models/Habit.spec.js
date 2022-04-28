const Habit = require('../../../models/Habit');
const User = require('../../../models/User');
const pg = require('pg');
jest.mock('pg');
jest.mock('../../../models/User');

const db = require('../../../dbConfig');

const userOne = {
    id: 1,
    first_name: 'futureproof',
    surname: 'mitnick',
    username: 'fpmitnick',
    password: 'password'
};

const habits = [
    {
        habit_id: 1,
        user_id: 1,
        habit_name: 'test habit name',
        frequency: 'daily',
        repetitions: 1,
        curr_repetitions: 0,
        date: 'date'

    }
]

describe('Habit model', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('get all', () => {
        it('it resolves with all habits on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValue({ rows: [{},{},{},{}]});
            const allHabits = await Habit.all;
            expect(allHabits).toHaveLength(4);
        })

        it('the error message is correct', async () => {
            return Habit.all.catch(error => {
                expect(error).toBe('Error retrieving all habits')
            })
        })
    })


    describe('findByHabitId', () => {
        it('it resolves with the correct habit on successful db query', async () => {
            jest.spyOn(db, 'query').mockResolvedValue({rows: habits});
            let test = new Habit(habits[0]);
            const data = await Habit.findByHabitId(test.habit_id);
            expect(data).toEqual({
                "habit_id": 1,
                "user_id": 1,
                "habit_name": 'test habit name',
                "current_streak": 0,
                "frequency": 'daily',
                "curr_repetitions": 0,
                "repetitions": 1,
                "date": 'date'
            })
        })

        it('the error message is correct on unsuccessful db query', async () => {
            return Habit.findByHabitId('10').catch(error => {
                expect(error).toBe('Error getting this habit')
            })
        })
    })


    describe('findHabitsByUsername', () => {
        it('it retrieves all habits for a user on successful db query', async () => {
            jest.spyOn(db, 'query').mockResolvedValue({rows: habits})
            let test = new User(userOne)
            const result = await Habit.findHabitsByUsername(test.username);
            expect(result).toHaveLength(1)
            expect(result[0]).toEqual({
                "habit_id": 1,
                "user_id": 1,
                "current_streak": 0,
                "habit_name": 'test habit name',
                "frequency": 'daily',
                "repetitions": 1,
                "curr_repetitions": 0,
                "date": 'date'
            })
        })

        it('the error message is correct on unsuccessful db query', async () => {
            return Habit.findHabitsByUsername('fake').catch(error => {
                expect(error).toBe(`Error getting this users data: `, error)
            })
        })
    })


    describe('create', () => {
        it('it resolves with succesfully created habit', async () => {
            let habitData = {
                habit_name: 'test creation',
                frequency: 'daily',
                user_id: 10,
                date: 'date',
                repetitions: 1,
                curr_repetitions: 0
                
            }
            jest.spyOn(db, 'query')
                .mockResolvedValue({rows: 'test'})
                .mockResolvedValue({rows: [{...habitData, habit_id: 1}]})
            const createdHabit = await Habit.create(habitData)
            expect(createdHabit).toEqual({
                "habit_id": 1,
                "user_id": 10,
                "current_streak": 0,
                "habit_name": 'test creation',
                "frequency": 'daily',
                "repetitions": 1,
                "curr_repetitions": 0,
                "date": 'date'
            })
        })

        test('the error message is correct', async () => {
            return Habit.create('testing').catch(error => {
                expect(error).toBe('Error adding habit')
            })
        })
    })


    describe('destroy', () => {
        it('successfully deletes habit', async () => {
            // creating data to delete
            const testData = {
                user_id: 4,
                habit_name: 'test delete habit',
                frequency: 'daily',
                repetitions: 1,
                curr_repetitions: 0,
                date: 'date'
            }
            jest.spyOn(db, 'query')
                .mockResolvedValue({rows: 'test'})
                .mockResolvedValue({rows: [{...testData, habit_id: 2}]})

            const createdTestHabit = await Habit.create(testData)
            expect(createdTestHabit).toEqual({
                habit_id: 2,
                user_id: 4,
                habit_name: 'test delete habit',
                current_streak: 0,
                frequency: 'daily',
                curr_repetitions: 0,
                repetitions: 1,
                date: 'date'
            })

            id = 2
            const deletedHabit = await createdTestHabit.destroy()
            expect(deletedHabit).toBe('Habit deleted')
        })

        it('the error message is correct', async () => {
            let fakeHabitData = {
                habit_name: 'test error deletion',
                frequency: 'daily',
                user_id: 10,
                date: 'date',
                repetitions: 1,
                curr_repetitions: 0
                
            }
            jest.spyOn(db, 'query')
                .mockResolvedValue({rows: 'test'})
                .mockResolvedValue({rows: [{...fakeHabitData, habit_id: 10}]})
            const fakeHabit = await Habit.create(fakeHabitData)

            return fakeHabit.destroy().catch(error => {
                expect(error).toBe('Error deleting habit')
            })
        })
    })
})



