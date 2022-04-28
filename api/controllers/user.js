const User = require('../models/User');

async function index(req, res) {
    try {
        const users = await User.all
        res.status(200).json(users)
    } catch (error) {
        res.status(500).send({error})
    }
}

async function find(req, res) {
    try {
        const user = await User.findByUsername(req.params.username)
        if (!user.rows.length) {
            res.status(404).json({msg: `User not found!`})
        } else {
            res.status(200).json({msg: `User found`})
        }
    } catch (error) {
        res.status(404).send({err: `Error finding user`})
    }
}

module.exports = { index, find }
