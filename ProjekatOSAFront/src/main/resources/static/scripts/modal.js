//Modals
var modalZaIzmenuDodavanjeObjave = null;
var modalZaIzmenuDodavanjeKomentara = null;
var modalZaIzmenuDodavanjeKorisnika = null;

var tags = null;

$(document).ready(function(){
	
	//kesiraj tagove za posle:
	makeCall("http://localhost:8080/news-api/tags/", "GET").then(function(respJson){
		 console.log(respJson);
		 tags = respJson;
	}, function(reason){
		 //showError();
		console.log(reason);
	});
	
	
	
	//otvaranja
	$("#homeBtn").click(function() {
		window.location.href = "http://localhost:8081";
	});
		
	//loginModal
	$("#loginBtn").click(function() {
		$('#loginModal').modal('show');
	});
	
	//registerModal
	$("#registerBtn").click(function() {
		let user = {};
		modalZaIzmenuDodavanjeKorisnika = new UserModal(user, "dodavanje");
	});
	
	
	//modal post
	$("#postBtn").click(function() {
		let post = {};
		modalZaIzmenuDodavanjeObjave = new PostModal(post, "dodavanje");
	});
	
	
	//modal komentara
	$("#komentarisiBtn").click(function() {
		//$('#komentarisiModal').modal('show');
		let id = getQueryVariable();
		let comment = {postId : id};
		modalZaIzmenuDodavanjeKomentara = new CommentModal(comment, "dodavanje");
	});
	
	

	
	//Submits:
	
	//Create post
	$("#btnCreatePost").click(function() {
		modalZaIzmenuDodavanjeObjave.submit();
	});
	
	
	//Create comment
	$("#btnKomentarisi").click(function(){
		modalZaIzmenuDodavanjeKomentara.submit();
	});
	
	//Create user
	$("#registerSubmit").click(function(){
		let ime = $("#userInputIme").val();
		let korisnicko = $("#userInputKorisnicko").val();
		let lozinka = $("#userInputLozinka").val();
		let slika = $("#userInputURLSlike").val();
		
		if(ime === "" || korisnicko === "" || lozinka === "" || slika === ""){
			$('#nekompletniPodaciModal').modal('show');
		}else{
			modalZaIzmenuDodavanjeKorisnika.submit();
		}
		
		
		
	});
	
	
	
	//submit login
	$("#submitLoginBtn").click(function() {
		let username = $("#korisnickoInput").val();
		let password = $("#lozinkaInput").val();
		
		if(username === "" || password === ""){
			$('#nekompletniPodaciModal').modal('show');
		}else{
			login(username, password, function(data, status){
				if (status === "success"){
					afterLogin(data);
					$('#loginModal').modal('hide');
				}
			});
		}
		
		
		
		
	});
	
	
	
	
});




function gatherAndSendComment(title, desc, postId){
	
	let date = new Date();
	let likes = 0;
	let dislikes = 0;
	let post = postId;
	//session
	let user = 1;
	
	let comment = sendableComment(title, desc, date, likes, dislikes, post, user);
	
	sendData(URLCreateComment, "POST", comment).then(function(respJson){
		 //console.log(respJson)
		 $('#komentarisiModal').modal('hide');
		 $("#commentTitleInput").val('');
		 $("#commentDescriptionInput").val('');
		 
		 
		 
		 if(window.location.pathname.split("/").pop() === "admin"){
			 //radi na admin strani
		 }else{
			 //radi na index strani
			 dodajKomentar(respJson);
			 fillComments(loadedComments);
			 let brojKomentaraUpdate = parseInt($("#brojKomentara").text()) + 1;
			 fillBrojKomentara(brojKomentaraUpdate);
		 }
		 
		 
		 
		}, function(reason){
		 //showError("Greska", reason.status);
		 console.log(reason);
	});
	
}

class PostModal{
	
	constructor(post, operacija){

		this.post = post;
		this.operacija = operacija;
		
		this.modal = $("#createPostModal");
		
		
		$("#postTitleInput").val(this.post.title);
		$("#postDescriptionInput").val(this.post.description);
		$("#postTextInput").val(this.post.photo);
		
		
		//--------------------------------------------------
		//pripremi tagove (SVE):
		
		$("#tagFormGroup").empty();
		
		
		$("#tagFormGroup").append("<label>Tagovi:</label>");
		
		let tagIds = [];
		
		$.each(post.tags, function(index, item){
			tagIds.push(item.id);
		})
		
		//prikazi sve
		$.each(tags, function(index, item){
			$("#tagFormGroup").append(
					'<div class="checkbox">'+
			          '<label>'+
			            '<input type="checkbox" value="tagCheckbox" data-id = "'+ item.id +'" data-name = "'+ item.name +'">&nbsp;'+ item.name +'</label>'+
			        '</div>'
			);
			//tagIds.push(item.id);
		})
		
		
		//obelezi one koji pripadaju postu:
		$.each($('input[type="checkbox"][value = "tagCheckbox"]'), function(index, item){
			
			if(tagIds.includes($(this).data("id"))){
				$(this).prop('checked',true);
			}
			
			//get:
			//console.log($(this).prop("checked")); //true/false
		})
		
		
		//-------------------------------------------
		this.modal.modal('show');
		
		
	}
	
