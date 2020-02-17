import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import Deliveryman from '../app/models/Deliveryman';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, Recipient, Deliveryman, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => {
      return model.init(this.connection);
    });
  }
}

export default new Database();
