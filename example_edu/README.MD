meteor create mylarapp

meteor add accounts-base
meteor add accounts-password

(create UI to add users, event who call Accounts.createuser)

meteor add mylar:platform

When you create a user (with meteor), the decrypt keys are stored in localStorage['user_princ_keys']. They are kept encrypted with your password in the server.

By default, Meteor does not publish custom fields in Meteor.users, so you need to make a publish/subscription


With this set up, Principal.user() will return the current principal


Don't forget to add:
Mongo.Collection.intercept.init(Data);
After the new Meteor.Collection("foo");


Be careful with the auth fielf in Data._encrypted_fields(...). Put just auth : ['_id'] and it should work.
From what I've seen (and read in the source), the function get_adata iterates on each members of the *encrypted* field. That means:
	- You cannot put in the auth field data that is not available before decryption.
	- You cannot, either, put the field that is being encrypted (that raises an exception somewhere else, probably because of a circular reference since we are trying to authenticate the field with itself).
	- You can only use fields that are available before the decryption AND is not the field we are decryption (if that makes any sense...)

--------------------------------------------

Now, to resist active attackers let's create static principals (instead of a whole IDP):

Principal.create_static(type, name, localStorage.user_princ_keys.toString() , creator, cb) 
