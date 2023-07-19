const { publicKey } = sails.config.custom.seerbit
const inputValidation = {
  type: 'string',
  required: true,
  description: " input required to charge user card successfully"
}
module.exports = {


  friendlyName: 'charge card with token',


  description: '',


  inputs: {
    amount: inputValidation, 
    userId: inputValidation,
    paymentReference: inputValidation
  },


  exits: {

  },


  fn: async function ({amount, userId, paymentReference }) {

    const user  = await User.findOne({id: userId}).select(['cardToken'])

    if(!user || !user.cardToken) {
      sails.log("user not found for checkout")
      return null
    }
 
    const requestOptions = {
      headers: { authorization: `Bearer ${encryptedKey}`}
    }

    //charge card

    const chargePayload = { publicKey, amount,paymentReference,authorizationCode: user.cardToken }

    const chargeCard = await apiCall.post('/payments/charge-token', chargePayload, requestOptions).catch(error=>{
      if(error.response){
        sails.log("Seerbit-create-card-token-api-error:", error.response.data)
      }else{
        sails.log("Seerbit-create-card-token-internal-error:", error.message)
      }
      return null
    })

    if(!chargeCard) {
      return null
    }

    // All done.
    return chargeCard.data;

  }


};
