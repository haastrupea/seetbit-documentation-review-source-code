module.exports = async function badRequest(data) {
  let status = 400, errorResponse, paramErrorResponse, errors = [];

  if (data.code && data.code === 'E_MISSING_OR_INVALID_PARAMS'){
    data.problems.forEach(problem => {
      const split_problem = problem.split(',');
      const field_key = split_problem[0].split('"');

      if(field_key[0].includes('Invalid')){
        paramErrorResponse = {
          'field': field_key[1],
          'message': `${field_key[1]+' field is required.'}`
        };
      }else{
        paramErrorResponse = {
          'field': field_key[1],
          'message': split_problem[0].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
        };
      }

      errors.push(paramErrorResponse);
    });

    errorResponse = await sails.helpers.errorResponse.with({
      message: 'Missing required field',
      error: errors
    });
    return this.res.status(status).json(errorResponse);
  }

  errorResponse = await sails.helpers.errorResponse.with({
    message: 'Bad request, try again later.'
  });
  return this.res.status(status).json(errorResponse);
};
