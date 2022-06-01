var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ticketSchema = new Schema({
    status: {
        type: Boolean
    },
    ticketNo: {
        type: Number,
        unique: true,
        sparse: true,
        min: 1,
        max: 40
    },
    userDetails: [{
        name: {
            type: String
        },
        age: {
            type: Number
        },
    }],
    source: {
        type: String
    },
    destination: {
        type: String
    }
})
const ticketModel = mongoose.model('tickets', ticketSchema);
module.exports = ticketModel;
