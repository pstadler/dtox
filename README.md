# dtox [![Build Status](https://img.shields.io/travis/pstadler/dtox/master.svg?style=flat-square)](https://travis-ci.org/pstadler/dtox) [![Build Status](https://img.shields.io/coveralls/pstadler/dtox/master.svg?style=flat-square)](https://coveralls.io/github/pstadler/dtox?branch=master)

Lightweight, extensible data transfer object (DTO) library for Node.js and browser environments.

## Install

```bash
$ npm install dtox --save
```

## Usage

```js
const { BaseDTO, BaseListDTO, fields } = require('dtox')

// Define user mapping
const USER_MAPPING = {
  id:          fields.number(),
  name:        fields.string(),
  validated:   fields.boolean({ default: false }),
  roles:       fields.list({ default: [], key: 'groups' }),
  hasRoles:    fields.generic({ callback: (data) => {
    return data.groups.length > 0;
  }}),
  dateCreated: fields.date()
};

// Define a DTO which represents a single user
class UserDTO extends BaseDTO {
  constructor(data) {
    super(data, USER_MAPPING);
  }
}

const user = new UserDTO({
  id: 123,
  name: 'john_doe',
  validated: true,
  groups: ['administrator'],
  dateCreated: '1997-07-16T19:20:30Z'
});

console.log('Hello ' + user.name); // "Hello john_doe"
console.log('User ' + user.hasRoles ? 'has roles' : 'has no roles'); // "User has roles"

// Define a DTO which represents a list of users
class UserListDTO extends BaseListDTO {
  constructor(data) {
    super(data, UserDTO);
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
]);

const userNames = users.map((user) => {
  return user.name;
});

console.log(userNames.join(', ')); // "john_doe, jane_doe"

// or also possible:
for (const userName of users) {
  console.log(userName);
}

console.log(JSON.stringify(users)); // will print the items in JSON form
```
