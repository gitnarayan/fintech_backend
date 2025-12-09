// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import crypto from 'crypto';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({
//   path: path.resolve(__dirname, '../../.env')
// });

// // Load ENV variables
// const API_SECRET = process.env.NSE_API_SECRET;
// const LICENSE_KEY = process.env.NSE_API_LICENSE;
// const LOGIN_ID = process.env.NSE_LOGIN_ID;
// const MEMBER_ID = process.env.NSE_MEMBER_ID;


// if (!API_SECRET || !LICENSE_KEY || !LOGIN_ID || !MEMBER_ID) {
//   console.warn("❌ Missing NSE ENV variables. Please set NSE_API_SECRET, NSE_API_LICENSE, NSE_LOGIN_ID, NSE_MEMBER_ID");
// }

// // Generate random HEX
// function randomHex(bytes = 16) {
//   return crypto.randomBytes(bytes).toString("hex");
// }

// // AES 128 Encryption using CBC
// function aes128Encrypt(keyBuf, ivBuf, text) {
//   const cipher = crypto.createCipheriv("aes-128-cbc", keyBuf, ivBuf);
//   let encrypted = cipher.update(text, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// }

// function buildFinalEncryptedPassword() {
//   const ivHex = randomHex(16);      // 16 bytes IV → 32 hex characters
//   const saltHex = randomHex(16);    // 16 bytes salt → 32 hex characters

//   const randomNumber = Math.floor(10000000000 + Math.random() * 90000000000).toString();
//   const plainText = `${API_SECRET}|${randomNumber}`;

//   // AES Key must be 16 bytes → LICENSE_KEY is HEX → convert directly
//   const keyBuf = Buffer.from(LICENSE_KEY, "hex");

//   // IV buffer from hex (full 16 bytes)
//   const ivBuf = Buffer.from(ivHex, "hex");

//   const encryptedHex = aes128Encrypt(keyBuf, ivBuf, plainText);

//   // Final encrypted password format
//   const finalEncryptedPassword = Buffer.from(
//     `${ivHex}::${saltHex}::${encryptedHex}`
//   ).toString("base64");

//   return {
//     finalEncryptedPassword,
//     randomNumber,
//     ivHex,
//     saltHex,
//     encryptedHex
//   };
// }

// function buildAuthHeaderValue() {
//   const { finalEncryptedPassword } = buildFinalEncryptedPassword();

//   // Combine LoginID + encrypted password into Basic Auth
//   const basicToken = Buffer.from(`${LOGIN_ID}:${finalEncryptedPassword}`).toString("base64");

//   return `Basic ${basicToken}`;
// }

// // FINAL HEADERS — NSE MANDATORY HEADERS INCLUDED
// function buildAuthHeadersObj() {
//   return {
//     "Content-Type": "application/json",
//     "User-Agent": "PostmanRuntime/7.43.0",
//     "Host": "nseinvestuat.nseindia.com",
//     "Connection": "keep-alive",
//     "Accept-Encoding": "gzip, deflate, br",
//     "Accept-Language": "en-US",
//     "Accept": "*/*",
//     "Cookie": "",
//     "Referer": "",
//     "memberId": MEMBER_ID,
//     "licenseKey": LICENSE_KEY, // add new line
//     "Authorization": buildAuthHeaderValue()
//   };
// }

// export { buildAuthHeaderValue, buildAuthHeadersObj };


import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

/* =======================
   ENV VARIABLES
======================= */
const API_SECRET  = process.env.NSE_API_SECRET;
const LICENSE_KEY = process.env.NSE_API_LICENSE;
const LOGIN_ID    = process.env.NSE_LOGIN_ID;
const MEMBER_ID   = process.env.NSE_MEMBER_ID;

if (!API_SECRET || !LICENSE_KEY || !LOGIN_ID || !MEMBER_ID) {
  console.warn(
    "❌ Missing NSE ENV variables. Please set NSE_API_SECRET, NSE_API_LICENSE, NSE_LOGIN_ID, NSE_MEMBER_ID"
  );
}

/* =======================
   HELPERS
======================= */

function randomHex(bytes = 16) {
  return crypto.randomBytes(bytes).toString('hex');
}

function aes128Encrypt(keyBuf, ivBuf, text) {
  const cipher = crypto.createCipheriv("aes-128-cbc", keyBuf, ivBuf);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

/* =======================
   PASSWORD / AUTH CREATION
======================= */

function buildFinalEncryptedPassword() {

  const ivHex   = randomHex(16);
  const saltHex = randomHex(16);

  const randomNumber = Math.floor(
    10000000000 + Math.random() * 90000000000
  ).toString();

  const plainText = `${API_SECRET}|${randomNumber}`;

  const keyBuf = Buffer.from(LICENSE_KEY, "hex");
  const ivBuf  = Buffer.from(ivHex, "hex");

  const encryptedHex = aes128Encrypt(keyBuf, ivBuf, plainText);

  const finalEncryptedPassword = Buffer.from(
    `${ivHex}::${saltHex}::${encryptedHex}`
  ).toString("base64");

  return finalEncryptedPassword;
}

function buildAuthHeaderValue() {

  const finalEncryptedPassword = buildFinalEncryptedPassword();

  const basicToken = Buffer.from(
    `${LOGIN_ID}:${finalEncryptedPassword}`
  ).toString("base64");

  return `Basic ${basicToken}`;
}

/* =======================
   COOKIE GENERATION
======================= */

async function getNseSessionCookie() {

  const instance = axios.create({
    withCredentials: true,
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "*/*"
    }
  });

  const response = await instance.get("https://www.nseindia.com");

  const cookie = response.headers["set-cookie"]
    ?.map(c => c.split(";")[0])
    .join("; ");

  if (!cookie) {
    throw new Error("❌ NSE session cookie not received");
  }

  return cookie;
}

/* =======================
   FINAL HEADERS BUILDER
======================= */

async function buildAuthHeadersObj() {

  const cookie  = await getNseSessionCookie();
  const basicAuth = buildAuthHeaderValue();

  return {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0",
    "Host": "nseinvestuat.nseindia.com",
    "Connection": "keep-alive",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US",
    "Accept": "*/*",

    "Referer": "https://nseinvestuat.nseindia.com/nsemfdesk/login.htm",
    "Cookie": cookie,

    "memberId": MEMBER_ID,
    "licenseKey": LICENSE_KEY,
    "Authorization": basicAuth
  };
}

export {
  buildAuthHeaderValue,
  buildAuthHeadersObj
};
