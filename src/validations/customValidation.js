const generateErrorMessages = (fieldName, rules) => {
    const messages = {};
    if (rules.required) {
        messages['any.required'] = `${fieldName} is required.`;
    }
    if (rules.empty) {
        messages['string.empty'] = `${fieldName} cannot be empty.`;
    }
    if (rules.email) {
        messages['string.email'] = `${fieldName} must be a valid email address.`;
    }
    if (rules.min) {
        messages['string.min'] = `${fieldName} must be at leaste ${rules.min} characters long.`;
    }
    if (rules.max) {
        messages['string.max'] = `${fieldName} must be  maximum ${rules.max} characters long.`;
    }
    if (rules.valid) {
        messages['any.only'] = `${fieldName} must be one of ${rules.valid.join(', ')}.`;
    }
    if (rules.date) {
        messages['date.base'] = `${fieldName} must be a valid date.`;
    }
    return messages;
};
// const { parsePhoneNumberFromString, isPossiblePhoneNumber, validatePhoneNumberLength, isValidPhoneNumber, parsePhoneNumber } = require('libphonenumber-js');
const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
};
const dateOfBirth = (value, helpers) => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18))
    if (isNaN(Date.parse(value))) {
        return helpers.message('"{{#label}}" must be a valid date.');
    }
    if (new Date(value) > eighteenYearsAgo) {
        return helpers.message('"{{#label}}" must be at leaste 18 years old.');
    }
    return value;
};
const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('password must be at leaste 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('password must contain at leaste 1 letter and 1 number');
    }
    return value;
};
const email = (value, helpers) => {
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
        return helpers.message('Invalid email format. Please enter a valid email address.');
    }
    return value;
};
const contact = (value, helpers) => {
    if (!/^[6-9]\d{9}$/.test(value)) {
        return helpers.message('Invalid mobile number. Please enter a valid 10-digit number.');
    }
    return value;
};

const mobile = (value, helpers) => {
    console.log(value)
    const phoneNumber = parsePhoneNumber(value);
    if (!phoneNumber.isValid()) {
        return helpers.message('Please enter a valid mobile number with country code.');
    }
    return value;
};
const otp = (value, helpers) => {
    if (value.length != 6) {
        return helpers.message('Otp must be 6 digits ');
    }
    return value;
};
const date = (value, helpers) => {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
    if (!regex.test(value)) {
        return helpers.message({
            code: 400,
            message: 'Invalid date format. Please enter a valid date in YYYY-MM-DD format.',
            field: 'date'
        });
    }
    return value;
};
const message = (value, helpers) => {
    if (!value) {
        return helpers.message('Invalid mobile format. Please enter a valid mobile number.');
    }
    return value;
};
export {
    generateErrorMessages, objectId,
    password, email, otp, date, dateOfBirth, contact
}