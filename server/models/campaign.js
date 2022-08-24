const { Schema, model} = require('mongoose');

const CampaignSchema = new Schema(
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
        goal: {
            type: Number,
            required: true
        }, 
        urgent: {
            type: Boolean,
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
        donations: [{
            type: Schema.Types.ObjectId,
            ref: 'donations'
        }],
        collaborating: [{
            type: Schema.Types.ObjectId,
            ref: 'charities'
        }]
        
    },
    {timestamps: true}
);

module.exports = model('campaigns', CampaignSchema);