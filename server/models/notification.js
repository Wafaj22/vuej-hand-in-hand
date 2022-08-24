const { Schema, model} = require('mongoose');

const NotificationSchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'users'       
        },
        image: {
            type: String
        },
        message: {
            type: String,
            required: true
        }, 
        time: {
            type: Date,
            required: true
        },
        seen: {
            type: Boolean,
            required: true
        },
        category: {
            type: String,
            enum: ['application', 'donation', 'supporting', 'collaborating', 'chat']
        }, 
    },
    {timestamps: true}
);

module.exports = model('notifications', NotificationSchema); //users collection
