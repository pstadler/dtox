const { BaseDTO, BaseListDTO, fields } = require('../src')

// Define user mapping
const USER_MAPPING = {
  id: fields.number(),
  name: fields.string(),
  roles: fields.list({ default: [], key: 'groups' }),
  validated: fields.boolean({ default: false }),
  dateCreated: fields.date()
}

// Define a DTO which represents a single user
class UserDTO extends BaseDTO {
  constructor (data) {
    super(data, USER_MAPPING)
  }
}

const user = new UserDTO({
  id: 123,
  name: 'john_doe',
  groups: ['administrator'],
  validated: true,
  dateCreated: '1997-07-16T19:20:30Z'
})

console.log('Hello ' + user.name) // "Hello john_doe"

// Define a DTO which represents a list of users
class UserListDTO extends BaseListDTO {
  constructor (data) {
    super(data, UserDTO)
  }
}

const users = new UserListDTO([
  {
    id: 123,
    name: 'john_doe',
    groups: ['owner'],
    validated: true,
    dateCreated: '1997-07-16T19:20:30Z'
  },
  {
    id: 124,
    name: 'jane_doe',
    groups: ['administrator'],
    validated: false,
    dateCreated: '2015-12-15T07:36:25Z'
  }
])

const userNames = users.map(function (u) {
  return u.name
})

console.log(userNames.join(', ')) // "john_doe, jane_doe"

// or also possible:
for (const userName of users) {
  console.log(userName)
}

console.log(JSON.stringify(users)) // will print the items in JSON form
