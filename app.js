//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT;

// const posts = [];
let count = 0;


mongoose.connect("mongodb://localhost:27017/blogDB");


app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true]
  },
  content: {
    type: String,
    required: [true]
  }
});

const Post = mongoose.model('Post', postSchema);


app.get('/', (req, res)=>{

  Post.find({}, (err, posts)=>{
    res.render('home', {posts: posts});
  })

})


app.get('/about', (req, res)=>{
  res.render('about');
})

app.get('/contact', (req, res)=>{
  res.render('contact');
})

app.get('/compose', (req, res)=>{
  res.render('compose');
})

app.post('/compose', (req, res)=>{
  const postTitle = req.body.postTitle;
  const postContent = req.body.postContent;

  
  const post = new Post({
    title: postTitle,
    content: postContent
  });

  post.save((err)=>{
    if(!err){
      res.redirect('/');
    }
  })

  

  // console.log(post);
  
  
})

// app.post('/post', (req, res)=>{
//   console.log(req.body);
//   const postTitle = req.body.postTitle;
//   const postContent = req.body.postContent;
//   res.render('post', {postTitle: postTitle, postContent: postContent});
// })



app.get('/posts/:postTitle/:id', (req, res)=>{

  // for(let i = 0; i < posts.length; i++) {
  //   if( req.params.postTitle == posts[i].title){
  //     console.log('Match Found')
  //   }
  // }
  const postID = req.params.id;
  Post.findOne({_id: postID}, (err, post)=>{
    if(!err){
      res.render('post', {postTitle: post.title, postContent: post.content, postID: post._id});
    }else{
      console.log(err);
    }
    
  })

})

app.get('/delete/:id', (req, res)=>{
  const postID = req.params.id;
  Post.deleteOne({_id: postID}, (err)=>{
    if(!err){
      res.redirect('/');
    }else{
      console.log(err);
    }
  })
  
})





app.listen(port || 3000, function() {
  console.log("Server started on port 3000");
});
