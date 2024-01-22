import Sequelize from 'sequelize'
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

const db = new Sequelize(process.env.BD_NOMBRE,process.env.BD_USER,process.env.BD_PASS, {
    host: process.env.BD_HOST,
    port: 3307,
    dialect: 'mysql',
    define: {
            timestamps: true
    },
    pool: {
        max: 3,
        min: 1,
        acquire:30000,
        idle: 20000,
        evict: 15000
    },
    operatorAliases: false
});
export default db;