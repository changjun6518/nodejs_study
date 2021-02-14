var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./template.js');
var db = require('./db');
const { runInContext } = require('vm');
const { Router } = require('express');




exports.home = function(request, response){
    db.query(`SELECT * FROM post`, function(error, objects){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(objects);
        var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<p><a href="/create">create</a></p>`
        );
        response.writeHead(200);
        response.end(html);
      });
}

exports.page = function(request, response){
    
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query(`SELECT * FROM post`, function(error, objects){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM post WHERE id=?`,[queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(objects);
          var html = template.HTML(title, list,
                `<h2>제목 : ${title}</h2>
                내용 : ${description}
                <p>작성자 : ${topic[0].name}</p>`,
                `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
                </form>`
          );
          response.writeHead(200);
          response.end(html);
          })
        });
}
    

exports.create = function(request, response){
    db.query(`SELECT * FROM post`, function(error, objects){
        var title = 'Create';
        var list = template.list(objects);
        var html = template.HTML(title, list,
              `<form action="/create_process" method="post">
              <p><input type="text" name="name" placeholder="name"></p>
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
          `,
              `<a href="/create">create</a>`
        );
      response.writeHead(200);
      response.end(html);
    });
}

exports.create_process = function(request,response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var name = post.name;
          var title = post.title;
          var description = post.description;
          db.query(`INSERT INTO post (name, title, description)
          VALUES(?,?,?)`,
          [post.name, post.title, post.description],
          function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end();
          }
          )
      });
}

exports.update = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM post`, function(error, objects){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM post WHERE id=?`,[queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
          var list = template.list(objects);
          var html = template.HTML(topic[0].title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
              <p>
                <textarea name="description" placeholder="description">${topic[0].description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`);
            response.writeHead(200);
            response.end(html);
          });
    });
}

exports.update_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`UPDATE post SET title=?,description=? WHERE id=?`,[post.title, post.description, post.id],function(error,result){
              response.writeHead(302, {Location: `/?id=${post.id}`});
              response.end();
            })
      });
}

exports.delete = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`DELETE FROM post WHERE id=?`, [post.id], function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
}