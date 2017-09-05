// Initializes the `backend` service on path `/backend`
const createService = require('feathers-sequelize');
const createModel = require('../../models/backend.model');
const hooks = require('./backend.hooks');
const filters = require('./backend.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');
  const user=app.get('user');
  const profile=app.get('profile');
  const post=app.get('post');

  const options = {
    name: 'backend',
    Model,
    Paginate:{
      default: 2,
      max: 4
    },
    user:{
    name:'root',
      email:'root',
  password:''
    },
    profile:{ 
      avatar:'root',
  description:'root',
  backgroud:'root'
},
      
    post:{
  message:'root',
  link:'root',
  url:'root',
 video:'root'
  }
}


  // Initialize our service with any options it requires
  app.use('/backend', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('backend');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
