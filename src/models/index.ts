import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import bcrypt from "bcrypt";


import user from './user';
import store from './store';
import product from './product';
import invoice from './invoice';
import product_log from './product_log';
import category from './category';
import item from './item';
import item_categories from './item_category';
import item_invoice from './item_invoice';
import transaction from './transaction';
import account from './account';


const MAX_RETRIES = 10;
let retries = 0;


dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE!,
  process.env.DB_USERNAME!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    dialect: 'mysql',
    logging: false
  }
);

const db: any = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = user(sequelize)
db.store = store(sequelize);
db.product = product(sequelize);
db.invoice = invoice(sequelize);
db.product_log = product_log(sequelize);
db.category = category(sequelize);
db.item = item(sequelize);
db.item_categories = item_categories(sequelize);
db.item_invoice = item_invoice(sequelize);
db.transaction = transaction(sequelize);
db.account = account(sequelize)


db.user.hasOne(db.store, { foreignKey: 'UserId'})
db.store.belongsTo(db.user, { foreignKey: 'UserId'});

db.store.hasMany(db.product, { foreignKey: 'StoreId'})
db.product.belongsTo(db.store, { foreignKey: 'StoreId'});

db.user.hasMany(db.product_log, { foreignKey: 'UserId'})
db.product_log.belongsTo(db.user, { foreignKey: 'UserId'});

db.user.hasOne(db.invoice, {
  foreignKey: 'RecipientId',
});
db.invoice.belongsTo(db.user, {
  foreignKey: 'RecipientId',
  as: 'recipient'
});

db.account.hasMany(db.transaction, { foreignKey: 'AccountId'})
db.transaction.belongsTo(db.account, { foreignKey: 'AccountId'});

db.user.hasMany(db.invoice, { foreignKey: 'UserId'})
db.invoice.belongsTo(db.user, { foreignKey: 'UserId'});

db.product.hasMany(db.item, { foreignKey: 'ProductId'});
db.item.belongsTo(db.product, { foreignKey: 'ProductId'});

db.item.belongsToMany(db.category, { through: 'item_categories', foreignKey: 'ItemId' });
db.category.belongsToMany(db.item, { through: 'item_categories', foreignKey: 'CategoryId' });

db.invoice.belongsToMany(db.item, { through: 'item_invoice', foreignKey: 'InvoiceId' });
db.item.belongsToMany(db.invoice, { through: 'item_invoice', foreignKey: 'ItemId' });
  
  async function connectWithRetry() {
    while (retries < MAX_RETRIES) {
      try {
        await sequelize.authenticate();
        console.log("✅ Database connection has been established successfully.");
          
         sequelize.sync({ alter: true, force: false })
        .then(() => {
          console.log("📦 Database synced with models.");
          seedUser();
        })
        .catch((error: any) => {
          console.error('Unable to sync the database:', error);
        });

        break;
      } catch (err: any) {
        console.error("❌ Unable to connect to the database:", err.message);
        retries++;
        console.log(`🔁 Retrying (${retries}/${MAX_RETRIES}) in 5 seconds...`);
        await new Promise(res => setTimeout(res, 5000));
      }
    }
  
    if (retries === MAX_RETRIES) {
      console.error("❌ Max retries reached. Exiting...");
      process.exit(1); // or throw an error depending on how you want to handle it
    }
  }
  
  connectWithRetry();
  
// sequelize.sync({ alter: true, force: false })
// .then(() => {
//   console.log('All data in sync');
// })
// .catch((error: any) => {
//   console.error('Unable to sync the database:', error);
// });

// sequelize.authenticate().then(() => {
//   console.log('Connection has been established successfully.');
//   seedUser();
// }).catch((error: any) => {
//   console.error('Unable to connect to the database:', error);
// });



async function seedUser() {
  const transaction = await db.sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash("numlock11", 10);

    const existingUser = await db.user.findOne({ where: { username: "techadmin" } });
    if (!existingUser) {
      await db.user.create({
        username: "techadmin",
        phone: "0544069203",
        password: 'numlock11',
        role: "admin",
      });
    }

    console.log("Default user seeded!");
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}


export default db;
