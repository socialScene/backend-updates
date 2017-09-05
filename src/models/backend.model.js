// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
//const Model=require('./models/backend.model.js');
//const user=require('./models/backend.model.js');
const config    = require('config').database;  // we use node-config to handle environments
const authentication = require('feathers-authentication');
const local = require('feathers-authentication-local');
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const backend = sequelizeClient.define('backend', {
    text: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = false;
        options.prety=true;
      }
    },
  });




  
  
app.service('backend').hooks({
  before: {
    find(hook) {
      // Get the Sequelize instance. In the generated application via:
      const sequelize = hook.app.get('sequelizeClient');

      hook.params.sequelize = {
        include: [ User ]
      }
    }
  },
});



var User = function() {
  return function(hook) {

    return hook.app.service('user').find({
      query: {
        userId: hook.result.user.id
      }
    }).then(result => {
       return hook.result.conversation.user = result;
    });
  }
}


app.service('backend').hooks({
  before: {
    find(hook) {
      // Get the Sequelize instance. In the generated application via:
      const sequelize = hook.app.get('sequelizeClient');

      hook.params.sequelize = {
        include: [ Post ]
      }
    }
  }
});

app.service('backend').hooks({
  before: {
    find(hook) {
      // Get the Sequelize instance. In the generated application via:
      const sequelize = hook.app.get('sequelizeClient');

      hook.params.sequelize = {
        include: [ Profile]
      }
    }
  }
});


const authentication = require('feathers-authentication');
const local = require('feathers-authentication-local');
const jwt = require('feathers-authentication-jwt');
const auth = require('feathers-authentication');
const hooks = require('feathers-hooks');
const memory = require('feathers-memory');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const errors = require('feathers-errors');
const errorHandler = require('feathers-errors/handler');

app.configure(authentication());
app.configure(local());
app.configure(jwt())
app .use('/users', memory())
app  .use('/', feathers.static(__dirname + '/public'))
app  .use(errorHandler());

  


app.service('authentication').hooks({
  before: {
    create: [
      // You can chain multiple strategies
      auth.hooks.authenticate(['jwt', 'local'])
    ],
    remove: [
      auth.hooks.authenticate('jwt')
    ]
  }
});

app.service('users').hooks({
  before: {
    find: [
      auth.hooks.authenticate('jwt')
    ],
    create: [
      local.hooks.hashPassword({ passwordField: 'password' })
    ]
  }
});


app.authenticate({
  strategy: 'local',
  email: 'your email',
  password: 'your password'
}).then(response => {
  // You are now authenticated
});


  backend.associate = function (models) { 
    
    // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return backend;
};
