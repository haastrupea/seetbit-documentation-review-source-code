const { publicKey, checkoutCallbackUrl: redirectUrl="" } = sails.config.custom.seerbit
const inputValidation = {
  type: 'string',
  required: true,
  description: " input required to charge user card successfully"
}

const optinalinputValidation = {
  type: 'string',
  description: " input required to charge user card successfully"
}
module.exports = {


  friendlyName: 'paywith-card-token',


  description: '',


  inputs: {
    amount: inputValidation, 
    userId: inputValidation, 
    cardNumber: optinalinputValidation, 
    expiryMonth: optinalinputValidation, 
    expiryYear: optinalinputValidation, 
    cvv: optinalinputValidation, 
    pin: optinalinputValidation
  },


  exits: {
    badRequest: {
      statusCode: 400,
      description: 'Invalid request detected'
    }
  },


  fn: async function ({amount, userId, ...cardDetails}) {

    const user  = await User.findOne({id: userId}).select(['firstName', 'lastName', 'bvn', 'country', 'email', 'phoneNumber', 'cardToken'])
  
    const errorResponse = await sails.helpers.errorResponse.with({
      message: 'Failed to charge card'
    });
    if(!user) {
      sails.log("user not found to start card tokenization")
      throw { badRequest: errorResponse}
    }

    const {  country, email,firstName, lastName, phoneNumber: mobileNumber} = user
    const apiCall = await sails.helpers.seerbitApiCall()
    const requestOptions = {
      headers: { authorization: `Bearer ${encryptedKey}`}
    }
    const {encryptedKey ='' } = await sails.helpers.getAuthToken();
    const paymentReference = Date.now().toString()

    if(!_.isEmpty(cardDetails)){
      const fullName = `${lastName} ${firstName}`
      const payload = {publicKey, amount,
        country, paymentReference, email, cardNumber, expiryMonth, expiryYear, cvv, pin, mobileNumber, redirectUrl, fullName,
        "currency": "NGN",
        "paymentType": "CARD",
    }
      const createCardToken = await apiCall.post('/payments/create-token', payload, requestOptions).catch(error=>{
        if(error.response){
          sails.log("Seerbit-create-card-token-api-error:", error.response.data)
        }else{
          sails.log("Seerbit-create-card-token-internal-error:", error.message)
        }
        return null
      })
  
      if(!createCardToken) {
        // throw error
        throw { badRequest: errorResponse}
      }

      // get token
      const getToken = await apiCall.get(`/payments/query/${paymentReference}`, requestOptions).catch(error=>{
        if(error.response){
          sails.log("Seerbit-create-card-token-api-error:", error.response.data)
        }else{
          sails.log("Seerbit-create-card-token-internal-error:", error.message)
        }
        return null
      })
  
      if(!getToken) {
        sails.log('failed to fetch token for card token from seerbit')
        // throw error
        throw { badRequest: errorResponse}
      }
  
      const getTokenRes = getToken.data
      const authorizationCode = getTokenRes.data.payments.authorizationCode
  
      await User.update({id: user.id}).set({
        cardToken: authorizationCode,
        cardTokenMetadata: JSON.stringify(getTokenRes)
      })// save payment reference

    }



    //charge card
    const chargeCard =  await sails.helpers.chargeCardToken(amount, userId, paymentReference)
    if(!chargeCard) {
      throw { badRequest: errorResponse}
    }

    const chargedSuccessRes = chargeCard.data
    const success = await sails.helpers.successResponse.with({ message: "Card Charged successfully", data: chargedSuccessRes.payments });
    // All done.
    return success;

  }


};
