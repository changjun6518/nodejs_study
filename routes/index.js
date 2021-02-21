var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var db = require('../lib/db');
var auth = require('../lib/auth');
var db2 = require('../lib/db2');
const { Product } = require('../models');


router.get('/', function(request, response) { 
  // console.log("req", request.user);
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  // Product.findAll({}).then(pro=>{
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}`,
    `<p><a href="/post/create">create</a></p>`,
  auth.statusUI(request,response)
);
response.send(html);
  // })

  // var list = template.list(request.list);

  // var html = template.HTML(title, list,
  //       `<h2>${title}</h2>${description}`,
  //       `<p><a href="/post/create">create</a></p>`,
  //     auth.statusUI(request,response)

  // );
  // response.send(html);
  //  db.query(`SELECT * FROM post`, function(error, objects){
  //       var title = 'Welcome';
  //       var description = 'Hello, Node.js';
  //       var list = template.list(objects);
  //       var html = template.HTML(title, list,
  //             `<h2>${title}</h2>${description}`,
  //             `<p><a href="/post/create">create</a></p>`,
  //           auth.statusUI(request,response)

  //       );
  //       response.send(html)
  //     });
  });
  
  module.exports = router;