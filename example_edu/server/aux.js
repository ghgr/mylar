removeUsers = function()
{
	Meteor.users.remove({});
}

removePrincipals = function()
{
	Principals.remove({});
}

removeData = function()
{
	if (typeof Data !== 'undefined')
	{
		Data.remove({});
	}
}

removeAll = function()
{
	removeUsers()
	removePrincipals();
	removeData();
}



showUsers = function()
{
	console.log(Meteor.users.find().fetch());
}

showPrincipals = function()
{
	console.log(Principals.find().fetch());
}

showData = function()
{
	if (typeof Data !== 'undefined')
	{
		console.log(Data.find().fetch());
	}
}

showAll = function()
{
	showUsers()
	showPrincipals();
	showData();
}
