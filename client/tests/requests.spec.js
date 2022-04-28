/**
* @jest-environment jsdom
*/

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

global.fetch = require('jest-fetch-mock');

let app;

describe('creating habit', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        event = { preventDefault: jest.fn() }
        app = require('../js/requests');
        data = {
            "habit_id": 4,
            "habit_name": "go running",
            "user_id": 2,
            "current_streak": 0,
            "curr_repetitions": 0,
            "date": "2022-04-14T12:57:49.497Z",
            "repetitions": 0,
            "frequency": "daily"
        }
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    it('it creates a habit', async () => {
        await app.createHabit(data)
    })
})

describe('listing habits', () => {
    afterEach(() => {
        fetch.resetMocks();
    })
    it('it lists a users habits', async () => {
        await app.listsHabits()
    })
})

describe('habit item', () => {
    afterEach(() => {
        fetch.resetMocks();
    })
    it('it lists a habit', async () => {
        obj = {
            "habit_id": 4,
            "obj.curr_repetitions": 0,
            "obj.repetitions": 0,
            "obj.habit_name": "test",
            "obj.frequency": "daily"
        }

        await app.habitItem(obj)
    })
})
