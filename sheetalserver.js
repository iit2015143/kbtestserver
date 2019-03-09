var express = require('express');
var app = express();
var port = 3000;

app.get('/createhero',function(req,res){
  let randomuser = Math.floor(Math.random()*10000) + 10000;
  //store this randomuser as alive and win_score = 0;
  res.send({hero:randomuser});
})

app.get('/fighttodeath',function(req,res){
  //query database for at least two alive heroes;
  //assume you found two heroes;
  found = true;
  heroes = [1235,435]
  if(found){
    randindex = Math.floor(Math.random()*2);
    deadhero = heroes[randindex];
    //write in database that deadhero is dead in place of alive
    //increase alive hero's win_score


    //this sends to user which hero won the fight
    if(randindex===0){
      res.send({fightBetween:heroes,alive:heroes[1]});
    }
    else{
      res.send({fightBetween:heroes,alive:heroes[0]});
    }
  }
})

var server = app.listen(port,function(req,res){
  console.log("server started on "+ port);
});
