TV SUPREME is a [Next.js](https://nextjs.org) news platform backed by a local MySQL database through Prisma.

## Local MySQL setup

The app reads its database connection from the root `.env` file. The included local configuration targets the existing `supremenews` database on `127.0.0.1:3306`.

For another local MySQL user, password, host, or database, copy `.env.example` to `.env` and update these separate values:

```env
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_DATABASE="supremenews"
MYSQL_USER="YOUR_MYSQL_USER"
MYSQL_PASSWORD="YOUR_MYSQL_PASSWORD"
```

The app uses those values directly at runtime. Prisma creates its required connection string only in memory; a database URL is not stored in `.env`.

Use an `utf8mb4` case-insensitive collation so English, Sinhala, and Tamil content and search behavior work as expected.

```bash
npm install
npm run db:generate
npm run db:validate
npm run dev
```

`npm run db:push` is available only when you intentionally want Prisma to synchronize schema changes to MySQL. It is not needed to use the existing local database.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
