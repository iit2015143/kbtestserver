//Logs a user out temporarily.

const logoutSession=(req,res) => {

  const sess = req.session;
    sess.loggedin=false;
    sess.number = "";
    sess.uuid = "";
  
  req.session.destroy(function(err){
    if(err)
    throw err;
    console.log("session destroyed");
  });
  res.send({loggedout:"true"});

}

module.exports=logoutSession;
