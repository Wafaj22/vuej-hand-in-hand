const { Schema, model} = require('mongoose');

const OpportunitySchema = new Schema(
    {
        charity: {
            type: Schema.Types.ObjectId,
            ref: 'charities'
        },
    	title: {
      	    type: String,
      	    required: true
    	},
        image: {
            type: String,
            required: true
        }, 
        urgent: {
            type: Boolean,
            required: true
        }, 
        shortDescription: {
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
        skills: [{
            type: String,
            required: true        	
        }],
        resp: [{
            type: String,
            required: true        	
        }],
        reqs: [{
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
        applications: [{
            type: Schema.Types.ObjectId,
            ref: 'applications'
        }],
        volunteers: [{
            type: Schema.Types.ObjectId,
            ref: 'volunteers'
        }],
        collaborating: [{
            type: Schema.Types.ObjectId,
            ref: 'charities'
        }]
        
    },
    {timestamps: true}
);

module.exports = model('opportunities', OpportunitySchema);
