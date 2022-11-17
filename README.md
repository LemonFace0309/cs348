## A CS348 Project

### Getting Started (db)

1. Ensure you are running WSL with docker desktop installed and running with Windows. This should also work for Mac, but it has not been tested.

2. Run `docker-compose up` to create a local instance of Neo4J.

3. Run the following to add permissions back to local import scripts that were changed after running `docker-compose up`.

```{bash}
sudo chmod -R a+rwx scripts/lib/import
```

4. Open up `http://localhost:7474` in the browser and login with username: `neo4j` and password: `development`

5. To get some dummy data, copy and paste the following files in the terminal at the top of the browser application

```
scripts/lib/samples/init-users.cypher
scripts/lib/samples/init-relationships.cypher
scripts/lib/samples/init-tweets.cypher
```

### Getting Started (frontend)

1. Ensure you are using node -v16

2. Now run the following

```{bash}
cd frontend
yarn
yarn dev
```

3. Open `http://localhost:3000` in your browser

### Getting Started (backend)

1. Ensure you are using node -v16

2. Now run the following

```{bash}
cd backend
yarn
yarn dev
```

3. Open `http://localhost:8000/graphql` in your browser
