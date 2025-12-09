import Joi from 'joi'
import { dateOfBirth, generateErrorMessages, contact } from './customValidation.js'






const createuser = {
    body: Joi.object().keys({
        firstName: Joi.string().trim().required().messages(generateErrorMessages('First Name', { required: true, empty: true })),
        lastName: Joi.string().trim().required().messages(generateErrorMessages('Last Name', { required: true, empty: true })),
        gender: Joi.string().valid('male', 'female', 'other').required().messages(generateErrorMessages('Gender', { required: true, valid: ['male', 'female', 'other'] })),
        email: Joi.string().email().lowercase().required().messages(generateErrorMessages('Email', { required: true, email: true, empty: true })),
        password: Joi.string().min(8).required().messages(generateErrorMessages('Password', { required: true, empty: true, min: 8 })),
        dateOfBirth: Joi.alternatives().conditional('onBehalf', { is: "mySelf", then: Joi.date().required().custom(dateOfBirth).messages(generateErrorMessages('Date of Birth', { required: true, date: true })), otherwise: Joi.date().required().messages(generateErrorMessages('Date of Birth', { required: true, date: true })), }),
        mobile: Joi.number().required().messages(generateErrorMessages('Mobile', { required: true, empty: true })),
        countryCode: Joi.string().required().messages(generateErrorMessages('CountryCode', { required: true, empty: true })),
        // role: Joi.string().valid('user', 'admin').required().messages(generateErrorMessages('Role', { required: true, valid: ['user', 'admin'] })),
    }),
};

const logIn = {
    body: Joi.object().keys({
        email: Joi.string().email().lowercase().required().messages(generateErrorMessages('Email', { required: true, email: true, empty: true })),
        password: Joi.string().min(8).required().messages(generateErrorMessages('Password', { required: true, empty: true, min: 8 })),
    })
}

const logout = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};


export default { createuser, logIn, logout }