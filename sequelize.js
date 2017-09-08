const Sequelize = require('sequelize');
const Model=require('./models/backend.model.js');
const user=require('./models/backend.model.js');
const post=require('./models/backend.model.js');
const profile=require('./models/backend.model.js');
const errorHandler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');
const middleware = require('feathers-permissions').middleware;
const passport = require('passport');
const local = require('passport-local');







const service=require('feathers-sequelize');
const handler = require('feathers-errors/handler');

module.exports = function () {
  const app = this;
  const connectionString = app.get("mysql://root:@localhost:3306/backend");
  const sequelizeAttributeRoles = require('sequelize-attribute-roles');
   const config=  {
     "define": {
          "underscored": true
        }
    }
  
  const sequelize = new Sequelize ({
  host:'localhost',
  dialect: 'mysql',
  port:3306,
  username:'root',
  rolename:'user,admin',
  name:'req.body.name',
  email:"req.body.email",
  logging:console.log,
  password:'',
  database:'backend',

});







//DEFINING MODELS
//user model
sequelizeAttributeRoles(sequelize);
const User=sequelize.define('user',{
 name:{
	type:Sequelize.STRING,
	allowNull:true,
	require:true,
},
email:{
	type:Sequelize.STRING,
  access:{
    self:true

},
	allowNull:false,
	require:true,
	validate:{
		isEmail:true,
    isUnique:  function (email, done) {
            User.find({ where: { email: email }})
                .done(function (err, user) {
                    if (err) {
                        done(err);
                    }
                    if (user) {
                        done(new Error('Email already registered,try a different email'));
                    }
                    done();
                });
    }
    }
},
password:{
	type:Sequelize.STRING,
	allowNull:false,
	require:true,
  }
});












//sync user
User.sync({alter: true})
.then(() => {
return User.create({name:this.name,email:this.email,password:this.password}).then(user => {
 console.log('Created new user', user);
}).catch(console.error);
});










//queries
// Guard attributes of an individual model 
sequelizeAttributeRoles(User);

User.find({role: 'self'}) 





//admin model
 const Admin=sequelize.define('admin',{
  name:{
    type:Sequelize.STRING,
    allowNull:false,
    require:true
  },
  password:{
	type:Sequelize.STRING,
	allowNull:false,
	require:true,
	validate:{
		is:["^[a-z+$",'1'],
    
	}
},
email:{
  type:Sequelize.STRING,
  isEmail:true,
  access:{
    admin:true,
  }
}
});

const admin=new Admin({
  name:this.name,
  email:this.email,
  password:this.password,
  access:this.access

})

//sync admin

Admin.sync({ alter: true }).then(() => {
  // Create a dummy Message
return Admin.create({name:this.name,email:this.email,password:this.password}).then(admin => {
 console.log('Created new user', admin);
}).catch(console.error);
});


//queries
// Guard attributes of an individual model 
sequelizeAttributeRoles(Admin);
Admin.find({role: 'admin'}) // Will include email but not password 













//Profile MODEL
const Profile=sequelize.define('profile',{
  names:{
    type:Sequelize.STRING,
    allowNull:true,
    require:true
  },
  avatar:{
    type:Sequelize.STRING,
    allowNull:true,
    require:true
  },
  description:{
    type:Sequelize.TEXT,
    allowNull:true,
    require:true
  },
  backgroundphoto:{
    type:Sequelize.STRING,
    allowNull:true,
    require:true
  }
});

const profile=new Profile({
  names:this.names,
  avatar:this.avatar,
description:this.description,
backgroundphoto:this.backgroundphoto
})


//Profile SYNC
Profile.sync({ alter: true }).then(() => {
  // Create a dummy Message
return Profile.create({name:this.name,avatar:this.avatar,description:this.description,backgroundphoto:this.backgroundphoto}).then(profile => {
 console.log('Created new user', profile);
}).catch(console.error);
});






// Post MODEL
  const Post=sequelize.define('post',{
userpost:{
    type:Sequelize.TEXT,
    allowNull:false,
    require:true
  },
video:{
    type:Sequelize.STRING,
    allowNull:true,
    require:true
  },
link:{
    type:Sequelize.STRING,
    allowNull:true,
    require:true
  },
  url:{
    type:Sequelize.STRING,
    allowNull:true,
    require:true
  },
})


const post=new Post({
  userpost:this.userpost,
  video:this.video,
  link:this.link,
  url:this.url
})





// Post SYNC



Post.sync({ alter: true }).then(() => {
  // Create a dummy Message
 
return Post.create({userpost:this.userpost,video:this.video,link:this.link,}).then(post => {
 console.log('Created new user', post);
}).catch(console.error);
});











 const oldSetup = app.setup;

 app.set('sequelizeClient', sequelize);
app.use(handler());
//app.use('/backend',service({Model}));
//app.use('/backend',service({User}));
app.use('/backend',service({Model,user,post,profile}))



  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships


  


 // Sync to the database
    sequelize.sync();

sequelize
.authenticate()
.then(() => {
	console.log('connection has been established successfully.');
})
.catch(err =>{
	console.log.error('unable to connect to the database:',err);
});






    return result;
  };
};
