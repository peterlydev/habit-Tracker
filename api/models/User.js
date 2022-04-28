const db = require('../dbConfig');

class User {
    constructor(data) {
        this.id = data.id
        this.first_name = data.first_name
        this.surname = data.surname
        this.username = data.username
        this.password = data.password
    }

    static get all() {
        return new Promise(async (resolve, reject) => {
            try {
                const allUserData = await db.query(`SELECT * FROM users;`);
                let allUsers = allUserData.rows.map(u => new User(u));
                resolve(allUsers)
            } catch (error) {
                reject(`Cannot retrieve all users!`)
            }
        })
    }

    static findByUsername(username) {
        return new Promise(async (resolve, reject) => {
            try {
                const userData = await db.query(`SELECT * FROM users WHERE username = $1;`, [ username ])
                const user = new User(userData.rows[0]);
                resolve(user)
            } catch (error) {
                reject(`Cannot find user!`)
            }
        })
    }

    static register(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const checkUsername = await db.query(`SELECT * FROM users WHERE username = $1;`, [ data.username ])

                if (!checkUsername.rows.length) {
                    let user = await db.query(`INSERT INTO users (first_name, surname, username, password) VALUES ($1, $2, $3, $4) RETURNING *;`, [ data.first_name, data.surname, data.username, data.password ])
                    let newUser = new User(user.rows[0])
                    resolve(newUser)
                } else {
                    reject(`Username is taken.`)
                }
            } catch (error) {
                reject(`Error creating user: ${err}`)
            }
        })
    }
}

module.exports = User
