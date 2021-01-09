const settingSchema = {
  settingSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['from', 'to', 'multipler', 'duration'],
    properties: {
      from: {
        type: 'number',
      },
      to: {
        type: 'number',
      },
      multipler: {
        type: 'number',
      },
      duration: {
        type: 'number',
      },
    },
  },
};

module.exports = settingSchema;
