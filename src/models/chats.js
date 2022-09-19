const mongo = require("mongoose");
const { Schema } = mongo;

const chats = new Schema({

    users: [],
    chat: [],

});

module.exports = mongo.model("chats", chats);