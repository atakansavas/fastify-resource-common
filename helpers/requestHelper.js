const frError = require('../error/frError');
const ErrorCodes = require('../error/errorCodes');
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

    throw new frError({
      message: error.response ? error.response.data.message : error.message,
      code: ErrorCodes.RequestError,
      status: error.response ? error.response.status : 502,
      context: {
        message: error.response ? error.response.data : error,
      },
    });
  };

  get(path) {
    if (process.env.KEEPLOGS == 1) {
      console.info('REQUEST => GET', this.baseUrl + path);
    }
    return new Promise((resolve, reject) => {
      resolve(
        this.service.get(this.baseUrl + path).then((response) => {
          return response.data;
        })
      );
    });
  }

  post(path, payload) {
    if (process.env.KEEPLOGS == 1) {
      console.info('REQUEST => POST', this.baseUrl + path, payload);
    }
    return new Promise((resolve, reject) => {
      resolve(
        this.service.post(this.baseUrl + path, payload).then((response) => {
          return response.data;
        })
      );
    });
  }

  put(path, payload) {
    if (process.env.KEEPLOGS == 1) {
      console.info('REQUEST => PUT', this.baseUrl + path, payload);
    }
    return new Promise((resolve, reject) => {
      resolve(
        this.service.put(this.baseUrl + path, payload).then((response) => {
          return response.data;
        })
      );
    });
  }
}

module.exports = RequestHelper;
