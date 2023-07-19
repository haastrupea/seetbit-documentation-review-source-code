const { publicKey, checkoutCallbackUrl: callbackUrl="" } = sails.config.custom.seerbit

module.exports = {


  friendlyName: 'Standard checkout',


  description: '',


  inputs: {

  },


  exits: {
    badRequest: {
      statusCode: 400,
      description: 'Invalid request detected'
    }
  },


  fn: async function ({amount, userId }) {

    const user  = await User.findOne({id: userId}).select(['firstName', 'lastName', 'bvn', 'country', 'email'])
  
    const errorResponse = await sails.helpers.errorResponse.with({
      message: 'Failed to initiate checkout'
    });
    if(!user) {
      sails.log("user not found for checkout")
      throw { badRequest: errorResponse}
    }

    const {  country, email } = user
    const apiCall = await sails.helpers.seerbitApiCall()
    const {encryptedKey ='' } = await sails.helpers.getAuthToken();
    const paymentReference = Date.now().toString()
    const payload = { publicKey, amount,"currency":"NGN", country,paymentReference,email, callbackUrl }
    const checkout = await apiCall.post('/payments', payload, {
      headers: { authorization: `Bearer ${encryptedKey}`}
    }).catch(error=>{
      if(error.response){
        sails.log("Seerbit-standard-checkout-api-error:", error.response.data)
      }else{
        sails.log("Seerbit-standard-checkout-internal-error:", error.message)
      }
      return null
    })

    if(!checkout) {
      // throw error
      throw { badRequest: errorResponse}
    }

    const checkoutRes = checkout.data

    const success = await sails.helpers.successResponse.with({
      message: "Checkout initiated successfully",
      data: checkoutRes.data.payments
    });
    // All done.
    return success;

  }


};
