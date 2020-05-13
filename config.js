require('dotenv').config()

const db = {
    user: process.env.MONGODB_USER ,
    password: process.env.MONGODB_PASSWORD,
    url: process.env.MONGODB_URL,
    database: process.env.MONGODB_DATABASE
}

const app = {
    port: process.env.PORT
}

Object.freeze(db)
Object.freeze(app)

exports.db =  db
exports.app = app