	hide(){
		this.modal.modal('hide');
	}
	
	
	dodajObjavu(){
		let self = this;
		this.prikupiInformacije(function(){
			sendData(URLCreatePost, "POST", JSON.stringify(self.post)).then(function(respJson){
			
				if(window.location.pathname.split("/").pop() === "admin"){
					self.osveziAdmin(respJson);
				}else if(window.location.pathname.split("/").slice(-2, -1)[0] === "user"){
					self.osveziUser(respJson);
				 }else{
					self.osveziIndex(respJson); 
				 }
			}, function(reason){
				//showError("Greska", reason.status);
				console.log(reason);
				
			});
		})
	}
	
	izmeniObjavu(){
		let self = this;
		this.prikupiInformacije();
		let urlIzmeni = URLEditPost(self.post.id);
		sendData(urlIzmeni, "PUT", JSON.stringify(self.post)).then(function(respJson){
			if(window.location.pathname.split("/").pop() === "admin"){
				self.osveziAdmin(respJson);
			}else if(window.location.pathname.split("/").slice(-2, -1)[0] === "user"){
				self.osveziUser(respJson);
			 }
			
		}, function(reason){
			//showError("Greska", reason.status);
			console.log(reason);
		
		});
		
	}
	
	nadjiLokaciju(callback){
		navigator.geolocation.getCurrentPosition(function(location){
			let longitude = location.coords.longitude;
			let latitude = location.coords.latitude;
			callback(longitude, latitude)
		}, function(error){	
			let longitude = 0.0;
			let latitude = 0.0;
			callback(longitude, latitude);
			
		});
	}
	
	prikupiInformacije(callback){
		let self = this;
		if (this.operacija === "izmena"){		
			self.post.title = $("#postTitleInput").val();
			self.post.description = $("#postDescriptionInput").val();
			self.post.photo = $("#postTextInput").val();
			
			//tags:
			$.each($('input[type="checkbox"][value = "tagCheckbox"]'), function(index, item){
				if($(this).prop("checked")){
					self.post.tags.push({"id" : $(this).data("id")  , "name" : $(this).data("name")});
				}
			})
			
			console.log(self.post.tags);
			
			
		}else if (this.operacija === "dodavanje"){
			this.nadjiLokaciju(function(longitude, latitude){
				self.post.longitude = longitude;
				self.post.latitude = latitude;
				
				self.post.title = $("#postTitleInput").val();
				self.post.description = $("#postDescriptionInput").val();
				self.post.photo = $("#postTextInput").val();
				
				self.post.user = {id: localStorage.getItem('userId')};
				self.post.likes = 0;
				self.post.dislikes = 0;
				self.post.date = new Date();
				self.post.numberOfComments = 0;
				
				//tags:
				$.each($('input[type="checkbox"][value = "tagCheckbox"]'), function(index, item){
					if($(this).prop("checked")){
						self.post.tags.push({"id" : $(this).data("id")  , "name" : $(this).data("name")});
					}
				})
				
				
				callback();

			});
		
		}
		
		
	}
	
	submit(){
		if($("#postTitleInput").val() === "" || $("#postDescriptionInput").val() === "" || $("#postTextInput").val() === ""){
			$('#nekompletniPodaciModal').modal('show');
		}else{
			if (this.operacija === "dodavanje"){		
				this.dodajObjavu();
				this.hide();
				
			}else if (this.operacija === "izmena"){
				this.izmeniObjavu();
				this.hide();
				
			}else{
				return;
			}
		}
		
		
		
		
	}
	
	osveziAdmin(post){
		if (this.operacija === "dodavanje"){		
			ucitaneObjave.push(post);
			ucitajObjave();
			
		}else if (this.operacija === "izmena"){
			insertChangedPost(post, ucitaneObjave);
			ucitajObjave();
			
		}else{
			return;
		}
	}
	
	osveziIndex(post){
		loadedPosts.push(post);
		showPosts(loadedPosts);
	}
	
	osveziUser(post){
		if (this.operacija === "dodavanje"){		
			ucitaneObjave.push(post);
			ucitajObjave();
			
		}else if (this.operacija === "izmena"){
			insertChangedPost(post, ucitaneObjave);
			ucitajObjave();
			
		}else{
			return;
		}
	}
	
	
}


