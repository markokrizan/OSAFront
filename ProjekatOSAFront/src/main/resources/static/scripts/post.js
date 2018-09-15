var liked = 0;
var disliked = 0;

//kesiraj komentare:
var loadedComments = null;


$(document).ready(function(){
	

	$("#traziInput").hide();
	$("#traziBtn").hide();
	
	var postId = getQueryVariable();
	var URLPost = URLGetPost(postId);
	var URlComments = URLGetPostComments(postId);
	var URLTags = URLGetPostTags(postId);
	
	

	makeCall(URLPost, "GET").then(function(respJson){
		

	
	 let naslov = respJson.title;
	 let opis = respJson.description;
	 let datum = respJson.date;
	 let broj_lajkova = respJson.likes;
	 let broj_dislajkova = respJson.dislikes;
	 fillPost(naslov, opis, datum, broj_lajkova, broj_dislajkova);
	 fillTags(respJson.tags);
	 fillBrojKomentara(respJson.comments.length);
	 fillComments(respJson.comments);
	 
	 loadedComments = respJson.comments;
	 
	 //DOSTA VELIK BUDZ, MORA NAKON IZVRSENIH AJAXA
	 podesiInterfejsPremaKorisniku();
	  
	}, function(reason){
	 console.log(reason);	
	 //showError();
	});


	
	
	//like/dislike
	
	$("#dislajkujBtn").click(function() {
		dislikePost();
	});
	
	$("#lajkujBtn").click(function() {
		likePost();
	});
	
	
	//sortiranja:
    
    $("#sortDatumUzlazno").click(function() {
    	sortirajDatum(loadedComments, "uzlazno");
    	fillComments(loadedComments);
	});
    
    $("#sortDatumSilazno").click(function() {
    	sortirajDatum(loadedComments, "silazno");
    	fillComments(loadedComments);
	});
    
    $("#sortPopularnostUzlazno").click(function() {
    	sortirajNumericko(loadedComments, "uzlazno", "likes");
    	fillComments(loadedComments);
	});
    
    $("#sortPopularnostSilazno").click(function() {
    	sortirajNumericko(loadedComments, "silazno", "likes");
    	fillComments(loadedComments);
	});
	
	
   
   
	
	
    
});

//trebalo bi da se okine kada se svi zavrse, nesto mi se cini kao da se okida posle svakog
/*
$(document).ajaxStop(function() {
	
	podesiInterfejsPremaKorisniku();
	console.log("gotovi svi ajaxi");
});
*/

function fillPost(naslov, opis, datum, broj_lajkova, broj_dislajkova){
	$("#naslovPosta").html(naslov);
	$("#opisPosta").html(opis);
	$("#datumPostavljanja").append(datum);
  	$("#brojDislajkova").html(broj_dislajkova);
  	$("#brojLajkova").html(broj_lajkova);
}

function fillBrojKomentara(brojKomentara){
	$("#brojKomentara").html(brojKomentara);
}

function fillPostBrojLajkova(brojLajkova){
	$("#brojLajkova").html(brojLajkova);
}

function fillPostBrojDislajkova(brojDislajkova){
	$("#brojDislajkova").html(brojDislajkova);
}

function fillCommentBrojLajkova(element, brojLajkova){
	$(element).find("span").html(brojLajkova);
}

function fillCommentBrojDislajkova(element, brojDislajkova){
	$(element).find("span").html(brojLajkova);
}



function fillComments(comments){
	$("#komentari").empty();
	$.each(comments, function(index, comment){
		$("#komentari").append(
				'<div class="card-body">'+
				    '<small class="text-muted">'+ comment.date +'</small>'+
				    '<h4>'+ comment.title +'</h4>'+
				    '<p>'+ comment.description +'</p>'+
				    '<a onclick="dislikeComment(this, '+ comment.id +')" data-clicked = "0" class="dislikeCommentsButtons btn pull-right btn-danger btn-lg">'+
				      '<i class="fa fa-thumbs-down"> </i> &nbsp; <span> ' + comment.dislikes + '</span> </a>'+
				    '<a onclick = "likeComment(this, '+ comment.id +')" data-clicked = "0" class="likeCommentButtons btn pull-right btn-success btn-lg">'+
				      '<i class="fa fa-thumbs-up"> </i> &nbsp; <span> '+ comment.likes +'</span> </a>'+
			    '</div>'+
			    '<br/>'+
			    '<hr>'
		);
	})
	


}

