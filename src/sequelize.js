const Sequelize = require('sequelize');
const Model=require('./models/backend.model.js');
const user=require('./models/backend.model.js');
const post=require('./models/backend.model.js');
const profile=require('./models/backend.model.js');


//const User=require('user');




const service=require('feathers-sequelize');
const handler = require('feathers-errors/handler');

module.exports = function () {
  const app = this;
  const connectionString = app.get("mysql://root:@localhost:3306/backend");
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
  name:"root",
  email:"root",
  logging:console.log,
   password:'',
    database:'backend',

});







//DEFINING MODELS
//user model

const User=sequelize.define('user',{
 name:{
	type:Sequelize.STRING,
	allowNull:true,
	require:true,
},
email:{
	type:Sequelize.STRING,
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
                        done(new Error('Email already registered'));
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
User.sync({alter: true}).then(() => {
return User.create({name:'keneilwe',email:'kksp@gmail.com',password:'123' }).then(user => {
  console.log('Created default user', user);
}).catch(console.error);
});


//user authentication




//Profile MODEL
const Profile=sequelize.define('profile',{
  avatar:{
    type:Sequelize.STRING,
    allowNull:false,
    require:true
  },
  description:{
    type:Sequelize.TEXT,
    allowNull:false,
    require:true
  },
  backgroundphoto:{
    type:Sequelize.STRING,
    allowNull:false,
    require:true
  }
});
//Profile SYNC
 Profile.sync({alter:true})








// Post MODEL
  const Post=sequelize.define('post',{
message:{
    type:Sequelize.TEXT,
    allowNull:false,
    require:true
  },
video:{
    type:Sequelize.STRING,
    allowNull:false,
    require:true
  },
link:{
    type:Sequelize.STRING,
    allowNull:false,
    require:true
  },
  url:{
    type:Sequelize.STRING,
    allowNull:false,
    require:true
  },
})

// Post SYNC
Post.sync({alter:true})







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
}
})
//sync admin
Admin.sync({alter: true})









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
