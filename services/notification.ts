const axios = require("axios");
import { Resend } from 'resend';
import config from '../config/configSetup';
import { Redis } from './redis';
var admin = require("firebase-admin");
const { getMessaging } = require('firebase-admin/messaging');
const serviceAccount = require("../keys/key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});




export const sendEmail = async (email: String, subject: String, template: String) => {
  const response = await axios.post(
    `https://api.brevo.com/v3/smtp/email`,
    {
      "sender": {
        "name": "Eizy App",
        "email": "support@eizyapp.com"
      },
      "to": [
        {
          "email": email,
          "name": "User"
        }
      ],
      subject: `${subject}`,
      "htmlContent": `${template}`
    },
    {
      headers: {
        "api-key": config.BREVO,
        "accept": "application/json",
        'Content-Type': ['application/json', 'application/json']
      }
    }
  );

  if (response.status <= 300) {
    return {
      status: true,
      message: response.data,
    }
  } else {
    return {
      status: false,
      message: response.data,
    };
  }
}




export const sendFcmNotification = async (title: string,
  data: any, token: string) => {
  const message = {
    notification: {
      title: "Eisy Payment",
      body: title,
    },
    data: { data: JSON.stringify(data) },
    token: token,
  };
  try {
    // Send a message to the device corresponding to the provided
    // registration token.
    const response = await getMessaging().send(message)
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
    return {
      status: true,
      message: response,
    }
  } catch (e) {
    console.log('Error sending message:', e);
    return {
      status: false,
      message: e,
    };
  }

}

