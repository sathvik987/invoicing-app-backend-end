const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: Number,
        default: 0
    },
    invoiceDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        default: Date.now,
    },
    clientName: {
        type: String,
        default: ''
    },
    clientAddress: {
        type: String,
        default: ''
    },
    clientEmail: {
        type: String,
        default: ''
    },
    clientPhone: {
        type: String,
        default: ''
    },
    note: {
        type: String,
        default: ''
    },
    paid: {
        type: Boolean,
        default: false
    },
    items: [{
        description: {
            type: String,
            default: ''
        },
        unit: {
            type: String,
            default: ''
        },
        quantity: {
            type: Number,
            default: 0
        },
        unitPrice: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        },
    }],
    timestamp: {
        type: Date,
        default: Date.now,
    },

});
module.exports = mongoose.model('invoice', invoiceSchema);

