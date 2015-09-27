'use strict';

// DTO definitions
var dtox = require('..')
  , fields = dtox.fields;

var USER_MAPPING = {
  id:       fields.number(),
  name:     fields.string(),
  username: fields.string(),
  email:    fields.string(),
  address:  fields.generic(),
  phone:    fields.string(),
  website:  fields.string(),
  company:  fields.generic()
};

var UserDTO = dtox.BaseDTO.inherit(USER_MAPPING);
var UserListDTO = dtox.BaseListDTO.inherit(UserDTO);

// API call
var request = require('request-promise');

request('http://jsonplaceholder.typicode.com/users', { json: true })
  .then(function(res) {
    var users = new UserListDTO(res);
    users.forEach(function(user) {
      console.log(user.id + ': ' + user.username);
    });
  })
  .catch(function(err) {
    console.error(err.stack);
  });