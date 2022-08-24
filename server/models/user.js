const { Schema, model} = require('mongoose');

const UserSchema = new Schema(
    {
    	username: {
      	    type: String,
      	    required: true
    	},
        name: {
            type: String,
            required: true
        }, 
        email: {
            type: String,
            required: true
        }, 
        role: {
            type: String,
            default: 'user',
            enum: ['charity', 'user']
        }, 
        password: {
            type: String,
            required: true
        },
    },
    {timestamps: true}
);

module.exports = model('users', UserSchema); //users collection
