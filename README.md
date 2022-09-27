## A CS348 Project

### Getting Started (frontend)

1. Ensure you are using node -v18

2. Now run the following

```{bash}
cd frontend
yarn
npm run dev
```

3. Open `http://localhost:3000` in your browser

### Getting Started (backend)

1. Ensure you are using node -v18

2. Now run the following

```{bash}
cd backend
yarn
npm run dev
```

3. Open `http://localhost:8000` in your browser

### Getting Started (db)

1. Ensure you are running wsl with docker desktop installed and running. This should also work for Mac, but it has not been tested.

2. Run `docker-compose up` to create a local instance of neo4j

3. Open up `http://localhost:7474` in the browser and login with username: `neo4j` and password: `development`
