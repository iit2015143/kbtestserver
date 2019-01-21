var https = require("https");


//Actual Body
function sendmessagetorestaurant(number,order,mode,summary,total,tonumber){
	console.log("sending message to rest");
	console.log(number + " " + order + " " + mode + " summary : "+summary);

	// let url = "https://2factor.in/API/R1/"+
	// number+"&from=khanab&templatename=order+place&var1="+order+"&var2="+mode+"&var3="+summary+"&var4="+total+"&var5="+tonumber;
	// https.get(url,function(res){
	//   let data = '';
	//   res.on("data",(chunk)=>{
	//     data+=chunk;
	//   });
	//   res.on("end",()=>{
	//     console.log(data);
	//   });
	//   res.on("error",(error)=>{
	//     console.log(error);
	// 	});
	// });
}

//Exports
module.exports = sendmessagetorestaurant;
