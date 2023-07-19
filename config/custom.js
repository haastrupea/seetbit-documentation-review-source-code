/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // sendgridSecret: 'SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …
  seerbit: {
    publicKey: process.env.SEERBIT_PUBLIC_KEY || '',
    privateKey: process.env.SEERBIT_SECRET_KEY || '',
    apiUrl: process.env.SEERBIT_API_URL || 'https://seerbitapi.com/api/v2',
    checkoutCallbackUrl: process.env.SEERBIT_CHECKOUT_CALLBACK_URL
  }
};
