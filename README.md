Bumped versions of Mongo and DDP to avoid package conflicts.


# --- GENERAL INFO ON THE MYLAR PROJECT --- "

# Mylar - ported to Meteor v1.0
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/strikeout/mylar?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## About
Web applications rely on servers to store and process confidential information. However, anyone who gains access to the server (e.g., an attacker, a curious administrator, or a government) can obtain all of the data stored there.

Mylar protects data confidentiality even when an attacker gets full access to servers. Mylar stores only encrypted data on the server, and decrypts data only in users' browsers.

Simply encrypting each user's data with a user key does not suffice, and Mylar addresses three challenges in making this approach work.

- First, Mylar allows users to share keys and data securely in the presence of an active adversary (man in the middle attack or a malicious administrator actively tampering with the data sent to the client)
- Second, Mylar allows the server to perform keyword search over encrypted documents
- Finally, Mylar ensures that client-side application code is authentic, even if the server is malicious.

## Check it out

Just start and examine the example chat
````
    cd example_EncChat/
    meteor

    // => App running at: http://localhost:3000/
````
Create a new User, then create a new room. Hack in a message. Send.

If you now take a look at the local Meteor-MongoDb (with a gui like Robomongo or the meteor mongo-shell, you will see a field named "message_enc" that contains the encryption of the message.
There should be no field "message", which before contained the unencrypted data and will only appear on the client when the message is successfully decrypted.


## Use it

First, read the MIT Mylar paper in /docs/MIT_Mylar.pdf and make sure you understand the section "Building a Mylar application".

Mylar is directly hooking into core packages like DDP, Mongo and the Accounts system to intercept the data stream for truly transparent encryption.
So we can not simply provide Mylar as an Meteor package (right now) - we have to override core packages!

Luckily this is easy with the new package system.

````
    // copy or symlink everything in /packages to
    // your meteor project's packages folder

    // copy
    cp -R packages/* /your/project/packages/

    // symlink - go into your projects package dir, then do this:
    // of course replace "../../packages" with a path to the mylar package dir
     find ../../packages -type d -mindepth 0 -maxdepth 1 -exec ln -s '{}' . \;

````


Look at the /example_EncChat for how to get started with collection declarations.

example_EncChat/model.js (client & server)
````
    //
    Messages._encrypted_fields({
        'message': {
            princ: 'roomprinc',
            princtype: 'room',
            auth: ['_id']
        }
    });
    Messages._immutable({roomprinc: ['rID', 'roomTitle', '_id']});


````

important for the IDP, we need to publish explicitly the _wrapped_pk fields of the user doc (for now)
````
    Meteor.startup(function () {
        // pub
        if (Meteor.isServer) {
            Meteor.publish("users", function () {
                return Meteor.users.find(this.userId, {fields: {}});
            });
        }
        // sub
        if (Meteor.isClient) {
            Tracker.autorun(function () {
                Meteor.subscribe("users");
            })
        }
    })
````

Then go to /docs and also check out /enc_modules for (partially outdated) implementation details.



## Contribution Info

I marked all mylar-related modifications to the core packages ddp and mongo with MYLAR START/END comments for easier merging.
Can we wrap this into a single package overriding the core packages by any chance?


## Enable search & building the enc_server
You'll need the following libraries to build Mylar:

- libreadline
- libgmp
- libpbc
- libcrypto++9


Open a browser and visit localhost:3000 or from a different machine than the server, visit http://<machine-ip>:3000. Have fun with the application!

The app is secured against passive adversaries (adversaries who read all data at the server, but do not actively change information).


To enable search, you need two things:

1. Install the search plugin
In order to use the search plugin, you'll need to build it for your system using the FireBreath framework for Firefox.
You should navigate to enc_modules/crypto_fire and follow the README there in order to set it up.
In addition, there is a binary that works on some systems in the enc_modules/crypto_fire/Binaries/ folder, which you should copy to:
$(HOME)/.mozilla/plugins/, creating the plugins folder if necessary.

2. add the search package to the application
meteor add search



