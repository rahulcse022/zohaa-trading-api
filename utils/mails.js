const mailgunJS = require("mailgun-js");
const formData = require("form-data");
const otpGenerator = require("otp-generator");
// const mailgun = new Mailgun(formData);
const api_key = "7566db4f15996c9be5edfba2d94bce72-73f745ed-dd5c7927";
const domain = "sandbox1f1e75d031fd4711aae5e03652e0ce3a.mailgun.org";
// const mg = mailgun.client({ username: 'api', key: api_key });
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const mailgun = mailgunJS({ apiKey: api_key, domain: domain });

const sendEmail = (data) => {
  return new Promise((resolve, reject) => {
    mailgun.messages().send(data, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

const cacheOTP = (key, otp) => {
  console.log("===>", otp);
  console.log("===>", key);
  const value = myCache.set(key, otp, 90);
  return value;
};
const checkOTP = (key, otp) => {
  const value = myCache.get(key);
  console.log(value, "value");
  if (otp === value) {
    return true;
  } else {
    return false;
  }
};

const generateOTP = async () => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

module.exports = { sendEmail, checkOTP, generateOTP, cacheOTP };
