const { publicKey } = sails.config.custom.seerbit

module.exports = {


  friendlyName: 'Create virtual account',


  description: '',


  inputs: {
    userid: {
      type: 'string',
      description: "User id to create virtual account for",
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function ({ userid }) {
    // TODO
    const user  = await User.findOne({id: userid}).select(['firstName', 'lastName', 'bvn', 'country', 'email'])

    if(!user){
      sails.log("Can not create Virtual account for user that does not exist")
      return null
    }
    const { firstName, lastName, bvn, country, email} = user
    const payload = {
      publicKey: publicKey,
      fullName: `${lastName} ${lastName}`,
      reference: `seerbit-${firstName}-${lastName}`, email,
      country,bankVerificationNumber: bvn,
      currency: "NGN",
  }

      const apiCall = await sails.helpers.seerbitApiCall()
      const {encryptedKey ='' } = await sails.helpers.getAuthToken()
      const virtualAccount = await apiCall.post('/virtual-accounts/', payload, {
        headers: { authorization: `Bearer ${encryptedKey}`}
      }).catch(error=>{
        if(error.response){
          sails.log("Seerbit-virtual-account-creation-api-error:", error.response.data)
        }else{
          sails.log("Seerbit-virtual-account-creation-internal-error:", error.message)
        }
        return null
      })

      if(!virtualAccount){  return virtualAccount }

      // create wallet
      const virtualAccountData = virtualAccount.data
      const { walletName,wallet: walletId, reference, } = virtualAccountData.data.payments
      await Wallet.create({ vaMetaData: JSON.stringify(virtualAccountData), walletName,reference,walletId })
      sails.log("Wallet created successfully for", payload)

      return virtualAccountData.data.payments

  }


};

