const axios = require('axios');
const config = require('./config');

class APIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'APIError';
  }
}

const dcapi = axios.create({
  baseURL: `https://dragcave.net/api/${config.APIKey}/json`,
});

async function getDragonsByCode(codes) {
  try {
    const response = await dcapi.post(
      `/massview`,
      {
        ids: codes.join(','),
      },
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    const responseData = response.data;

    if (responseData.errors.length > 0)
      throw new APIError('Error in response.');

    return responseData.dragons ?? {};
  } catch (err) {
    // catch the axios exception and fire our own
    throw new APIError(`Unexpected response from Dragcave API.`);
  }
}

module.exports = {
  getDragonsByCode,
  APIError,
};
