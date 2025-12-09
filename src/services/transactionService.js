import { Transaction, Socialaction, Plan, Agent, } from '../models/index.js'; // Import the User model
import { uploadFile } from '../utils/s3.js';// Function to create a new user
import { mongoose } from 'mongoose';
import { convertToUpperCase } from '../utils/utilsFunction.js'
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';
// import { Obje/ctId } from 'mongoose';

const createTransaction = async (bodyData) => {
    const [plan, agent, existingTransaction] = await Promise.all([
        Plan.findById(bodyData.planId),
        Agent.findById(bodyData.agentId),
    ]);
    if (!plan) throw new ApiError(httpStatus.BAD_REQUEST, "Plan not found");
    if (!agent) throw new ApiError(httpStatus.BAD_REQUEST, "Agent not found");

    if (
        new Date(agent.planExpiry) >= new Date()
    ) {
        throw new ApiError(httpStatus.BAD_REQUEST, "plan exist.");
    }
    const newTransaction = await Transaction.create(bodyData);
    return newTransaction;
};


const getTransactionQuery = async (filter, option) => {
    let transaction = await Transaction.paginate(filter, option)
    return transaction;
};
export default { createTransaction, getTransactionQuery };