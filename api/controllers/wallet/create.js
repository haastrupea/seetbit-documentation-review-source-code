module.exports = {


  friendlyName: 'Create',


  description: 'Create wallet.',


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
    const userExist = await User.count({id: userId})
    if(!userExist) {
      sails.log("user not exist for:", userId)
      const errorResponse = await sails.helpers.errorResponse.with({
        message: 'Failed to create wallet'
      });
      throw { badRequest: errorResponse}
    }

    const walletExist = await Wallet.count({user: userId})
    if(walletExist) {
      // throw error wallet already exist
      sails.log("wallet already exist for:", userId)
      const errorResponse = await sails.helpers.errorResponse.with({
        message: 'Wallet already exists'
      });
      throw { badRequest: errorResponse}
    }
    if(!walletExist) {
      const vaCreated = await sails.helpers.createVirtualAccount(userId);

      if(!vaCreated){
        // throw error that Va creation failed
        const errorResponse = await sails.helpers.errorResponse.with({
          message: 'Failed to create wallet'
        });
        throw { badRequest: errorResponse}
      }
    }

    const success = await sails.helpers.successResponse.with({
      message: "Wallet created successfully"
    });

    return success;

  }


};
