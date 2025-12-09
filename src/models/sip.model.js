import mongoose from 'mongoose';

const sipSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        schemeCode: {
            type: String,
            required: true,
        },
        exchange: {
            type: String,
            enum: ['NSE', 'BSE'],
            required: true,
        },
        exchangeOrderId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 500,
        },
        frequency: {
            type: String,
            enum: ['MONTHLY', 'QUARTERLY', 'WEEKLY'],
            default: 'MONTHLY',
        },
        sipDate: {
            type: Number,
            required: true,
            min: 1,
            max: 28,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'PAUSED', 'CANCELLED'],
            default: 'ACTIVE',
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        lastExecutionDate: {
            type: Date,
        },
        nextExecutionDate: {
            type: Date,
        },
        mandateId: {
            type: String,
            required: true,
        },
        totalInstallments: {
            type: Number,
        },
        completedInstallments: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const SIP = mongoose.model('SIP', sipSchema);

export default SIP;