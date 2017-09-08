const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');


const feathers = require('feathers');
const configuration = require('feathers-configuration');

const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const bodyParser = require('body-parser');
const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');
const errorHandler = require('feathers-errors/handler');
const middleware = require('./middleware');

const services = require('./services');
const appHooks = require('./app.hooks');
const hooks = require('feathers-hooks');

const service=require('feathers-sequelize');
const Model=require('./models/backend.model.js');
const user=require('./models/backend.model.js');



const sequelize = require('./sequelize');
const authentication = require('feathers-authentication');
const local = require('feathers-authentication-local');
const jwt = require('feathers-authentication-jwt');
const memory = require('feathers-memory');

const app = feathers();

//const local = require('../lib/index');
// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(sequelize);
app.configure(rest());
app.configure(socketio());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());

app.hooks(appHooks);


 app .configure(authentication({ secret: 'super secret' }))
 app .configure(local())
 app .configure(jwt())
app .use('/users', memory())
 app .use(errorHandler());






// Authenticate the user using the default
// email/password strategy and if successful
// return a JWT.
app.service('authentication').hooks({
  before: {
    create: [
     authentication.hooks.authenticate(['local', 'jwt'])
    ]
  }
});




// Add a hook to the user service that automatically replaces
// the password with a hash of the password before saving it.
app.service('users').hooks({
  before: {
    find: [
      authentication.hooks.authenticate('jwt')
    ],
    create: [
      local.hooks.hashPassword({ passwordField: 'password' })
    ]
  }
});




// Create a user that we can use to log in
const User = {
    name:this.name,
  email:this.email,
  password: this.password,
  access:this.access
};

app.service('users').create(User).then(user => {
  console.log('Created default user', user);
}).catch(console.error);





module.exports = app;
