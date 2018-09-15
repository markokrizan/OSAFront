var ucitaneObjave = null;
var ucitaniKomentari = null;
var ucitaniKorisnici = null;

var objavaZaKomentarisanje = null;
var objavaZaIzmenu = null;

var aktivanEntitet = null;


var userId = localStorage.getItem('userId');
var currentAdmin = null;


$(document).ready(function(){
	
	
	$("#postBtn").hide();
	
	
	$("#loginBtn").hide();
	$("#registerBtn").hide();
	$("#traziInput").hide();
	$("#traziBtn").hide();
	
	ucitajKorisnika();
	ucitajObjave();
	aktivanEntitet = "objave";
	
	
	//ucitavanje tabela entiteta
	$("#btnObjave").click(function(){
		ucitajObjave();
		aktivanEntitet = "objave";
		$("#dodajAdminDugme").show();
		
	});
	
	$("#btnKomentari").click(function(){
		ucitajKomentare();
		aktivanEntitet = "komentari";
		$("#dodajAdminDugme").hide();
		
	});

	$("#btnKorisnici").click(function(){
		ucitajKorisnike();
		aktivanEntitet = "korisnici";
		$("#dodajAdminDugme").show();
		
	});
	
	//pretragaTabela
	$("#pretragaTabele").on('keyup', function (e) {
	    if (e.keyCode == 13) {
	    	switch(aktivanEntitet) {
	        case "objave":
	        	let q1 = $("#pretragaTabele").val();
	        	pretraziObjave(q1);
	            break;
	        case "komentari":
	        	let q2 = $("#pretragaTabele").val();
	        	pretraziKomentare(q2);
	            break;
	        case "korisnici":
	        	let q3 = $("#pretragaTabele").val();
	        	pretraziKorisnike(q3);
	            break;
	        default:
	            break;
	    	}
	    }
	});
	

	$("#dodajAdminDugme").click(function(){
		switch(aktivanEntitet) {
        case "objave":
        	let post = {};
        	modalZaIzmenuDodavanjeObjave = new PostModal(post, "dodavanje");
            break;
        case "komentari":
        	//console.log("dodaj komentar");
            break;
        case "korisnici":
        	let user = {};
    		modalZaIzmenuDodavanjeKorisnika = new UserModal(user, "dodavanje");
            break;
        default:
            break;
    	}
		
	});
	
	$("#btnIzmeniPodatke").click(function(){
		modalZaIzmenuDodavanjeKorisnika = new UserModal(currentAdmin, "izmena");
	});

	
	podesiInterfejsPremaKorisniku();
});


//ucitavanja ------------------------------------------

function ucitajKorisnika(){
	makeCall("http://localhost:8080/news-api/users/" + userId, "GET").then(function(respJson){
		 //console.log(respJson);
		 napuniKorisnika(respJson);
		 currentAdmin = respJson;
	}, function(reason){
		console.log(reason);
		//showError();
	});
}


function ucitajObjave(){
	makeCall(URLGetPosts, "GET").then(function(respJson){
		 ucitaneObjave = respJson;
		 generisiTabeluObjava(respJson);
	}, function(reason){
		//showError();
		console.log(reason);
	});
	
}

function ucitajKomentare(){
	makeCall(URLGetComments, "GET").then(function(respJson){
		 ucitaniKomentari = respJson;
		 generisiTabeluKomentara(respJson);
	}, function(reason){
		//showError();
		console.log(reason);
	});
	
}

function ucitajKorisnike(){
	makeCall(URLGetUsers, "GET").then(function(respJson){
		 ucitaniKorisnici = respJson;
		 generisiTabeluKorisnika(respJson);
	}, function(reason){
		//showError();
		console.log(reason);
	});
	
}

//---------------------------------------------------------


//operacije -----------------------------------------------



function izmeniObjavu(element, id){
	
	let post = getEntityById(id, ucitaneObjave);
	modalZaIzmenuDodavanjeObjave = new PostModal(post, "izmena");

}

function obrisiObjavu(element, id){
	
	var callback = function(id){
		makeDeleteCall("http://localhost:8080/news-api/posts/" + id, "DELETE").then(function(respJson){
			 console.log(respJson);
			 
			 //osvezi:
			 removeDeletedEntity(id, ucitaneObjave);
			 ucitajObjave();
			 
			 
		}, function(reason){
			//showError();
			console.log(reason);
		});
	};
	
	potvrdiBrisanje(callback, id);
	
	
}

