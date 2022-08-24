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
    message: {
        type: String,
    },
});

const DonationSchema = new Schema(
    {
        donor:{
            type: Schema.Types.ObjectId,
            ref: 'volunteers'       
        },
        annonymous: {
            type: Boolean,
            required: true
        }, 
        amount: {
            type: Number,
            required: true
        },
        method:{
            type: String,
            required: true
        }, 
        campaign: {
            type: Schema.Types.ObjectId,
            ref: 'campaigns'
        },
        details: {
            type: subSchema
        }
    },
    {timestamps: true}
);

module.exports = model('donations', DonationSchema);
