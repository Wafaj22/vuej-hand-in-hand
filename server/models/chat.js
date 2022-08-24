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

const ChatSchema = new Schema(
    {
        users:[{
            type: Schema.Types.ObjectId,
            ref: 'users'       
        }],
        messages: [{
            type: messageSchema
        }], 
    },
    {timestamps: true}
);

module.exports = model('chat', ChatSchema); //users collection
