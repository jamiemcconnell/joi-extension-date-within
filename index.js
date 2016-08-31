'use strict';

var joi = require('joi');
var hoek = require('hoek');
const dayms = 86400000;

const withinDaysRule = {
  name: 'withinDays',
  params: {
    days: joi.number().min(0),
    from: joi.any()
  },
  validate: function(params, value, state, options) {
    var from = params.from;

    if(typeof from === 'undefined') {
      from = new Date();
    }

    // If 'from' is a ref get the actual value.
    if(joi.isRef(params.from)) {
      from = hoek.reach(state.parent, params.from.key);

      if(typeof from === 'undefined') {
        return this.createError('date.withinDaysRefError', {}, state, options);
      }
    }

    return (Math.ceil((value - from) /dayms) > params.days) ? this.createError('date.withinDays', { v: value, days: params.days, from: from }, state, options) : true;
  }
};

const rules = [].concat([withinDaysRule]);

const extension = {
  base: joi.date(),
  name: 'date',
  language: {
    withinDays: 'must be within {{days}} days of {{from}}',
    withinDaysRefError: 'invalid Joi.ref in schema'
  },
  rules: rules
};

module.exports = extension;
