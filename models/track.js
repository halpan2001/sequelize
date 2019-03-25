const sequelize = require('./../database/sequelize');
const Sequelize = require('sequelize');

module.exports = sequelize.define('track', {
  id:{
    field: 'TrackId',
    type:Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    field: 'Name',
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        args: true,
        msg: 'Name is required'
      }
    }
  },
  milliseconds: {
    field: 'Milliseconds',
    type: Sequelize.INTEGER,
    validate: {
      isNumeric:{
        args: true,
        msg: 'Milliseconds must be numeric'
      }
    }
  },
  unitPrice: {
    field: 'UnitPrice',
    type: Sequelize.INTEGER,
    validate: {
      isNumeric: {
        args: true,
        msg: 'Unit price must be numeric'
      }
    }
  }
},{
  timestamps:false
});
