# dtox [![Build Status](https://img.shields.io/travis/pstadler/dtox/master.svg?style=flat-square)](https://travis-ci.org/pstadler/dtox) [![Build Status](https://img.shields.io/coveralls/pstadler/dtox/master.svg?style=flat-square)](https://coveralls.io/github/pstadler/dtox?branch=master)

Lightweight, extensible data transfer object (DTO) library for Node.js and browser environments.

Please note that this library is currently not running on Node.js >= 5.x due to compatibility issues with the new class inheritance model.

## Install

```bash
$ npm install dtox --save
```

## Usage

```js
var dtox = require('dtox')
  , fields = dtox.fields;

// Define user mapping
var USER_MAPPING = {
  id:          fields.number(),
  name:        fields.string(),
  validated:   fields.boolean({ default: false }),
  roles:       fields.list({ default: [], key: 'groups' }),
  numGroups:   fields.generic({ callback: function(data) {
    return data.groups.length;
  }}),
  dateCreated: fields.date()
};

// Define a DTO which represents a single user
var UserDTO = dtox.BaseDTO.inherit(USER_MAPPING);

var user = new UserDTO({
  id: 123,
  name: 'john_doe',
  validated: true,
  groups: ['administrator'],
  dateCreated: '1997-07-16T19:20:30Z'
});

console.log('Hello ' + user.name); // "Hello john_doe"

console.log('You have ' + user.numGroups + ' group(s) assigned.'); // "You have 1 group(s) assigned"

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

var userNames = users.map(function(user) {
  return user.name;
});

console.log(userNames.join(', ')); // "john_doe, jane_doe"
```
