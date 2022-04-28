/**
* @jest-environment jsdom
*/

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../login.html'), 'utf8');

global.fetch = require('jest-fetch-mock');
let test;

describe('submit the login form', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        test = require('../js/auth.js');
    })

    afterEach(() => {
        fetch.resetMocks();
    })

    describe('submits form', () => {
        let event;

        beforeEach(() => {
            fetch.resetMocks();
            event = { preventDefault: jest.fn() }
        })

        it('submits login form', async () => {
            await test.requestLogin(event);
        })

        it('it submits register form', async () => {
            await test.requestRegistration(event);
        })

        it('it logs out', async () => {
            await test.logout();
        })
    })
})

describe('new habit, delete, update', () => {
    beforeEach(() => {
        test = require('../js/auth');
        event = { preventDefault: jest.fn() }
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    it('creates new habit', async () => {
        const event = { preventDefault: jest.fn(), target: {habit_name: 'test', frequency: 10} }
        await test.postHabit(event)
    })

    it('deletes habit', async () => {
        const event = { preventDefault: jest.fn(), target: {habit_id: 4} }
        await test.deleteHabit(event)
    })

    it('increases counter', async () => {
        const event = {habit_id: 4}
        await test.patchReps(event)
    })

    it('checks the current user', async () => {
        test.currentUser();
    })

    it('retrieves habits list', async () => {
        await test.userHabits();
    })
})
