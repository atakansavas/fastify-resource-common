const Ajv = require('ajv')

const ajv = new Ajv()

const validator = {
  validateBodyBySchema: (body, schema) => {
    let valid = ajv.validate(schema, body)
    return {
      'valid': valid,
      'ajv': ajv
    }
  },
  validateObjectId: (id) => {
    try {
      return true
    } catch (err) {
      return false
    }
  }
}

module.exports = validator