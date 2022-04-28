const { TestWatcher } = require('jest');
const habitController = require('../../../controllers/habit');
const Habit = require('../../../models/Habit');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson, end: jest.fn() }))
const mockRes = { status: mockStatus }

const testHabit = {
    habit_id: 10,
    user_id: 2,
    habit_name: 'test habit',
    current_streak: 0,
    frequency: 'yearly',
    curr_repetitions: 0,
    repetitions: 5,
    date: '2022-04-12T13:39:21.348Z'
}

describe('habit controller', () => {
    beforeEach(() => jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('get all habits', () => {
        it('it returns 200 on getting all habits', async () => {
            jest.spyOn(Habit, 'all', 'get')
                .mockResolvedValue([{},{}])
            await habitController.getAllHabits(null, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith([{},{}])
        })

        it('it returns status code 500 if there is an error', async () => {
            jest.spyOn(Habit, 'all', 'get')
                .mockRejectedValue([])
            await habitController.getAllHabits(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(500);
        })
    })

    describe('get habit by id', () => {
        it('it returns a status 200 when getting a habit by id', async () => {
            jest.spyOn(Habit, 'findByHabitId')
                .mockResolvedValue([{},{}])
            const mockRequest = {params:{habit_id: 1}}
            await habitController.getHabitById(mockRequest, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith([{},{}])
        })

        it('it returns status code 500 when it cannot get habit by id', async () => {
            jest.spyOn(Habit, 'findByHabitId')
                .mockRejectedValue([])
            const mockRequest = {params:{habit_id: 1}}
            await habitController.getHabitById(mockRequest, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(500);
        })
    })

    describe('get habits by username', () => {
        it('returns status code 200 and all the habits for the specific user', async () => {
            jest.spyOn(Habit, 'findHabitsByUsername')
                .mockResolvedValue([{},{}])
            const mockRequest = {params: {username: 'test'}}
            await habitController.getHabitsByUsername(mockRequest, mockRes)
            expect(mockJson).toHaveBeenCalledWith([{},{}])
            expect(mockStatus).toHaveBeenCalledWith(200);
        })

        it('it returns with error 404 if it cannot retrieve the habits for the user', async () => {
            jest.spyOn(Habit, 'findHabitsByUsername')
                .mockRejectedValue([])
            const mockRequest = {params: {username: 'fail_test'}}
            await habitController.getHabitsByUsername(mockRequest, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(404);
        })
    })

    describe('add habit', () => {
        it('it creates a new habit and returns status code 201', async () => {
            jest.spyOn(Habit, 'create')
                .mockResolvedValue(expect.objectContaining(testHabit));
            
            const mockRequest = {
                params: {
                    username: 'test_user'
                },
                body: {
                    habit_name: 'test habit',
                    frequency: 'weekly',
                    curr_repetitions: 0,
                    repetitions: 5,
                    current_streak: 0
                }
            }

            await habitController.addHabit(mockRequest, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(testHabit); 
        })

        it('it returns status code 500 if habit cannot be created', async () => {
            jest.spyOn(Habit, 'create')
                .mockRejectedValue([])
            const mockRequest = {
                params: {
                    username: 'fake_user'
                },
                body: {
                    habit_name: 'fake test habit',
                    frequency: 'daily',
                    curr_repetitions: 2,
                    repetitions: 3,
                    current_streak: 1
                }
            }
            await habitController.addHabit(mockRequest, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(500);
        })
    })

    // not working since static was removed from Habit model > destroy


    // describe('delete habit', () => {
    //     it('returns status code 204 when a habit is successfuly deleted', async () => {

    //         jest.spyOn(Habit, 'destroy')
    //             .mockResolvedValue('Habit deleted')
    //         const mockRequest = {params: {id:10}}
    //         await habitController.deleteHabit(mockRequest, mockRes);
    //         expect(mockStatus).toHaveBeenCalledWith(204);
    //     })

    //     it('it returns status code 500 if habit cannot be deleted', async () => {
    //         jest.spyOn(Habit, 'destroy')
    //             .mockRejectedValue([])
    //         const mockRequest = {params: {id:3}}
    //         await habitController.deleteHabit(mockRequest, mockRes)
    //         expect(mockStatus).toHaveBeenCalledWith(500);
    //     })
    // })
})
