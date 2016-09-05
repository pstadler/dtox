'use strict';

const BaseDTO = require('../lib/dto').BaseDTO;
const fields = require('../lib/fields');

var fieldTypes = Object.keys(fields);

function valueForType(type) {
  return {
    generic: 'something',
    string: 'string',
    boolean: true,
    number: 1234.56,
    date: new Date('2015-09-26T16:35:12+00:00'),
    list: [],
    listWithDTO: [{ fieldInMapping: 'thing' }],
    objectWithDTO: { fieldInMapping: 'thing' }
  }[type];
}

function eachField(cb) {
  fieldTypes.forEach(function(k) {
    var field = fields[k];

    if(k.match(/WithDTO$/)) {
      class fieldDTO extends BaseDTO {
        constructor(data) {
          super(data, {
            fieldInMapping: fields.generic()
          });
        }
      }
      field = field.bind(null, fieldDTO);
    }

    cb(field, k);
  });
}

module.exports = {
  fieldTypes: fieldTypes,
  valueForType: valueForType,
  eachField: eachField
};
