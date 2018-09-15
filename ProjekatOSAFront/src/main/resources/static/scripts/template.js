$(document).ready(function(){
	console.log("Ne verujem da ovo radi jebeno");
	$( "#btn" ).click(function() {
		//window.location.href ="http://localhost:8080/test/1";
		
		/*
		makeCall("http://localhost:8080/test/1", "GET").then(function(respJson){
			 console.log(respJson)
			}, function(reason){
			 showError("Greska", reason.status);
		});
		*/
		  
	});
});



function makeCall(url, methodType, callback){
	 return $.ajax({
	    url : url,
	    method : methodType,
	    dataType : "json"
	 })
}








