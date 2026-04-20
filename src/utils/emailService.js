import emailjs from '@emailjs/browser';

// Replace these constants with your actual EmailJS credentials
// You can get them from https://dashboard.emailjs.com/
const EMAILJS_SERVICE_ID = 'service_yncylhx';
const EMAILJS_TEMPLATE_ID = 'template_2nmselt';
const EMAILJS_CHECKOUT_TEMPLATE_ID = 'template_jz4qhx9'; // Replace this!
const EMAILJS_PUBLIC_KEY = 'BDWpZyxvauKCvNyWv';

/**
 * Sends a notification email to the admin when a new user registers.
 * Requires the following variables in your EmailJS template:
 * - {{title}}
 * - {{name}}
 * - {{email}}
 */

export const notifyAdminNewUser = async (userConfig) => {
  try {
    const templateParams = {
      title: 'New Account Registration',
      name: userConfig.username,
      email: userConfig.email || 'No email provided',
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log('EmailJS Success:', response.status, response.text);
    return true;
  } catch (err) {
    console.error('EmailJS Error:', err);
    return false;
  }
};


/**
 * Sends a checkout notification email.
 * Requires the following variables in your new EmailJS template:
 * - {{user_email}}
 * - {{cart_total}}
 * - {{order_time}}
 */
export const notifyAdminCheckout = async (userConfig, cartTotal) => {
  try {
    const templateParams = {
      title: `Order from ${userConfig.username || 'User'}`,
      name: userConfig.username || 'Customer',
      email: userConfig.email || 'No email provided',
      total: cartTotal.toFixed(2),
      order_time: new Date().toLocaleString()
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_CHECKOUT_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log('Checkout EmailJS Success:', response.status, response.text);
    return true;
  } catch (err) {
    console.error('Checkout EmailJS Error:', err);
    return false;
  }
};