function potvrdiBrisanje(callback, id){
	let confirmModal = $('#potvrdiModal');
	confirmModal.find("#btnPotvrdiBrisanje").click(function(event){
		callback(id);
		$('#potvrdiModal').modal('hide');
	});
	
	$('#potvrdiModal').modal('show');
}


function komentarisiObjavu(element, id){
	
	let comment = {postId : id};
	modalZaIzmenuDodavanjeKomentara = new CommentModal(comment, "dodavanje");
}

function sortirajObjave(poredak, kriterijum){
	switch(kriterijum) {
    case "datum":
        if(poredak === "uzlazno"){
        	sortirajDatum(ucitaneObjave, poredak);
        	generisiTabeluObjava(ucitaneObjave);
        }else if(poredak === "silazno"){
        	sortirajDatum(ucitaneObjave, poredak);
        	generisiTabeluObjava(ucitaneObjave);
        }
       
        break;
        
    case "brojKomentara":
    	if(poredak === "uzlazno"){
    		sortirajBrojKomentara(ucitaneObjave, poredak);
    		generisiTabeluObjava(ucitaneObjave);
        }else if(poredak === "silazno"){
        	sortirajBrojKomentara(ucitaneObjave, poredak);
    		generisiTabeluObjava(ucitaneObjave);
        }
        break;
        
    case "popularnost":
    	if(poredak === "uzlazno"){
    		sortirajNumericko(ucitaneObjave, poredak, "likes");
    		generisiTabeluObjava(ucitaneObjave);
        }else if(poredak === "silazno"){
        	sortirajNumericko(ucitaneObjave, poredak, "likes");
    		generisiTabeluObjava(ucitaneObjave);
        }
        break;
        
    default:
        break;
	}
    
}

function pretraziObjave(query){
	let filtriraneObjave = nadjiPostove(ucitaneObjave, query);
	generisiTabeluObjava(filtriraneObjave);
	
}

function izmeniKomentar(element, id){
	let comment = getEntityById(id, ucitaniKomentari);
	modalZaIzmenuDodavanjeKomentara = new CommentModal(comment, "izmena");
}

function obrisiKomentar(element, id){
	var callback = function(id){
		makeDeleteCall("http://localhost:8080/news-api/comments/" + id, "DELETE").then(function(respJson){
			 console.log(respJson);
			 
			 //osvezi:
			 removeDeletedEntity(id,ucitaniKomentari);
			 ucitajKomentare();
			 
			 
		}, function(reason){
			//showError();
			console.log(reason);
		});
	};
	
	potvrdiBrisanje(callback, id);
}

function sortirajKomentare(poredak, kriterijum){
	switch(kriterijum) {
    case "datum":
        if(poredak === "uzlazno"){
        	sortirajDatum(ucitaniKomentari, poredak);
        	generisiTabeluKomentara(ucitaniKomentari);
        }else if(poredak === "silazno"){
        	sortirajDatum(ucitaniKomentari, poredak);
        	generisiTabeluKomentara(ucitaniKomentari);
        }
       
        break;
        
    case "popularnost":
    	if(poredak === "uzlazno"){
    		sortirajNumericko(ucitaniKomentari, poredak, "likes");
    		generisiTabeluKomentara(ucitaniKomentari);
        }else if(poredak === "silazno"){
        	sortirajNumericko(ucitaniKomentari, poredak, "likes");
        	generisiTabeluKomentara(ucitaniKomentari);
        }
        break;
        
    default:
        break;
	}
}

function pretraziKomentare(query){
	console.log(query);
}

function izmeniKorisnika(element, id){
	let user = getEntityById(id, ucitaniKorisnici);
	modalZaIzmenuDodavanjeKorisnika = new UserModal(user, "izmena");
}


function obrisiKorisnika(element, id){
	var callback = function(id){
		makeDeleteCall("http://localhost:8080/news-api/users/" + id, "DELETE").then(function(respJson){
			 console.log(respJson);
			 
			 //osvezi:
			 removeDeletedEntity(id,ucitaniKorisnici);
			 ucitajKorisnike();
			 
			 
		}, function(reason){
			//showError();
			console.log(reason);
		});
	};
	
	potvrdiBrisanje(callback, id);
}

