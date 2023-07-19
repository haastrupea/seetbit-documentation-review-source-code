module.exports = {


  friendlyName: 'Fetch',


  description: 'Fetch wallet.',


  inputs: {
    userId: {
      type: 'string',
      description: ' user to create va for',
      required: true
    }
  },


  exits: {
    badRequest: {
      statusCode: 400,
      description: 'Invalid request detected'
    }
  },


  fn: async function ({ userId }) {

    const wallet = await Wallet.findOne({user: userId}).select(['reference', 'balance'])

    if(!wallet) {
      // throw error wallet already exist
      sails.log("No wallet found for:", userId)
      const errorResponse = await sails.helpers.errorResponse.with({
        message: 'Failed to fetch wallet'
      });
      throw { badRequest: errorResponse}
    }

    const apiCall = await sails.helpers.seerbitApiCall()
    const {encryptedKey ='' } = await sails.helpers.getAuthToken();

    const reference = wallet.reference;
    const fetchVa = await apiCall.get(`/virtual-accounts/${reference}`, {
      headers: { authorization: `Bearer ${encryptedKey}`}
    }).catch(error=>{
      if(error.response){
        sails.log("Seerbit-virtual-account-creation-api-error:", error.response.data)
      }else{
        sails.log("Seerbit-virtual-account-creation-internal-error:", error.message)
      }
      return null
    })

    if(!fetchVa){
      // throw error
      const errorResponse = await sails.helpers.errorResponse.with({
        message: 'Failed to fetch wallet details'
      });
      throw { badRequest: errorResponse}
    }

    const fetchData = fetchVa.data;

    const { payment } = fetchData.data

    const walletData = {...payment, balance: wallet.balance }

    const success = await sails.helpers.successResponse.with({
      message: "Wallet Fetched successfully",
      data: walletData
    });
    // All done.
    return success;

  }


};
