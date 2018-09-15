$(document).ready(function(){
	console.log(getQueryVariable());
});

function getQueryVariable()
{
       const url = window.location.href;
       const urlSplit = url.split("/");
       return urlSplit[urlSplit.length-1];
}