class CommentModal{
	
	constructor(comment, operacija){
		//console.log(comment);
		this.comment = comment;
		this.operacija = operacija;
		
		this.modal = $("#komentarisiModal");
		
		
		$("#commentTitleInput").val(this.comment.title);
		$("#commentDescriptionInput").val(this.comment.description);
		
		
		this.modal.modal('show');
	}
	
	hide(){
		this.modal.modal('hide');
	}
	
	dodajKomentar(){
		var self = this;
		this.prikupiInformacije();
		sendData(URLCreateComment, "POST", JSON.stringify(this.comment)).then(function(respJson){
			if(window.location.pathname.split("/").pop() === "admin"){
				self.osveziAdmin(respJson);
			 }else{
				 self.osveziPost(respJson); 
			 }
			console.log(respJson);
		}, function(reason){
			//showError("Greska", reason.status);
			console.log(reason);
		
		});
		
	}
	
	izmeniKomentar(){
		let self = this;
		this.prikupiInformacije();
		let url = URLEditComment(this.comment.id);
		sendData(url, "PUT", JSON.stringify(this.comment)).then(function(respJson){
			self.osveziAdmin(respJson);
		}, function(reason){
			//showError("Greska", reason.status);
			console.log(reason);
		
		});
	}
	
	prikupiInformacije(){
		if (this.operacija === "dodavanje"){		
			this.comment.title = $("#commentTitleInput").val();
			this.comment.description = $("#commentDescriptionInput").val();
			this.comment.date = new Date();
			this.comment.likes = 0;
			this.comment.dislikes = 0;
			this.comment.user = {id : localStorage.getItem('userId')};
			console.log(this.comment.user);
			
			
		}else if (this.operacija === "izmena"){
			this.comment.title = $("#commentTitleInput").val();
			this.comment.description = $("#commentDescriptionInput").val();
			
		}
	}
	
	
	submit(){
		
		if( $("#commentTitleInput").val() === "" || $("#commentDescriptionInput").val() ===""){
			$('#nekompletniPodaciModal').modal('show');
		}else{
			if (this.operacija === "dodavanje"){		
				this.dodajKomentar();
				this.hide();
				
			}else if (this.operacija === "izmena"){
				this.izmeniKomentar();
				this.hide();
				
			}else{
				return;
			}
		}
		
		
	}
	
	osveziAdmin(comment){
		if (this.operacija === "dodavanje"){		
			ucitaniKomentari.push(comment);
			//ucitajKomentare();
			
		}else if (this.operacija === "izmena"){
			insertChangedComment(comment, ucitaniKomentari);
			ucitajKomentare();
			
		}else{
			return;
		}
	}
	
	osveziPost(comment){
		dodajKomentar(comment);
		fillComments(loadedComments);
		let brojKomentaraUpdate = parseInt($("#brojKomentara").text()) + 1;
		fillBrojKomentara(brojKomentaraUpdate);
	}
}

class UserModal{
	
	constructor(user, operacija){
		this.user = user;
		this.operacija = operacija;
		
		this.modal = $("#registerModal");

		this.name = $("#userInputIme").val(this.user.name);
		this.username = $("#userInputKorisnicko").val(this.user.username);
		this.password = $("#userInputLozinka").val(this.user.password);
		this.photo = $("#userInputURLSlike").val(this.user.photo);
		
		//Kada gost treba da se registruje, na raspolaganju nema ulogu jer moze da se registruje samo kao komentator
		//Jedino administrator moze da ga unapredi u objavljivaca ili administratora i uopste menja uloge
		
		/*
		//----------------------------------------------------
		//resetuj checkbox-ove
		$("#checkAdmin").prop('checked', false);
		$("#checkObjavljivac").prop('checked', false);
		//setuj checkbox
		$.each(user.roles, function(index, item){
			if(item.roleName === "ADMINISTRATOR"){
				$("#checkAdmin").prop('checked', true);
			}else if(item.roleName === "OBJAVLJIVAC"){
				$("#checkObjavljivac").prop('checked', true);
			}
		})
		//--------------------------------------------------
		*/
		
		if(window.location.pathname.split("/").pop() === "admin"){
			//ako je na adminu daj mu sve role:
			$("#checkAdmin").prop('checked', false);
			$("#checkObjavljivac").prop('checked', false);
			//setuj checkbox
			$.each(user.roles, function(index, item){
				if(item.roleName === "ADMINISTRATOR"){
					$("#checkAdmin").prop('checked', true);
				}else if(item.roleName === "OBJAVLJIVAC"){
					$("#checkObjavljivac").prop('checked', true);
				}
			})
			
		}else{
			//u svakom drugom slucaju skloni sve role, pri kreiranju se kreira sa komentatorom, 
			//a pri izmeni ostaje uloga koja je:
			
			//sakri:
			
			$("#roleCkeckboxRoleGroup").hide();
			//$("#checkAdmin").hide();
			//$("#checkObjavljivac").hide();
			
		}
		
		console.log(this.user);
		
		
		//ovo svakako:
		this.modal.modal('show');
	}
	
