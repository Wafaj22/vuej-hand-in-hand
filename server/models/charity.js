const { Schema, model} = require('mongoose');

const messageSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        time: {
            type: Date
        }, 
        text: {
            type:String
        }
    }
)

const chatSchema = new Schema(
    {
        receiver:{
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        messages: [{
            type: messageSchema
        }]
    }
)

const CharitySchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'users'       
        },
        image: {
            type: String,
            required: true
        }, 
        mission: {
            type: String,
            required: true
        }, 
        description: {
            type: String,
            required: true
        }, 
        cause: [{
            type: String,
            required: true        	
        }],
        city: {
            type: String,
            required: true
        }, 
        postcode: {
            type: String,
            required: true
        },
        supporter: [{
            type: Schema.Types.ObjectId,
            ref: 'volunteers'
        }],
        connection: [{
            type: Schema.Types.ObjectId,
            ref: 'charities'
        }],
        mobile: {
            type: String
        },
        facebook: {
            type: String
        },
        instagram: {
            type: String
        },
        website: {
            type: String
        },
        campaigns: [{
            type: Schema.Types.ObjectId,
            ref: 'campaigns'
        }],
        opportunities: [{
            type: Schema.Types.ObjectId,
            ref: 'opportunities'
        }], 
        chat: [{
            type: chatSchema
        }], 
        tags: [{
            type:String
        }]
    },
    {timestamps: true}
);

module.exports = model('charities', CharitySchema); //charities collection