function fillTags(tags){
	$.each(tags, function(index, value){
		let tag = '<a class="btn pull-left btn-lg btn-info">' + value.name + '</a>';
		$("#postDetails").append(tag);
	})
	
}

function likePost(){
	if(liked === 0){
		let url = URLLikePost(getQueryVariable());
		makeCallNoJSON(url, "PUT").then(function(respJson){
			let brojLajkovaUpdate = parseInt($("#brojLajkova").text()) + 1;
			fillPostBrojLajkova(brojLajkovaUpdate);
			liked += 1;
			//$("#lajkujBtn").addClass("disabled");
		}, function(reason){
			//showError();
			console.log(reason);
		});
	}else if(liked === 1){
		let url = URLUnlikePost(getQueryVariable());
		makeCallNoJSON(url, "PUT").then(function(respJson){
			let brojLajkovaUpdate = parseInt($("#brojLajkova").text()) - 1;
			fillPostBrojLajkova(brojLajkovaUpdate);
			liked -= 1;
		}, function(reason){
			//showError();
			console.log(reason);
		});
	}
	
	
	
	
}

function dislikePost(){
	if(disliked === 0){
		let url = URLDislikePost(getQueryVariable());
		makeCallNoJSON(url, "PUT").then(function(respJson){
			let brojDislajkovaUpdate = parseInt($("#brojDislajkova").text()) + 1;
			fillPostBrojDislajkova(brojDislajkovaUpdate);
			disliked += 1;
			//$("#lajkujBtn").addClass("disabled");
		}, function(reason){
			//showError();
			console.log(reason);
		});
	}else if(disliked === 1){
		let url = URLUndislikePost(getQueryVariable());
		makeCallNoJSON(url, "PUT").then(function(respJson){
			let brojDislajkovaUpdate = parseInt($("#brojDislajkova").text()) - 1;
			fillPostBrojDislajkova(brojDislajkovaUpdate);
			disliked -= 1;
		}, function(reason){
			//showError();
			console.log(reason);
		});
	}
}

function likeComment(element, id){
	if(element.dataset.clicked === "0"){
		let url = URLLikeComment(id);
		
		makeCallNoJSON(url, "PUT").then(function(respJson){
			
			let brojLajkovaUpdate = parseInt($(element).find("span").text()) + 1;
			fillCommentBrojLajkova(element, brojLajkovaUpdate);
			element.dataset.clicked = "1";
			
		}, function(reason){
			//showError();
			console.log(reason);
		});
	}else if(element.dataset.clicked === "1"){
		let url = URLUnlikeComment(id);
		
		makeCallNoJSON(url, "PUT").then(function(respJson){
			
			let brojLajkovaUpdate = parseInt($(element).find("span").text()) - 1;
			fillCommentBrojLajkova(element, brojLajkovaUpdate);
			element.dataset.clicked = "0";
			
		}, function(reason){
			//showError();
			console.log(reason);
		});
	}
}

function dislikeComment(element, id){
	if(element.dataset.clicked === "0"){
		let url = URLDislikeComment(id);
		
		makeCallNoJSON(url, "PUT").then(function(respJson){
			
			let brojDislajkovaUpdate = parseInt($(element).find("span").text()) + 1;
			fillCommentBrojLajkova(element, brojDislajkovaUpdate);
			element.dataset.clicked = "1";
			
		}, function(reason){
			//showError();
			console.log(reason);
		});
	}else if(element.dataset.clicked === "1"){
		let url = URLUndislikeComment(id);
	
		makeCallNoJSON(url, "PUT").then(function(respJson){
			
			let brojDislajkovaUpdate = parseInt($(element).find("span").text()) - 1;
			fillCommentBrojLajkova(element, brojDislajkovaUpdate);
			element.dataset.clicked = "0";
			
		}, function(reason){
			//showError();
			console.log(reason);
		});
	}
}


function dodajKomentar(comment){
	loadedComments.push(comment);
}




