import Joi from 'joi';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(5000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    CLIENT_SECRET: Joi.string().description('otpless client secret for sending SMS'),
    CLIENT_ID: Joi.string().description('otpless client id for sending SMS'),
    AWS_ACCESS_KEY_ID: Joi.string().description('AWS access key for S3'),
    AWS_SECRET_ACCESS_KEY: Joi.string().description('AWS secret access key for S3'),
    AWS_REGION: Joi.string().description('AWS region for S3'),
    ENCRYPTION_KEY: Joi.string().description('Encryption key for security'),
    ECNRYPTION_METHOD: Joi.string().description('Encryption method for security'),

    // Vultr Object Storage
    VULTR_ACCESS_KEY_ID: Joi.string().description('Vultr access key for Object Storage'),
    VULTR_SECRET_ACCESS_KEY: Joi.string().description('Vultr secret key for Object Storage'),
    VULTR_REGION: Joi.string().description('Vultr Object Storage region'),
    VULTR_ENDPOINT: Joi.string().description('Vultr Object Storage endpoint'),

    // NSE API
    NSE_API_BASE_URL: Joi.string().description('Base URL for NSE API'),
    NSE_API_KEY: Joi.string().description('API key for NSE'),

    // BSE API
    BSE_API_BASE_URL: Joi.string().description('Base URL for BSE API'),
    BSE_API_KEY: Joi.string().description('API key for BSE'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL,
    // options: {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  sms: {
    clientId: envVars.CLIENT_ID,
    clientSecret: envVars.CLIENT_SECRET,
  },
  awsCredential: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    region: envVars.AWS_REGION,
  },
  cryptoCredential: {
    encryptionKey: envVars.ENCRYPTION_KEY,
    encryptionMethod: envVars.ECNRYPTION_METHOD,
  },
  vultrCredential: {
    accessKeyId: envVars.VULTR_ACCESS_KEY_ID,
    secretAccessKey: envVars.VULTR_SECRET_ACCESS_KEY,
    region: envVars.VULTR_REGION,
    endpoint: envVars.VULTR_ENDPOINT,
  },
  nseApi: {
    baseUrl: envVars.NSE_API_BASE_URL,
    apiKey: envVars.NSE_API_KEY,
  },
  bseApi: {
    baseUrl: envVars.BSE_API_BASE_URL,
    apiKey: envVars.BSE_API_KEY,
  },
};

export default config;
