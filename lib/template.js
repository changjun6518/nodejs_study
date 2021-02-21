module.exports = {
    HTML:function(title, list, body, control, authStatusUI='<a href="/auth/login">login</a> | <a href="/auth/register">register</a>'){
      return `
      <!doctype html>
      <html>
      <head>
        <title>게시판 만들기</title>
        <meta charset="utf-8">
      </head>
      <body>
        ${authStatusUI}
        <h1><a href="/">HOME</a></h1>
        ${list}
        
        ${body}
        ${control}
      </body>
      </html>
      `;
    },list:function(posts){
      var list = '<ul>';
      var i = 0;
      while(i < posts.length){
        list = list + `<li><a href="/post/${posts[i].pro_name}">${posts[i].pro_name}</a></li>`;
        i = i + 1;
      }
      list = list+'</ul>';
      return list;
    }
  }
  