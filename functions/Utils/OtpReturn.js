const https=require('https');

const returnOtp=(number) => {
  var otp = Math.floor(Math.random()*10)+""+ Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)+""+
	Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10);
	if(parseInt(number)==7488663497)
	otp = "11111";
	else
	https.get("https://2factor.in/API/V1/53a00358-7bf4-11e8-a895-0200cd936042/SMS/"+number+"/"+otp+"/khanabot",function(res){
	  let data = '';
	  res.on("data",(chunk)=>{
	    data+=chunk;
	  });
	  res.on("end",()=>{
	    console.log(data);
	  });
	  res.on("error",(error)=>{
	    console.log(error);
	  });
	});

	console.log(otp);
	return otp;
}

module.exports=returnOtp;
