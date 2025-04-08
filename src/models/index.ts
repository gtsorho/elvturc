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


db.user.hasOne(db.store)
db.store.belongsTo(db.user);

db.store.hasMany(db.product)
db.product.belongsTo(db.store);

db.user.hasMany(db.product_log)
db.product_log.belongsTo(db.user);

db.user.hasOne(db.invoice, {
  foreignKey: 'recipientId',
});
db.invoice.belongsTo(db.user, { as: 'recipient', });

db.user.hasMany(db.invoice)
db.invoice.belongsTo(db.user);

db.product.hasMany(db.item);
db.item.belongsTo(db.product);



db.item.belongsToMany(db.category, { through: 'item_categories' });
db.category.belongsToMany(db.item, { through: 'item_categories' });

db.invoice.belongsToMany(db.item, { through: 'item_invoice' });
db.item.belongsToMany(db.invoice, { through: 'item_invoice' });




  
  async function connectWithRetry() {
    while (retries < MAX_RETRIES) {
      try {
        await sequelize.authenticate();
        console.log("✅ Database connection has been established successfully.");  
        sequelize.sync({ alter: true, force: false })
        .then(() => {
          console.log('All data in sync');
        })
        .catch((error: any) => {
          console.error('Unable to sync the database:', error);
        });
        await seedUser();
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

    const existingUser = await db.user.findOne({ where: { username: "manager.admin" } });
    if (!existingUser) {
      await db.user.create({
        username: "manager.admin",
        phone: "0544069203",
        password: hashedPassword,
        role: "admin",
      });
    }

    console.log("Default user seeded!");
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}


export default db;
