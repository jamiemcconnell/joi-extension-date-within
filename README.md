#Joi Extension Within Date

[![Build Status](https://travis-ci.org/jamiemcconnell/joi-extension-date-within.svg?branch=master)](https://travis-ci.org/jamiemcconnell/joi-extension-date-within)
[![Coverage Status](https://coveralls.io/repos/github/jamiemcconnell/joi-extension-date-within/badge.svg?branch=coveralls)](https://coveralls.io/github/jamiemcconnell/joi-extension-date-within?branch=coveralls)
[![dependencies Status](https://david-dm.org/jamiemcconnell/joi-extension-date-within/status.svg)](https://david-dm.org/jamiemcconnell/joi-extension-date-within)

An extension to Joi to enable checking that a date is within a number of days of another date property.

In the below example we are confirming that `to` is within `10` days of `from`

```javascript
var Joi = require('joi').extend(require('joi-extension-date-within'));

var schema = Joi.object({
  from: Joi.date().required(),
  to: Joi.dateWithin().required().days(10, Joi.ref('from'))
});

var input = {
  from: new Date(2016,3,1),
  to: new Date(2016,3,30)
};

Joi.assert(input, schema)
```
