A beta node.js/browser sdk for the revstack api.

## Quick start

## Install
git clone https://github.com/tachyon1337/revstack.git

cd revstack

npm install

## Gulp Tasks

gulp build  -- builds revstack.js and minified revstack.min.js

gulp dev  --runs a local dev project as /dev and http://localhost:9000



## Browser
Revstack.appId='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
Revstack.id='id';

//datastore

revstack.token=sessionStorage.getItem('token');

var revstack=new Revstack({token:token});

//get all

revstack.datastore.get({},'myClass',function(err,data){

   console.log(data);

});

//get by id

  revstack.datastore.get({id:xxxx},function(err,data){

  console.log(data);

});



## Node

var revstack=require('revstack');
Revstack.appId='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

Revstack.id='id';

var revstack=new Revstack();


//login

revstack.user.login.get({

  username:'user',

  password:'pass'

 },function(err,data){

    console.log(data.token);

});

//post new model

var revstack=new Revstack({token:token});

var model=Object.create(null);

model['@class']='MyClass';

model.name='xxxx';

model.address='xxxx xxxxxxx xxxx';

revstack.datastore.post(model,function(err,data){

   console.log(data);

});