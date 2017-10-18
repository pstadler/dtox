const { BaseDTO, BaseListDTO, fields } = require('../src')

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

class UserListDTO extends BaseListDTO {
  constructor (data) {
    super(data, UserDTO)
  }
}

// API call
const request = require('request-promise')

request('http://jsonplaceholder.typicode.com/users', { json: true })
  .then(function (res) {
    const users = new UserListDTO(res)
    users.forEach(function (user) {
      console.log(user.id + ': ' + user.username)
    })
  })
  .catch(function (err) {
    console.error(err.stack)
  })
