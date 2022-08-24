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

const VolunteerSchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'users'       
        },
        image: {
            type: String,
            required: true
        }, 
        about: {
            type: String,
            required: true
        }, 
        description: {
            type: String,
            required: true
        }, 
        skills: [{
            type: String,
            required: true        	
        }],
        causes: [{
            type: String,
            required: true        	
        }],
        tags: [{
            type: String,  	
        }],
        city: {
            type: String,
            required: true
        }, 
        postcode: {
            type: String,
            required: true
        },
        charities: [{
            type: Schema.Types.ObjectId,
            ref: 'charities'
        }],
        birthdate:{
            type: Date
        },
        mobile: {
            type: String
        },
        facebook: {
            type: String
        },
        website: {
            type: String
        },
        instagram:{
            type: String
        },
        cv: {
            type: String
        },
        linkedin: {
            type: String	
        },
        portfolio: {
            type: String
        },
        applications: [{
            type: Schema.Types.ObjectId,
            ref: 'applications'
        }],
        donations: [{
            type: Schema.Types.ObjectId,
            ref: 'donations'
        }],
        opportunities: [{
            type: Schema.Types.ObjectId,
            ref: 'opportunities'
        }],
        chat: [{
            type: chatSchema
        }]
    },
    {timestamps: true}
);

module.exports = model('volunteers', VolunteerSchema); //volunteers collection
