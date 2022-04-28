const userController = require('../../../controllers/user');
const User = require('../../../models/User');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }))
const mockRes = { status: mockStatus }



let userOne = {
    id: 1,
    first_name: 'john',
    surname: 'smith',
    username: 'jsmith',
    password: 'password'

};

describe('users controller', () => {
    beforeEach(() => jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        it('it returns all users with status 200', async () => {
            jest.spyOn(User, 'all', 'get')
                .mockResolvedValue([{}, {}, {}, {}])
            await userController.index(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith([{},{},{},{}])
        })
    })

    describe('find', () => {
        it('it returns status code 200 if user is found', async () => {
            jest.spyOn(User, 'findByUsername')
                .mockResolvedValue({rows:[userOne]})
            const mockRequest = {params: {username: 'jsmith'}}
            await userController.find(mockRequest, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({msg: `User found`})
        })

        test('it returns 404 if the user cannot be found', async () => {
            jest.spyOn(User, 'findByUsername')
                .mockResolvedValue({rows: []})
            const mockRequest = {params: {username: 'fake_user'}}
            await userController.find(mockRequest, mockRes)
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({msg: 'User not found!'})
        })
    })

})
