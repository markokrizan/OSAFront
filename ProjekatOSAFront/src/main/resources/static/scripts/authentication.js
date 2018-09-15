function login(user, pass, callback){
	$.ajax({
	    url : "http://localhost:8080/login",
	    method : "POST",
	    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	    data: {username: user, password: pass},
	    success: function(data, status){
	    	callback(data, status);
	    	//console.log("Login:");
	    	//console.log(data);
	    	//console.log(status);
	    },
	    error: function(){
	    	//stavi modalni ovde
	    	$('#pogresniPodaciModal').modal('show');
	    	//ocisti polja
	    }
	});
}


function afterLogin(data){
	let id = data.id;
	let roles = data.roles;
	
	
	//setuj u local storage, pri logout-u ces brisati
	localStorage.setItem('userId', id);
	localStorage.setItem('userRoles', JSON.stringify(roles));

	
	//setuj tip da mozes posle da koristis (proveri da li je jedna od uloga admin)
	$.each(roles, function(index, item){
		if(item.roleName === "ADMINISTRATOR"){
			localStorage.setItem('isAdmin', true);
		}else if(item.roleName === "OBJAVLJIVAC"){
			localStorage.setItem('isObjavljivac', true);
		}else if(item.roleName === "KOMENTATOR"){
			localStorage.setItem('isKomentator', true);
		}else{
			return false;
		}
	});
	
	
	podesiInterfejsPremaKorisniku();
	

	//vidi sad jedino da ne hardkodujes nego da vadis iz local storidza
}



function profilnaStranica(){

	let userId = localStorage.getItem('userId');
	let roles = JSON.parse(localStorage.getItem('userRoles'));
	
	let isAdmin = localStorage.getItem('isAdmin');
	
	if(isAdmin){
		window.location.href = "http://localhost:8081/admin";
	}else{
		window.location.href = "http://localhost:8081/user/" + userId;
	}
	
	
	
}


function logout(){
	localStorage.clear();
	window.location.href = "http://localhost:8081";
	podesiInterfejsPremaKorisniku();
	
	
}




function podesiInterfejsPremaKorisniku(){
	
	//console.log(window.location.pathname.split("/").pop());
	
	
	//generalno
	//login i register -> profil
	if(localStorage.getItem('userId') !== null){
	
		$("#loginBtn").hide();
		$("#registerBtn").hide();
		
		//dodaj dugme za profilnu i logout
		$("#navbar2SupportedContent").prepend(
				'<a class="btn navbar-btn ml-2 btn-light text-dark" id = "profilBtn" onclick = "profilnaStranica()" >'+
		          '<i class="fa d-inline fa-lg fa-user-circle-o"></i>&nbsp;Profil</a>'+
		         '<a class="btn navbar-btn ml-2 btn-light text-dark" id = "logoutBtn" onclick = "logout()" >'+
		         	'&nbsp;Logout</a>'
		          
				
		);
	}
	
	
	
	
	if(localStorage.getItem('userId') === null){
		//izgled ako niko nije ulogovan:
		//-samo gledanje objava i komentara, sve ostalo iskljuceno
		
		if(window.location.pathname.split("/").pop() === ""){
			 //index:
			console.log("gost u usao u index");
			
			$("#dropdownMenuButton").hide();
			$("#postBtn").hide();
			$("#traziInput").hide();
			$("#traziBtn").hide();
			
			
			
			
		}else if(window.location.pathname.split("/").slice(-2, -1)[0] === "post"){
			//post:
			console.log("gost u usao u post");
			$("#dropdownMenuButton").hide();
			$("#lajkujBtn").hide();
			$("#dislajkujBtn").hide();
			$("#komentarisiBtn").hide();
			
			let a = $(".likeCommentButtons").hide();
			let b = $(".dislikeCommentsButtons").hide(); 
			console.log(a);
			console.log(b);
			
			$("#traziInput").hide();
			$("#traziBtn").hide();
			
			
			
		}else if(window.location.pathname.split("/").slice(-2, -1)[0] === "user"){
			//user:
			console.log("gost pokusao u user");
		}
		
	}else if(localStorage.getItem('isAdmin')){
		
		
		
		
		
		//izgled ako je admin:
		//-sve moze, ostavi kako jeste, nesto dodaj ako treba
		
		if(window.location.pathname.split("/").pop() === ""){
			console.log("admin usao u index");
			 //index:
			
		}else if(window.location.pathname.split("/").slice(-2, -1)[0] === "post"){
			console.log("admin usao u post");
			//post:
			
			
		}else if(window.location.pathname.split("/").slice(-2, -1)[0] === "user"){
			console.log("admin usao u user");
			//user:
			
		}
		
	}else if(localStorage.getItem('isKomentator')){
		//izgled ako je komenatator:
		//--sortira samo komentare 
		//--komentarise i lajkuje sve
		//--filtrira samo objave
		
		if(window.location.pathname.split("/").pop() === ""){
			console.log("komentator usao u index");
			 //index:
			$("#traziInput").show();
			$("#traziBtn").show();
			
		}else if(window.location.pathname.split("/").slice(-2, -1)[0] === "post"){
			console.log("komentator usao u post");
			//post:
			$("#dropdownMenuButton").show();
			
			$("#lajkujBtn").show();
			$("#dislajkujBtn").show();
			$("#komentarisiBtn").show();
			
			$(".likeCommentButtons").show();
			$(".dislikeCommentsButtons").show();
			
		}else if(window.location.pathname.split("/").slice(-2, -1)[0] === "user"){
			console.log("komentator usao u user");
			$("#kontejnerPostoviUser").hide();
			$("#postBtn").hide();
			
		}
		
	}else if(localStorage.getItem("isObjavljivac")){
		//izgled ako je objavljivac:
		//--azurira samo svoje objave
		//--sortira sve
		//--filtrira samo objave
		
		if(window.location.pathname.split("/").pop() === ""){
			console.log("objavljivac usao u index");
			 //index:
			$("#dropdownMenuButton").show();
			$("#postBtn").show();
			$("#traziInput").show();
			$("#traziBtn").show();
			
		}else if(window.location.pathname.split("/").slice(-2, -1)[0] === "post"){
			console.log("objavljivac usao u post");
			//post:
			$("#dropdownMenuButton").show();
			$("#lajkujBtn").show();
			$("#dislajkujBtn").show();
			$("#komentarisiBtn").show();
			$(".likeCommentButtons").show();
			$(".dislikeCommentsButtons").show();
			
			$("#traziInput").show();
			$("#traziBtn").show();
			
			
		}else if(window.location.pathname.split("/").slice(-2, -1)[0] === "user"){
			console.log("objavljivac usao u user");
			$("#postBtn").hide();
			$("profilBtn").hide();
			//user:
			
		}
		
			
	}
	
	
}