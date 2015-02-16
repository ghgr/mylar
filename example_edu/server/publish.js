Meteor.publish('userData', function()
{
	
	return Meteor.users.find(this.userId);


	if (!this.userId) 
	{
		return null;
	}
	
	return Meteor.users.find(this.userId,
	{
		fields: 
		{
			permission: 1,
		}
	});
});
