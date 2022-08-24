const { Schema, model} = require('mongoose');

const subSchema = new Schema({
    name: {
        type: String,
    }, 
    username: {
        type: String,
    }, 
    image: {
        type: String,
    }, 
    about: {
        type: String,
    }, 
    description: {
        type: String,
    }, 
    skills: [{
        type: String,    	
    }],
    causes: [{
        type: String,       	
    }],
    cv: {
        type: String
    },
    linkedin: {
        type: String	
    },
    portfolio: {
        type: String
    },
});

const ApplicationSchema = new Schema(
    {
        applicant:{
            type: Schema.Types.ObjectId,
            ref: 'users'       
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: 'opportunities'
        },
        details: {
            type: subSchema
        }
    },
    {timestamps: true}
);

module.exports = model('applications', ApplicationSchema);
