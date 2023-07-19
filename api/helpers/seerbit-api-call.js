
const axios = require('axios');
const { apiUrl } = sails.config.custom.seerbit
const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  }
})
module.exports = {


  friendlyName: 'Seerbit api call',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function () {
    // TODO
    return instance
  }


};

