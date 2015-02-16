Template.loadUserPrincipal.events({

	'submit form' : function(e)
	{
		e.preventDefault();
		var mail = e.target.mail.value;
		console.log(mail);
		Principal.lookupUser(mail, function(ppal)
		{
			userPrincipal = ppal;
			console.log("principal loaded succesfully in userPrincipal");
		});
	}
});

Template.main.helpers({
	'username' : function()
	{
		return Meteor.user();
	}
});

Template.logout.events({
	'click button' : function()
	{
		Meteor.logout();
	}
});

Template.createPrincipal.events({
	'click button' : function()
	{
		Principal.create("tipo_del_principal", "nombre_del_principal", Principal.user(), function (ppal) 
		{
			global_principal = ppal;
			console.log("Principal creado en global_principal!");
		});
	}
});

Template.createUser.events({

	'submit form' : function(e)
	{
		e.preventDefault();
		var user = e.target.username.value;
		var mail = e.target.email.value;
		var pass = e.target.password.value;
		console.log(user);
		console.log(mail);
		console.log(pass);


		Accounts.createUser({username: user, email: mail, password: pass}, function (error)
		{
			if (error)
			{
				console.log("ERROR EN USUARIO");
			}else
			{
				console.log("USUARIO CREADO CON EXITO");
			}

		});
	},

});


Template.insertData.events({

	'click button' : function(e)
	{
		Data.insert(
		{
			hora : new Date().getTime()/1000.0,
			campo_del_principal : global_encrypt_principal.id
		});
		console.log(Data.find().count()+" elements in DB");
	}

});

Template.loadDataPrincipal.events({

	'click button' : function(e)
	{
		authority = Principals.find().fetch()[0].name; // I AM THE AUTHORITY!
		
		Principal.lookup([new PrincAttr("tipo_del_principal", "nombre_del_principal")],authority, function (ppal)
		{
			global_encrypt_principal = ppal;
			console.log("Data encryption principal successfully loaded in global_encrypt_principal");
		});
	}

});

Template.login.events({

	'submit form' : function(e)
	{
		e.preventDefault();
		var user = e.target.username.value;
		var pass = e.target.password.value;
		console.log(user);
		console.log(pass);


		Meteor.loginWithPassword(user, pass);
	},

});

Template.giveAccessTo.events({

	'click button' : function(e)
	{
		console.log("Authorizing userPrincipal to global_encrypt_principal");
		
		Principal.add_access(userPrincipal,global_encrypt_principal, function()
		{
			console.log("EXITO");
		});
		
	},

});
