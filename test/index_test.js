var expect = require('chai').expect;
var Joi = require('joi').extend(require('../index.js'));

describe('date-within', function() {
  describe('withinDays', function() {

    it('should validate success', function() {
      expect(Joi.attempt(new Date(2016,3,31), Joi.date().withinDays(5, new Date(2016, 3, 27)))).to.be.true;
    });

    it('should fail', function() {
      expect(() => {
        Joi.attempt(new Date(2016,3,31), Joi.date().withinDays(5, new Date(2016, 3, 20)))
      }).to.throw('needs to be within 5 days of');
    });

    it('should allow a Joi.ref to be used as the from value', function() {
      var schema = Joi.object({
        from: Joi.date().required(),
        to: Joi.date().required().withinDays(10, Joi.ref('from'))
      });

      var input = {
        from: new Date(2016,3,1),
        to: new Date(2016,3,5)
      };

      expect(() => {
        Joi.attempt(input, schema)
      }).to.not.throw();

    });

    it('should allow a nested Joi.ref to be used', function() {
      var schema = Joi.object({
        to: Joi.date().required().withinDays(10, Joi.ref('somewhere.future')),
        somewhere: Joi.object({
          future: Joi.date().required()
        })
      });

      var input = {
        to: new Date(2016,3,30),
        somewhere: {
          future: new Date(2016,3,1)
        }
      };

      expect(() => {
        Joi.attempt(input, schema);
      }).to.throw('"to" needs to be within 10 days of');
    });
  });
});
