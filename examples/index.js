'use strict';

var dtox = require('..')
  , fields = dtox.fields;

// Define user mapping
var USER_MAPPING = {
  id:          fields.number(),
  name:        fields.string(),
  roles:       fields.list({ default: [], key: 'groups' }),
  validated:   fields.boolean({ default: false }),
  dateCreated: fields.date()
};

// Define a DTO which represents a single user
var UserDTO = dtox.BaseDTO.inherit(USER_MAPPING);

var user = new UserDTO({
  id: 123,
  name: 'john_doe',
  groups: ['administrator'],
  validated: true,
  dateCreated: '1997-07-16T19:20:30Z'
});

console.log('Hello ' + user.name); // "Hello john_doe"

// Define a DTO which represents a list of users
var UserListDTO = dtox.BaseListDTO.inherit(UserDTO);

var users = new UserListDTO([
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
]);

var userNames = users.map(function(u) {
  return u.name;
});

console.log(userNames.join(', ')); // "john_doe, jane_doe"
