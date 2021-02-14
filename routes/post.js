var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var db = require('../lib/db');
var qs = require('querystring');
var path = require('path');
var auth = require('../lib/auth');
var db2 = require('../lib/db2');
var shortid = require('shortid');




router.get('/create', function(request, response) { 
  if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  }
  var title = 'Create';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
        `<form action="/post/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `,
        `<a href="/post/create">create</a>`,
        auth.statusUI(request,response)
    );
    response.send(html);
});

router.post('/create_process', function(request, response) { 
  if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  }
    var post = request.body;
    var id= shortid.generate();

    db2.get('topics').push({
      id: id,
      title: post.title,
      description: post.description,
      user_id: request.user.id
    }).write();
    response.redirect(`/post/${id}`);
    // db.query(`INSERT INTO post (name, title, description)
    // VALUES(?,?,?)`,
    // [post.name, post.title, post.description],
    // function(error, result){
    //   if(error){
    //     throw error;
    //   }
    // response.redirect(`/post/${result.insertId}`);
    // });
});

router.get('/update/:pageId', function(request, response){
  if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  }
  var topic = db2.get('topics').find({id:request.params.pageId}).value();
  if(topic.user_id !== request.user.id){
    return response.redirect('/');
  }
  var title = topic.title;
  var description = topic.description;
  var list = template.list(request.list);
  var html = template.HTML(title, list,
        `
        <form action="/post/update_process" method="post">
          <input type="hidden" name="id" value="${topic.id}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/post/create">create</a> <a href="/post/update/${topic.id}">update</a>`,
        auth.statusUI(request,response));
        response.send(html);

    // var filteredId = path.parse(request.params.pageId).base;
    // db.query(`SELECT * FROM post`, function(error, objects){
    //     if(error){
    //       throw error;
    //     } 
    //     db.query(`SELECT * FROM post WHERE id=?`,[filteredId], function(error2, posts){
    //       if(error2){
    //         throw error2;
    //       }
    //       var list = template.list(objects);
    //       var html = template.HTML(posts[0].title, list,
    //         `
    //         <form action="/post/update_process" method="post">
    //           <input type="hidden" name="id" value="${posts[0].id}">
    //           <p><input type="text" name="title" placeholder="title" value="${posts[0].title}"></p>
    //           <p>
    //             <textarea name="description" placeholder="description">${posts[0].description}</textarea>
    //           </p>
    //           <p>
    //             <input type="submit">
    //           </p>
    //         </form>
    //         `,
    //         `<a href="/post/create">create</a> <a href="/post/update/${posts[0].id}">update</a>`,
    //         auth.statusUI(request,response));
    //         response.send(html);
    //       });
    // });
})

router.post('/update_process', function(request, response){
  if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  }
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  var topic = db2.get('topics').find({id:id}).value();
  console.log(topic);
  if(topic.user_id !== request.user.id){
    return response.redirect('/');
  }
  
  db2.get('topics').find({id:id}).assign({
    title:title, description:description
  }).write();

response.redirect(`/post/${topic.id}`);
    // var post = request.body;
    // db.query(`UPDATE post SET title=?,description=? WHERE id=?`,[post.title, post.description, post.id],function(error,result){
    //     response.redirect(`/post/${post.id}`);
    //   })
})


router.post('/delete_process', function(request, response){
  if(!auth.isOwner(request,response)){
    response.redirect('/');
    return false;
  }
  var post = request.body;
  var id = post.id;
  var topic = db2.get('topics').find({id:id}).value();
  if(topic.user_id !== request.user.id){
    return response.redirect('/');
  }

  db2.get('topics').remove({id:id}).write();
  response.redirect('/');



  // var post = request.body;
  // db.query(`DELETE FROM post WHERE id=?`, [post.id], function(error, result){
  //   if(error){
  //     throw error;
  //   }
  //   response.redirect(`/`);
  // })
});

// mysql...
// router.get('/:pageId', (request, response) =>{ 
//   var filteredId = path.parse(request.params.pageId).base;


//   db.query(`SELECT * FROM post`, function(error, objects){
//       if(error){
//         throw error;
//       }
//       db.query(`SELECT * FROM post WHERE id=?`,[filteredId], function(error2, post){
//         if(error2){
//           throw error2;
//         }
//         var title = post[0].title;
//         var description = post[0].description;
//         var list = template.list(objects);
//         var html = template.HTML(title, list,
//               `<h2>제목 : ${title}</h2>
//               내용 : ${description}
//               <p>작성자 : ${post[0].name}</p>`,
//               `<a href="/post/create">create</a>
//               <a href="/post/update/${filteredId}">update</a>
//               <form action="/post/delete_process" method="post">
//               <input type="hidden" name="id" value="${filteredId}">
//               <input type="submit" value="delete">
//               </form>`,auth.statusUI(request,response)
//         );
        
//         response.send(html);
//         })
//       });
//   });
router.get('/:pageId', (request, response, next) =>{
  var topic = db2.get('topics').find({id:request.params.pageId}).value();
  var user = db2.get('users').find({id:topic.user_id}).value();
  var title = topic.title;
  var description = topic.description;
  var list = template.list(request.list);

  var html = template.HTML(title, list,
        `<h2>제목 : ${title}</h2>
        내용 : ${description}
        <p>작성자 : ${user.displayName}</p>`,
        `<a href="/post/create">create</a>
        <a href="/post/update/${topic.id}">update</a>
        <form action="/post/delete_process" method="post">
        <input type="hidden" name="id" value="${topic.id}">
        <input type="submit" value="delete">
        </form>`,auth.statusUI(request,response)
  );
  response.send(html);
});


  module.exports = router;