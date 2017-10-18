const { BaseDTO, fields } = require('../src')

const USER_MAPPING = {
  id: fields.number(),
  name: fields.string(),
  username: fields.string(),
  email: fields.string(),
  address: fields.generic(),
  phone: fields.string(),
  website: fields.string(),
  company: fields.generic()
}

class UserDTO extends BaseDTO {
  constructor (data) {
    super(data, USER_MAPPING)
  }
}

// API call
const request = require('request-promise')

request('http://jsonplaceholder.typicode.com/users/1', { json: true })
  .then(function (res) {
    const user = new UserDTO(res)
    console.log(user.name)
  })
  .catch(function (err) {
    console.error(err.stack)
  })
