# Getting Started

To get started with your project, follow the steps below:
1. Install Redis and MongoDB

Redis and MongoDB are both required to run your project. You can use Docker to easily install both of them. Here's how:

```sh
docker-compose -f docker-compose.dev.yml up -d --no-deps redis mongodb worker
```


This command will start Redis and MongoDB containers using the docker-compose.dev.yml configuration file.

2. Use dummy data
to restore working set data, use the following command
```sh
docker exec -i mongoback sh -c 'mongorestore --archive' < db.dump
```

This command will export the data from the MongoDB container into a db.dump file.

3. Start the development server

Finally, to start the development server, run the following command:

```bash
npm run start:dev
```

This command will start the development server for your project.

Congratulations! You have now successfully installed Redis and MongoDB, loaded dummy data, and started the development server for your project. You can now start working on your project and building out its features.

---
## File processing service
[Microservice for file processing](https://github.com/shanurrahman/molecule_bull_microservice)
Bulk user uploads are handled by a worker process linked above.

```sh
docker-compose -f docker-compose.dev.yml up -d --no-deps worker
```

## Frontend application
1. switch to cdk-drag-drop branch
2. `npm start` for development or `npm run build` for production deployment

use credentials - 
```
username: shanur.cse.nitap@gmail.com
password: password123
```
to login into the app






---
`docker system prune` -> Delete prev images
`docker-compose up -d --build --no-deps main` -> build and restart main server
`docker-compose up -d --build --no-deps worker` -> Build and restart worker



[![Contact me on Codementor](https://www.codementor.io/m-badges/shanurrahman/book-session.svg)](https://www.codementor.io/@shanurrahman?refer=badge)