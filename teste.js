import dotenv from 'dotenv';

dotenv.config();

const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const dbName = process.env.DATABASE_NAME;

console.log(user, password, dbName);