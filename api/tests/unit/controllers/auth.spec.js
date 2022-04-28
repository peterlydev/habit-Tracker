const authController = require('../../../controllers/auth');
const User = require('../../../models/User');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }))
const mockRes = { status: mockStatus }

const db = require('../../../dbConfig');
const bcrypt = require('bcryptjs');

let userOne = {
    first_name: 'Jane',
    surname: 'Smith',
    username: 'janesmith',
    password: 'testpassword'
}

describe('auth controller', () => {
    beforeEach(() => jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('register', () => {
        it('it returns 201 if user can create an account successfully', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValue({rows: []})
                .mockResolvedValue({rows: []})
            jest.spyOn(User, 'register')
                .mockResolvedValue(new User({userOne, id: 1}))
            const mockRequest = {body: {password: 'test'}}
            await authController.register(mockRequest, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(201)
            expect(mockJson).toHaveBeenCalledWith({msg: 'User created successfully'})
        })

        it('it returns an error if the username is already taken', async () => {
            jest.spyOn(User, 'register')
                .mockRejectedValueOnce(`Error creating this user`)
            const mockRequest = {body: {password: 'test'}}
            await authController.register(mockRequest, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({err: 'Username already exists.'})
        })
    })

    describe('login', () => {
        // it('it returns 200 on successful login', async () => {
        //     jest.spyOn(User, 'findByUsername')
        //         .mockResolvedValueOnce(new User(userOne))
        //     jest.spyOn(bcrypt, 'compare')
        //         .mockResolvedValueOnce(true)
        //     const mockRequest = {body: {username: 'janesmith'}}
        //     await authController.login(mockRequest, mockRes)
        //     expect(mockStatus).toHaveBeenCalledWith(200);
        // })

        it('it returns 401 on unsuccessful login', async () => {
            jest.spyOn(User, 'findByUsername')
                .mockResolvedValue(new User(userOne))
            
            jest.spyOn(bcrypt, 'compare')
                .mockResolvedValue(false);
            
            const mockRequest = {body: {username: 'fake_user'}};
            await authController.login(mockRequest, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(401);
        })
    })
})
