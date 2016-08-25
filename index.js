'use strict';

var joi = require('joi');
var hoek = require('hoek');
var dayms = 86400000;

const withinDaysRule = {
  name: 'withinDays',
  params: {
    days: joi.number().min(0),
    from: joi.any()
  },
  validate: function(params, value, state, options) {
    var from = params.from;

    // If 'from' is a ref get the actual value.
    if(joi.isRef(params.from)) {
      from = hoek.reach(state.parent, params.from.key)
    }

    return (((value - from) /dayms) > params.days) ? this.createError('date.withinDays', { v: value, days: params.days, from: from }, state, options) : true;
  }
};

const rules = [].concat([withinDaysRule]);

const extension = {
  base: joi.date(),
  name: 'date',
  language: {
    withinDays: 'needs to be within {{days}} days of {{from}}'
  },
  rules: rules
};

module.exports = extension
