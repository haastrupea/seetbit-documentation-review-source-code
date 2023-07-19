const { privateKey, publicKey } = sails.config.custom.seerbit
module.exports = {


  friendlyName: 'Get auth token',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      outputFriendlyName: 'Auth token',
    },

  },


  fn: async function () {
    const apiCall = await sails.helpers.seerbitApiCall()
    // Get auth token.
    let authToken = await apiCall.post("/encrypt/keys", {
      key: `${privateKey}.${publicKey}`
    }).catch(error=>{
      if(error.response){
        sails.log("failed-to-get-token-api-error:",error.response.data)
      }else{
        sails.log("failed-to-get-token-internal-error:", error.message)
      }
      return null
    });
    // TODO

    if(authToken){
      return authToken.data.data.EncryptedSecKey
    }

    // Send back the result through the success exit.
    return {};

  }


};

