const BaseDTO = require('../src/dto').BaseDTO
const fields = require('../src/fields')

const fieldTypes = Object.keys(fields)

function valueForType (type) {
  return {
    generic: 'something',
    string: 'string',
    boolean: true,
    number: 1234.56,
    date: new Date('2015-09-26T16:35:12+00:00'),
    list: [],
    listWithDTO: [{ fieldInMapping: 'thing' }],
    objectWithDTO: { fieldInMapping: 'thing' }
  }[type]
}

function eachField (cb) {
  fieldTypes.forEach(function (k) {
    let field = fields[k]

    if (k.match(/WithDTO$/)) {
      class fieldDTO extends BaseDTO {
        constructor (data) {
          super(data, {
            fieldInMapping: fields.generic()
          })
        }
      }
      field = field.bind(null, fieldDTO)
    }

    cb(field, k)
  })
}

module.exports = {
  fieldTypes,
  valueForType,
  eachField
}
