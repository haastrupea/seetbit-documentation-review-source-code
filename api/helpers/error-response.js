module.exports = {


  friendlyName: 'Error response',


  description: '',


  inputs: {
    message:{
      type: 'string',
      description: 'error message'
    },
    error: {
      type: 'ref',
      description: 'error object'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const response = {
      success: false,
      message: inputs.message || 'You messed up real bad'
    };

    if(inputs.error){
      response.data = {};
      response.data.errors = inputs.error;
    }

    return response;
  }


};