function pretraziKorisnike(query){
	console.log(query);
}

//---------------------------------------------------------



//iscrctavanja tabela -------------------------------------

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

function generisiTabeluObjava(objave){
	
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
	            '<td><a style="word-wrap: break-word;" href = "http://localhost:8081/post/'+ objava.id +'">' + objava.title + '</a></td>'+
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
	/*
	$("#redovi").append('<tr><td colspan = "5" id = "poslednjiRed" ></td></tr>');
	$("#poslednjiRed").append(
			'<a class="btn navbar-btn ml-2 btn-light text-dark w-100" onclick = "dodajObjavu()">'+
				'<i class="fa d-inline fa-lg fa-plus-square"></i>&nbsp;'+
			'</a>'
    );
    */
	
}

function generisiTabeluKomentara(komentari){
	$("#nazivTabele").html("Komentari");
	$("#dropdownMenuButton").show();
	$("#stavkeSortMenija").html(`
			<a class="dropdown-item" onclick = "sortirajKomentare('uzlazno', 'datum')"id = "sortDatumUzlazno">Datumu - uzlazno</a>
            <a class="dropdown-item" onclick = "sortirajKomentare('uzlazno', 'datum')"id = "sortDatumSilazno">Datumu - silazno</a>
            <a class="dropdown-item" onclick = "sortirajKomentare('uzlazno', 'popularnost')"id = "sortPopularnostUzlazno">Popularnosti - uzlazno</a>
            <a class="dropdown-item" onclick = "sortirajKomentare('uzlazno', 'popularnost')"id = "sortPopularnostSilazno">Popularnosti - silazno</a>	`
	);
	$("#zaglavlje").html(
			'<tr>'+
            '<th class="w-20">ID</th>'+
            '<th class="w-20">Naslov</th>'+
            '<th class="w-20">ID objave</th>'+
            '<th class="w-20">Postavio</th>'+
            '<th class="w-20">Operacije</th>'+
          '</tr>'
	);
	$("#redovi").empty();
	$.each(komentari, function(index, komentar){
		$("#redovi").append(
				'<tr>'+
	            '<td>' + komentar.id + '</td>'+
	            '<td>' + komentar.title + '</td>'+
	            '<td>' + komentar.postId + '</td>'+
	            '<td>' + komentar.user.username + '</td>'+
	            '<td>'+
	              '<a class="btn btn-warning" onclick="izmeniKomentar(this, '+ komentar.id +')"  >Izmeni </a>'+
	              '&nbsp;'+
	              '<a class="btn btn-danger" onclick="obrisiKomentar(this, '+ komentar.id +')" >Obrisi </a>'+
	            '</td>'+
	            '</tr>'
		);
	})
}

function generisiTabeluKorisnika(korisnici){
	$("#nazivTabele").html("Korisnici");
	$("#dropdownMenuButton").hide();
	$("#zaglavlje").html(
			'<tr>'+
            '<th class="w-20">ID</th>'+
            '<th class="w-20">Ime</th>'+
            '<th class="w-20">Korisnicko ime</th>'+
            '<th class="w-20">Uloge</th>'+
            '<th class="w-20">Operacije</th>'+
          '</tr>'
	);
	$("#redovi").empty();
	$.each(korisnici, function(index, korisnik){
		
		//da nema i sebe na tabeli
		 if(korisnik.id == userId){
			 return true;
		 }
		
		
		let uloge = [];
		 $.each(korisnik.roles, function(index, uloga){
			 uloge.push(uloga.roleName);
		 })
		 
		$("#redovi").append(
				'<tr>'+
	            '<td>' + korisnik.id + '</td>'+
	            '<td>' + korisnik.name + '</td>'+
	            '<td>' + korisnik.username + '</td>'+
	            '<td>' + uloge + '</td>'+
	            '<td>'+
	              '<a class="btn btn-warning" onclick="izmeniKorisnika(this, '+ korisnik.id +')"  >Izmeni </a>'+
	              '&nbsp;'+
	              '<a class="btn btn-danger" onclick="obrisiKorisnika(this, '+ korisnik.id +')" >Obrisi </a>'+
	            '</td>'+
	            '</tr>'
		);
	})
}



//---------------------------------------------------------


