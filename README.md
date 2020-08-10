# Data Access Model examples

This repository supports the [article](https://medium.com/@shawngrover/data-access-models-with-node-15b0e30807b4) I wrote regarding creating data access models in Node.js.

## Setup

If you'd like to examine and work with this example code, clone or download the repository. Then open a command prompt and change into the project directory. Then run the following commands:

```
npm install
npm run knex migrate:latest
```

This will install the required components. In this case that is only Knex.JS and SQLite3. SQLite is only used for demo purposes here. The article focuses on the `src/models/_model.js` file and how it might be used.

In short, our application services call the data models, and the data models extend the `_model.js` file. The services directory represents what a "real" application may look like, but is just a sample.

## Running the code

1. Make sure the database is set up

```bash
  npm run knex migrate:latest
```

2. Run the application

```bash
node src/index.js
```

3. Check your database

```bash
sqlite3 dev.sqlite3
select * from groups;
select * from tasks;
```

This will result in output that looks something like the following. You can expect the timestamps to be different.

```
1|Group 1|1596959593881
sqlite> select * from tasks;
2|1|automated task|SOME RANDOM VALUE||This is an example task|1596959593908
sqlite>
```

To re-run the code, clear the database first. You can do this quickly by rolling back the database changes and then reapplying them

```
npm run knex migrate:rollback;
npm run knex migrate:latest
```

## LIMITATIONS

The `_model.js` file was created to work with application databases. For this example we use SQLite3, which is not really recommended for production projects.

The `.returning()` method provided by Knex.JS is not supported by SQLite. This prevents us from simply retrieving the inserted or updated records in the `.create()` and `.update()` methods in `_model.js`. The example code in `index.js` reflects this. However, if you were to switch to MySQL, Postgres, MSSQL, etc. then `.returning()` is supported and you would not need to do any extra steps. Drop me a note if this is confusing and I can alter the article or repo accordingly.
