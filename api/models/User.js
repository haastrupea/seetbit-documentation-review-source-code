/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    firstName: {
      type: "string",
      description: "A user's first name.",
      example: "john",
    },

    lastName: {
      type: "string",
      description: "A user's last name.",
      example: "doe",
    },
    email: {
      type: "string",
      description: "user email address",
      unique: true,
      isEmail: true,
      required: true,
      example: "email@gmail.com",
    },
    phoneNumber: {
      type: "string",
      description: "user phone number",
      required: true,
      example: "2348123456789",
    },
    bvn: {
      type: 'string',
      description: "A user's bank verification number",
      example: '22346779883'
    },
    country: {
      type: 'string',
      description: 'user country',
      example: 'NG',
      defaultsTo: 'NG'
    },
    cardToken: {
      type: 'string',
      description: "token to charge user card subsequently"
    },
    cardTokenMetadata: {
      type: 'string',
      description: "token to charge user card metadata from seerbit"
    },

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    wallets: {
      collection: 'wallet',
      via: 'user'
    },

  },

};