	hide(){
		this.modal.modal('hide');
	}
	
	dodajKorisnika(){
	
		let self = this;
		this.prikupiPodatke();
		console.log(JSON.stringify(self.user));
		sendData("http://localhost:8080/register","POST", JSON.stringify(self.user)).then(function(respJson){
			self.osveziAdmin(respJson);
			console.log(respJson);
		}, function(reason){
			//showError("Greska", reason.status);
			console.log(reason);
		});
	}
	
	izmeniKorisnika(){
		this.prikupiPodatke();
		let self = this;
	
	
		console.log(JSON.stringify(self.user));
		sendData(URLEditUser,"PUT", JSON.stringify(self.user)).then(function(respJson){
			//self.osveziAdmin(respJson);
			//console.log(respJson);
			//console.log("Uspeo request");
			
			//osvezi user-a i admina tamo gde je on a ne na tabeli
			if(window.location.pathname.split("/").pop() === "admin"){
				if(self.user.id == currentAdmin.id){
					//ako sebe menja osvezi samo na profilu
					self.osveziUser(respJson);
				}else{
					//ako menja drugog osvezi u tabeli
					self.osveziAdmin(respJson);
				}
					
			}else if(window.location.pathname.split("/").slice(-2, -1)[0] === "user"){
				self.osveziUser(respJson);
			 }
			
		}, function(reason){
			//showError("Greska", reason.status);
			console.log(reason);
		});
		
		
		
	}
	
	prikupiPodatke(){
		

		
		this.user.name = $("#userInputIme").val();
		this.user.username = $("#userInputKorisnicko").val();
		this.user.password = $("#userInputLozinka").val();
		this.user.photo = $("#userInputURLSlike").val();
		
		/*
		//---------------------------------------------
		let admin = $("#checkAdmin").prop('checked');
		let objavljivac = $("#checkObjavljivac").prop('checked');
		let roles = [];
		if(admin === true){
			roles.push({"id":1,"roleName":"ADMINISTRATOR"});
		}else if(objavljivac === true){
			roles.push({"id":2,"roleName":"OBJAVLJIVAC"});
		}
		this.user.roles = roles;
		//----------------------------------------------------
		*/
		
		let roles = [];
		
		
		
		
		
		
		if(window.location.pathname.split("/").pop() === "admin"){
			let admin = $("#checkAdmin").prop('checked');
			let objavljivac = $("#checkObjavljivac").prop('checked');
			
			if(admin === true){
				roles.push({"id":1,"roleName":"ADMINISTRATOR"});
			}else if(objavljivac === true){
				roles.push({"id":2,"roleName":"OBJAVLJIVAC"});
			}
			this.user.roles = roles;
		}else{
			//ako kreira nema nikakvih uloga
			if(this.user.roles == undefined){
				roles.push({"id":3,"roleName":"KOMENTATOR"});
			//ako ih vec ima, znaci da menja, daj mu njegove
			}else{
				roles.push(this.user.roles);
			}
			this.user.roles = roles;
		}
		
	

		
		
	}
		
	submit(){
		
		if( this.name.val() === "" || 
			this.username.val() === "" ||						
			this.password.val() === "" ||
			this.photo.val() === ""){
				$('#nekompletniPodaciModal').modal('show');
		}else{
			if (this.operacija === "dodavanje"){		
				this.dodajKorisnika();
				this.hide();
				
			}else if (this.operacija === "izmena"){
				this.izmeniKorisnika();
				this.hide();
				
			}else{
				return;
			}
		}
	}
	
	osveziAdmin(user){
		if (this.operacija === "dodavanje"){		
			ucitaniKorisnici.push(user);
			ucitajKorisnike();
			
		}else if (this.operacija === "izmena"){
			insertChangedUser(user, ucitaniKorisnici);
			ucitajKorisnike();
			
		}else{
			return;
		}
	}
	
	
	osveziUser(korisnik){
		$("#userImePrezime").html(korisnik.name);
		
		
		let uloge = [];
		 $.each(korisnik.roles, function(index, uloga){
			 uloge.push(uloga.roleName);
		 })
		

		$("#userUloge").html(uloge);
		$("#userKorisnicko").html(korisnik.username);
		$("#userSlika").attr('src',korisnik.photo);
	}
	
	
}






