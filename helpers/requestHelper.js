const { FrError, ErrorCodes } = require('../error/frError');
const axios = require('axios');

class RequestHelper {
  constructor(token, _baseUrl) {
    if (process.env.KEEPLOGS == 1) {
      console.info('REQUEST INITIAL', token, _baseUrl);
    }

    this.baseUrl = _baseUrl;
    let service = axios.create({
      headers: {
        csrf: 'token',
        Authorization: token,
      },
    });
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  handleSuccess(response) {
    if (process.env.KEEPLOGS == 1) {
      console.info('SUCCESS REQUEST ', response.data);
    }
    return response;
  }

  handleError = (error) => {
    console.error('REQUEST ERROR ', error);

    throw new FrError({
      message: 'Error while making request.',
      code: ErrorCodes.RequestError,
      status: 500,
      context: {
        message: error,
      },
    });
  };

  get(path) {
    return new Promise((resolve, reject) => {
      resolve(
        this.service.get(this.baseUrl + path).then((response) => {
          return response.data;
        })
      );

      // .then((response) => callback(response.status, response.data));
    });
  }

  patch(path, payload, callback) {
    return this.service
      .request({
        method: 'PATCH',
        url: path,
        responseType: 'json',
        data: payload,
      })
      .then((response) => callback(response.status, response.data));
  }

  post(path, payload, callback) {
    return this.service
      .request({
        method: 'POST',
        url: path,
        responseType: 'json',
        data: payload,
      })
      .then((response) => callback(response.status, response.data));
  }
}

module.exports = RequestHelper;
