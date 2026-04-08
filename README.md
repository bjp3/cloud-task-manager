This is a simple task manager web app built using Next.js. It uses Prisma as the ORM to connect to a database.

# Run on local machine (SQLite)

- Step 1, clone the project and install dependencies

npm i

- Step 2, setup database (SQLite)

Make sure prisma/schema.prisma has:

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

Create a .env file in the root:

DATABASE_URL="file:./prisma/dev.db"

Then run:

npx prisma db push
npx prisma generate

- Step 3, start the app

npm run dev


# Run with AWS RDS (MySQL)

- Step 0, create an RDS MySQL instance and make sure EC2 can connect to it (port 3306 open between them)

- Step 1, update Prisma config

In prisma/schema.prisma:

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

- Step 2, create .env file

DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"

- Step 3, push schema to RDS

npx prisma db push
npx prisma generate

- Step 4, run the app

npm run dev


## Notes

- The app supports creating and deleting tasks
- Prisma is used to manage database tables
- SQLite is used for local testing, MySQL RDS is used for cloud deployment
