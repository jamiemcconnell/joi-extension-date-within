'use strict';

var Joi = require('joi');
var hoek = require('hoek');
const dayms = 86400000;

module.exports = {
  name: 'dateWithin',
  base: Joi.any(),
  language: {
    days: 'must be within {{days}} days of {{from}}',
    daysRefError: 'invalid Joi.ref in schema'
  },
  coerce(value, state, options) {
    if(typeof this._from === 'undefined') {
      this._from = new Date();
    }

    // If 'from' is a ref get the actual value.
    if(Joi.isRef(this._from)) {
      this._from = hoek.reach(state.parent, this._from.key);

      if(typeof this._from === 'undefined') {
        return this.createError('dateWithin.daysRefError', {}, state, options);
      }
    }

    return (Math.ceil((value - this._from) /dayms) > this._days) ? this.createError('dateWithin.days', { v: value, days: this._days, from: this._from }, state, options) : true;

  },
  rules: [
    {
      name: 'days',
      description(params) {
        return `Date should with within ${params.days} of ${params.from}`;
      },
      params: {
        days: Joi.number().min(0).required(),
        from: Joi.any().default(undefined) // allows for a ref or date - being lazy!
      },
      setup(params) {
        this._days = params.days;
        this._from = params.from;
      },
      validate(params, value, state, options) {
        // No-op just to enable description
        return value;
      }
    }
  ]
};
