//URL'S
//test
var URL = "https://jsonplaceholder.typicode.com/users";

var basePath = "http://localhost:8080/news-api/";
//post
var URLGetPosts = basePath + "posts/";
var URLGetPost = function(id) { return URLGetPosts + id };

var URLGetPostComments = function(id) { return URLGetPosts + id + "/comments/"};
var URLGetPostNumberOfComments = function(id) {return URLGetPosts + id + "/no_of_comments"};

var URLGetPostTags = function(id) { return URLGetPosts + id + "/tags/"};
var URLCreatePost = URLGetPosts;
var URLEditPost = function(id) { return URLGetPosts + id};

var URLLikePost = function(id) {return URLGetPosts + id + "/like"};
var URLUnlikePost = function(id) {return URLGetPosts + id + "/unlike"};

var URLDislikePost = function(id) {return URLGetPosts + id + "/dislike"};
var URLUndislikePost = function(id) {return URLGetPosts + id + "/undislike"};


//comment
var URLGetComments = basePath + "comments/";
var URLGetComment = function(id) {return URLGetComments + id};
var URLCreateComment = URLGetComments;
var URLEditComment = function(id) {return URLGetComments + id};

var URLLikeComment = function(id) {return URLGetComments + id + "/like"};
var URLUnlikeComment = function(id) {return URLGetComments + id + "/unlike"};

var URLDislikeComment = function(id) {return URLGetComments + id + "/dislike"};
var URLUndislikeComment = function(id) {return URLGetComments + id + "/undislike"};

//user
var URLGetUsers = basePath + "users/";
var URLEditUser = URLGetUsers;
var URLCreateUser = URLGetUsers;



// -----------------------------------------------------------------------------------------------

//GENERIC CALLS
function makeCall(url, methodType, callback){
 return $.ajax({
    url : url,
    method : methodType,
    dataType : "json"
 })
}

function makeDeleteCall(url, methodType, callback){
	 return $.ajax({
	    url : url,
	    method : methodType,
	    //dataType : "json"
	 })
}



//Ajax when no json is expected, just status code, for liking disliking...
//Spagheti
function makeCallNoJSON(url, methodType, callback){
	 return $.ajax({
	    url : url,
	    method : methodType,
	 })
}

function sendData(url, methodType, object_to_send, callback){
	return $.ajax({
    url : url,
    method : methodType,
    headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
    },
    dataType : "json",
    data: object_to_send
 })
}

//SA CSRF Tokenom, ali proveri jos 
function changeUser(url, methodType, object_to_send, callback){
	return $.ajax({
    url : url,
    method : methodType,
    headers: {
    	'Accept': 'application/json',
        'Content-Type': 'application/json',
    	"X-CSRFToken": getCookie("csrftoken")
    },
    dataType : "json",
    data: object_to_send
 })
}

//Error function for every request
function showError(){
	window.location.href = "http://localhost:8080/error";
}

// -----------------------------------------------------------------------------------------------

//JSONifiers
function sendablePost(title, description, photo, date, likes, dislikes, logitude, latitude, user, numberOfComments){
	return JSON.stringify({
		"title": title,
		"description" : description,
		"photo" : photo,
		"date" : date,
		"likes" : likes,
		"dislikes" : dislikes,
		"longitude" : logitude,
		"latitude" : latitude,
		"user" : {
			id : user
		}
	});

}

function sendableComment(title, description, date, likes, dislikes, post, user){
	return JSON.stringify({
		"title": title,
		"description" : description,
		"date" : date,
		"likes" : likes,
		"dislikes" : dislikes,
		"postId" : post,
		"user" : {
			id : user
		}
	});

}

function sendableUser(){

}

function sendableTag(){

}

// -----------------------------------------------------------------------------------------------

//Other:
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function getQueryVariable()
{
       const url = window.location.href;
       const urlSplit = url.split("/");
       return urlSplit[urlSplit.length-1];
}

function getCookie(c_name) {
    if(document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if(c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if(c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}

/*
//Example:
//Ajax is returend as a Promise object, succes and error functions are atached

//get:

makeCall(URLPosts, "GET").then(function(respJson){
 console.log(respJson)
}, function(reason){
 showError();
});

//post:

sendData(URLCreatePost, "POST", object_to_send).then(function(respJson){
 console.log(respJson)
}, function(reason){
 showError("Greska", reason.status);
});


*/



