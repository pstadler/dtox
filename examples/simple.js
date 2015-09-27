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

// API call
var request = require('request-promise');

request('http://jsonplaceholder.typicode.com/users/1', { json: true })
  .then(function(res) {
    var user = new UserDTO(res);
    console.log(user.name);
  })
  .catch(function(err) {
    console.error(err.stack);
  });