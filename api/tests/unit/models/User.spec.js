const User = require('../../../models/User');

const pg = require('pg');
jest.mock('pg');

const db = require('../../../dbConfig');
const { TestWatcher } = require('jest');

const userOne = {
    id: '1',
    first_name: 'test',
    surname: 'user',
    username: 'test_user',
    password: 'password'
}

const userTwo = {
    id: '2',
    first_name: 'futureproof',
    surname: 'mitnick',
    username: 'fpmitnick',
    password: 'password'
}

describe('User', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        it('it resolves all users on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}, {}]});
            const all = await User.all;
            expect(all).toHaveLength(4)
        })

        test('the error message for get all is correct', async () => {
            return User.all.catch(error => {
                expect(error).toBe('Cannot retrieve all users!')
            })
        })
    });

    describe('findByUsername', () => {
        it('it resolves with a user on succesful db query if username exists', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ userOne ] });
            const result = await User.findByUsername(userOne.username);
            expect(result).toHaveProperty('username', 'test_user')
        })

        test('the error message for findByUsername is correct', async () => {
            return User.findByUsername('futureproof').catch(error => {
                expect(error).toBe('Cannot find user!')
            })
        })
    });

    describe('register', () => {
        it('resolves a successfully created user', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows:{}})
                .mockResolvedValueOnce({rows: [userTwo]})
            const result = await User.register(userTwo.first_name, userTwo.surname, userTwo.username, userTwo.password)
            expect(result).toHaveProperty('id', '2');
            expect(result).toHaveProperty('username', 'fpmitnick');
            expect(result).toHaveProperty('first_name', 'futureproof');
            expect(result).toHaveProperty('surname', 'mitnick');
            expect(result).toHaveProperty('password', 'password');          
        })

        test('user already exists', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows:[1]})
                .mockResolvedValueOnce({rows:{}})
            return User.register(userTwo.first_name, userTwo.surname, userTwo.username, userTwo.password).catch(error => {
                expect(error).toBe('Username is taken.');
            })
        })
    })
})
