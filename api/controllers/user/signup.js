module.exports = {


  friendlyName: 'Signup',


  description: 'Signup user.',


  inputs: {
    firstName: {
      type: "string",
      description: "A user's first name.",
      required: true
    },

    lastName: {
      type: "string",
      description: "A user's last name.",
      example: "doe",
      required: true
    },
    email: {
      type: "string",
      description: "user email address",
      required: true,
      example: "email@gmail.com",
    },
    phoneNumber: {
      type: "string",
      description: "user phone number",
      required: true,
      example: "2340123456789",
    },
    bvn: {
      type: 'string',
      description: "A user's bank verification number",
      example: '22346779883',
      required: true
    },
  },


  exits: {

  },


  fn: async function (payload) {
    const userCreated = await User.create(payload).fetch()

    // All done.
    const success = await sails.helpers.successResponse.with({
      message: 'User registered successfully',
      data: { user: userCreated.id }
    });
    return success
  }


};
