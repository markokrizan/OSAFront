var ucitaneObjave = null;

let userId = localStorage.getItem('userId');
var korisnik = null;


$(document).ready(function(){
	
	
	console.log(userId);
	
	ucitajKorisnika();
	ucitajObjave();
	
	
	
	
	$("#dodajUserDugme").click(function(){
        let post = {};
        modalZaIzmenuDodavanjeObjave = new PostModal(post, "dodavanje");
	});
	
	$("#btnIzmeniPodatke").click(function(){
		modalZaIzmenuDodavanjeKorisnika = new UserModal(korisnik, "izmena");
	});
	
	podesiInterfejsPremaKorisniku();
	
});

function ucitajKorisnika(){
	makeCall("http://localhost:8080/news-api/users/" + userId, "GET").then(function(respJson){
		 //console.log(respJson);
		korisnik = respJson;
		 napuniKorisnika(respJson);
	}, function(reason){
		console.log(reason);
		//showError();
	});
}

function ucitajObjave(){
	makeCall("http://localhost:8080/news-api/users/" + userId + "/posts", "GET").then(function(respJson){
		//console.log(respJson);
		ucitaneObjave = respJson;
		napuniPostove(respJson); 
	}, function(reason){
		console.log(reason);
		//showError();
	})
}

function napuniKorisnika(korisnik){
	
	$("#userImePrezime").html(korisnik.name);
	
	
	let uloge = [];
	 $.each(korisnik.roles, function(index, uloga){
		 uloge.push(uloga.roleName);
	 })
	

	$("#userUloge").html(uloge);
	$("#userKorisnicko").html(korisnik.username);
	$("#userSlika").attr('src',korisnik.photo);
	
	
}

function napuniPostove(objave){
	console.log(objave);
	if(objave === null){
		$("#teloKartice").html('<h1 class="text-center" contenteditable="true" >Nemate ni jednu objavu</h1>');
	}else{
		$("#nazivTabele").html("Objave");
		$("#dropdownMenuButton").show();
		$("#stavkeSortMenija").html(`
				<a class="dropdown-item" onclick = "sortirajObjave('uzlazno', 'datum')" id = "sortDatumUzlazno">Datumu - uzlazno</a>
	            <a class="dropdown-item" onclick = "sortirajObjave('silazno', 'datum')" id = "sortDatumSilazno">Datumu - silazno</a>
	            <a class="dropdown-item" onclick = "sortirajObjave('uzlazno', 'brojKomentara')"id = "sortBrojKomentaraUzlazno">Broju komentara - uzlazno</a>
	            <a class="dropdown-item" onclick = "sortirajObjave('silazno', 'brojKomentara')"id = "sortBrojKomentaraSilazno">Broju komentara - silazno</a>
	            <a class="dropdown-item" onclick = "sortirajObjave('uzlazno', 'popularnost')"id = "sortPopularnostUzlazno">Popularnosti - uzlazno</a>
	            <a class="dropdown-item" onclick = "sortirajObjave('silazno', 'popularnost')"id = "sortPopularnostSilazno">Popularnosti - silazno</a>	`
		);
		$("#zaglavlje").html(
				'<tr>'+
	            '<th class="w-20">ID</th>'+
	            '<th class="w-20">Naslov</th>'+
	            '<th class="w-20">Postavljena</th>'+
	            '<th class="w-20">Postavio</th>'+
	            '<th class="w-20">Operacije</th>'+
	          '</tr>'
		);
		$("#redovi").empty();
		$.each(objave, function(index, objava){
			$("#redovi").append(
					'<tr>'+
		            '<td>' + objava.id + '</td>'+
		            '<td><a href = "http://localhost:8081/post/'+ objava.id +'">' + objava.title + '</a></td>'+
		            '<td>' + objava.date + '</td>'+
		            '<td>' + objava.user.username + '</td>'+
		            '<td>'+
		              '<a class="btn btn-warning" onclick="izmeniObjavu(this, '+ objava.id +')"  >Izmeni </a>'+
		              '&nbsp;'+
		              '<a class="btn btn-danger" onclick="obrisiObjavu(this, '+ objava.id +')" >Obrisi </a>'+
		              '&nbsp;'+
		              '<a class="btn btn-info" onclick="komentarisiObjavu(this, '+ objava.id +')" ><i class="fa fa-comment"></i> </a>'+
		            '</td>'+
		            '</tr>'	
			);
		})
	}
	
}

function sortirajObjave(poredak, kriterijum){
	switch(kriterijum) {
    case "datum":
        if(poredak === "uzlazno"){
        	sortirajDatum(ucitaneObjave, poredak);
        	napuniPostove(ucitaneObjave);
        }else if(poredak === "silazno"){
        	sortirajDatum(ucitaneObjave, poredak);
        	napuniPostove(ucitaneObjave);
        }
       
        break;
        
    case "brojKomentara":
    	if(poredak === "uzlazno"){
    		sortirajBrojKomentara(ucitaneObjave, poredak);
    		napuniPostove(ucitaneObjave);
        }else if(poredak === "silazno"){
        	sortirajBrojKomentara(ucitaneObjave, poredak);
        	napuniPostove(ucitaneObjave);
        }
        break;
        
    case "popularnost":
    	if(poredak === "uzlazno"){
    		sortirajNumericko(ucitaneObjave, poredak, "likes");
    		napuniPostove(ucitaneObjave);
        }else if(poredak === "silazno"){
        	sortirajNumericko(ucitaneObjave, poredak, "likes");
        	napuniPostove(ucitaneObjave);
        }
        break;
        
    default:
        break;
	}
    
}

function pretraziObjave(query){
	let filtriraneObjave = nadjiPostove(ucitaneObjave, query);
	napuniPostove(filtriraneObjave);
	
}

function komentarisiObjavu(element, id){
	
	let comment = {postId : id};
	modalZaIzmenuDodavanjeKomentara = new CommentModal(comment, "dodavanje");
}

function izmeniObjavu(element, id){
	
	let post = getEntityById(id, ucitaneObjave);
	modalZaIzmenuDodavanjeObjave = new PostModal(post, "izmena");

}

