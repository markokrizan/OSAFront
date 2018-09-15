

function sortirajDatum(kolekcija, kriterijum){
	kolekcija.sort(function(a, b){
		if(kriterijum === "silazno") {return new Date(b.date) > new Date(a.date);}
		if(kriterijum === "uzlazno") {return new Date(a.date) > new Date(b.date);}
	});	
	
}
/*
 * when passing as param
 * 
 * myObj.propName
	// is equivalent to
	myObj["propName"]
 * 
 * 
 */

function sortirajNumericko(kolekcija, kriterijum, obelezje){

	kolekcija.sort(function(a, b){
		if(kriterijum === "silazno") {return b[obelezje] - a[obelezje];}
		if(kriterijum === "uzlazno") {return a[obelezje] - b[obelezje];}
	});
	
}

function sortirajBrojKomentara(kolekcija, kriterijum){
	kolekcija.sort(function(a, b){
		if(kriterijum === "silazno") {return b.comments.length - a.comments.length ;}
		if(kriterijum === "uzlazno") {return a.comments.length - b.comments.length;}
	});
}

function provera(kolekcija, obelezje){
	$.each(kolekcija, function(index, value){
		console.log(value[obelezje]);
	})
}


function nadjiPostove(kolekcija, query){
	let filtriranaKolekcija = [];
	$.each(kolekcija, function(index, post){
		if (post.user.username.includes(query)){
			filtriranaKolekcija.push(post);
		}
		$.each(post.tags, function(index, tag){
			if(tag.name.includes(query)){
				filtriranaKolekcija.push(post);
			}
		
		})
		
	})
	return filtriranaKolekcija;
}


function getEntityById(id, kolekcija){
	let nadjeniObjekat = null;
	$.each(kolekcija, function(index, item){
		if(item.id === id){
			nadjeniObjekat = item;
		}
	})
	return nadjeniObjekat;
}

function insertChangedPost(post, collection){
	$.each(collection, function(index, item){
		if (item.id === post.id ){
			item.title = post.title;
			item.description = post.description;
			item.photo = post.photo;
			item.date = post.date;
			item.comments = post.comments;
			item.longitude = post.longitude;
			item.latitude = post.latitude;
			item.user = post.user;
			item.tags = post.tags;
			item.likes = post.likes;
			item.dislikes = post.dislikes;
		}
	})
}

function insertChangedComment(comment, collection){
	$.each(collection, function(index, item){
		if (item.id === comment.id ){
			item.title = comment.title;
			item.description = comment.description;
			item.date = comment.date;
			item.user = comment.user;
			item.likes = comment.likes;
			item.dislikes = comment.dislikes;
			item.postId = comment.postId;
		}
	})
}

function insertChangedUser(user, collection){
	$.each(collection, function(index, item){
		if (item.id === user.id ){
			item.name = user.name;
			item.username = user.username;
			item.password = user.password;
			item.photo = user.photo;
			item.roles = user.roles;
		}
	})
}

function removeDeletedEntity(id, collection){
	let indexForRemoval = null;
	$.each(collection, function(index, item){
		if(id == item.id){
			indexForRemoval = index;
		}
	});
	collection.splice(indexForRemoval, 1);
}
