//kesiraj za sortiranje
var loadedPosts = null;


$(document).ready(function(){
	

	
	//initial
	makeCall(URLGetPosts, "GET").then(function(respJson){
	 loadedPosts = respJson;
	 showPosts(respJson);
	}, function(reason){
		//showError();
		console.log(reason);
	});
	
	
	//sort:
	$("#sortDatumUzlazno").click(function() {
		sortirajDatum(loadedPosts, "uzlazno");
		showPosts(loadedPosts);
			
	});
	
	$("#sortDatumSilazno").click(function() {
		sortirajDatum(loadedPosts, "silazno");
		showPosts(loadedPosts);
		
	});
	
	$("#sortBrojKomentaraUzlazno").click(function() {
		sortirajBrojKomentara(loadedPosts, "uzlazno");
		showPosts(loadedPosts);
	});
	
	$("#sortBrojKomentaraSilazno").click(function() {
		sortirajBrojKomentara(loadedPosts, "silazno");
		showPosts(loadedPosts);
	});
	
	$("#sortPopularnostUzlazno").click(function() {
		sortirajNumericko(loadedPosts, "uzlazno", "likes");
		showPosts(loadedPosts);
		
	});
	
	$("#sortPopularnostSilazno").click(function() {
		sortirajNumericko(loadedPosts, "silazno", "likes");
		showPosts(loadedPosts);
	});
	
	//search
	$("#traziBtn").click(function(){
		let query = $("#traziInput").val();
		
		let pretrazeni = nadjiPostove(loadedPosts, query);
		showPosts(pretrazeni);
		
		$("#traziInput").val('');
		
	});

	
	podesiInterfejsPremaKorisniku();
});


//https://pingendo.com/assets/photos/wireframe/photo-1.jpg
function showPosts(posts){
	$("#posts").empty();
	$.each(posts, function (index, post) {
		$('#posts').append( '<div class="py-5">'+
			    '<div class="container">'+
			      '<div class="row">'+
			        '<div class="col-md-5 order-2 order-md-1">'+
			          '<img class="img-fluid d-block" src="'+ post.photo +'"> </div>'+
			        '<div class="col-md-7 order-1 order-md-2">'+
			          '<h3>'+ post.title +'</h3>'+
			          '<p class="my-3 w-100 h-25">'+ post.description +'</p>'+
			          '<br/>'+
			          '<div class="row">'+
			            '<div class="col-md-12">'+
			              '<a class="btn mx-auto pull-right btn-info" href="http://localhost:8081/post/'+ post.id +'">Detalji</a>'+
			            '</div>'+
			          '</div>'+
			        '</div>'+
			      '</div>'+
			    '</div>'+
			  '</div>'
		);
        
	})
	
}

function dodajPost(post){
	loadedPosts.push(post);
}






