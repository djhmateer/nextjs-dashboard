// import bcrypt from 'bcrypt';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
// const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { ssl: 'require' });

// new db instance
// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { ssl: 'require' });
// const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { ssl: 'require',
  // connect_timeout: 10,
  // idle_timeout: 10,
//  });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  // sql begin is a transaction begin
  // const result = await sql.begin((sql) => [

  // Drop all existing tables
  console.log('dropping schema');
  await sql`DROP SCHEMA public CASCADE;`;
  console.log('dropped schema');

  console.log('creating schema');
  await sql`CREATE SCHEMA public;`;
  console.log('created schema');
  // this works (no transaction)
  // let result = await sql`
  //   CREATE TABLE IF NOT EXISTS users11 (
  //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  //     name VARCHAR(255) NOT NULL,
  //     email TEXT NOT NULL UNIQUE,
  //     password TEXT NOT NULL
  //   );`

  // return Response.json({ message: 'Foo' });
  // console.log('users:', result);


  // sql begin is a transaction begin
  
  console.log('begin transaction');
  try {
    const foo = 1
    const result = await sql.begin((sql) => [
      seedUsers(),
      seedCustomers(),
      // fails with prepare statement "asdf" does not exist (for all 3 'transactions')
      seedInvoices(),
      seedRevenue(),
    ]);

  console.log('end transaction');


  // this works (under a transaction)
  // await sql.begin((sql) => [
  //   sql`
  //   CREATE TABLE IF NOT EXISTS users2 (
  //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  //     name VARCHAR(255) NOT NULL,
  //     email TEXT NOT NULL UNIQUE,
  //     password TEXT NOT NULL
  //   );
  // `]);



    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.log('error', error);
    return Response.json({ error }, { status: 500 });
  }
}
