'use strict';

/* jshint expr:true */

var expect = require('chai').expect;
var Joi = require('joi').extend(require('../index'));

describe('date-within', function() {
  describe('days', function() {

    it('should validate success [89 days]', function() {
      expect(Joi.attempt(new Date(2015,2,31), Joi.date().withinDays(90, new Date(2015,0,1)))).to.be.true;
    });

    it('should validate success [90 days]', function() {
      expect(Joi.attempt(new Date(2015,3,1), Joi.date().withinDays(90, new Date(2015,0,1)))).to.be.true;
    });

    it('should fail [91 days]', function() {
      expect(() => {
        Joi.attempt(new Date(2015,3,2), Joi.date().withinDays(90, new Date(2015,0,1)));
      }).to.throw('must be within 90 days of');
    });

    it('should allow a Joi.ref to be used as the from value', function() {
      var schema = Joi.object({
        to: Joi.date().required().withinDays(90, Joi.ref('from')),
        from: Joi.date().required()
      });

      var input = {
        from: new Date(2015,0,1),
        to: new Date(2015,3,1)
      };

      expect(() => {
        Joi.attempt(input, schema);
      }).to.not.throw();

    });

    it('should allow a nested Joi.ref to be used', function() {
      var schema = Joi.object({
        to: Joi.date().required().withinDays(90, Joi.ref('somewhere.past')),
        somewhere: Joi.object({
          past: Joi.date().required()
        })
      });

      var input = {
        to: new Date(2015,3,2),
        somewhere: {
          past: new Date(2015,0,1)
        }
      };

      expect(() => {
        Joi.attempt(input, schema);
      }).to.throw('"to" must be within 90 days of');
    });

    it('should fail if the joi.ref is invalid', function() {
      var schema = Joi.object({
        to: Joi.date().required().withinDays(90, Joi.ref('idontexist')),
        from: Joi.date().required()
      });

      var input = {
        to: new Date(2015,3,2),
        from: new Date(2015,0,1)
      };

      expect(() => {
        Joi.attempt(input, schema);
      }).to.throw('invalid Joi.ref in schema');

    });

    it('should use date.now as the from if from is omitted', function() {
      expect(() => {
        // Now + 11 days.
        Joi.attempt(new Date().valueOf() + (86400000 * 11), Joi.date().withinDays(10));
      }).to.throw('\"value\" must be within 10 days of');
    });
  });
});
