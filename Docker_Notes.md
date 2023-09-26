# Docker Notes

## Day-1
+ Container:- Container is a collection of resources for a specific process/processes.
+ Image:- Image is the collection of File System(process and its binary) snapshot and run command to start the specific process.

+ When we run the image then the FS snapshot is copied to container and the instance of process is created in container.

+ Override the run command at run time 
```sh
docker run {image_name} run_command/alternate_command

docker run busybox ls
docker run busybox echo "High Command"
```
+ run_command/alternate_command should be present inside the image.

+ See current running container.
```sh
docker ps

docker ps --all
```

+ Below is the overview of the docker container life-cycle.

+ "docker run" is combination of two docker command "docker create" and "docker start".
+ "docker start" will run the run_command.
+ "docker create" will just create the docker image and copy the FS snapshot inside the container.

+ docker create command.
```sh
docker create hello-world
```
+ The above command returns the image id.

+ docker start command.
```sh
docker start -a {image_id}
```
+ If don't use "-a" then we won't see the output of the run_command on our terminal.
+ "-a" inform the docker-client to print the output of the run_command on our terminal.
+ We can start the old container using the start command.
+ But we can't change the run_command of the old container.
```sh
docker start -a {old_container_id} "new_run_command"

docker start -a 2323dwa21 echo bye there
```
+ The above docker command will give error message "you cannot start and attach multiple containers at once."
+ If we stop the container and try to start the same container again then it will use the "old_run_command" that is assigned to it.

+ Deleting the docker container and images completely
```sh
docker system prune
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - all dangling build cache

Are you sure you want to continue? [y/N]
```

+ Docker Logs
+ We can see any logs printed by the container on the terminal while starting the container using docker log command
```sh
  docker logs <container_id>
```

+ Stop Docker Image.
+ We can stop docker container by using two commands "stop" and "kill"
+ Docker stop will stop the container using the signal "SIGTERM", which will all the container to slowly stop the container and perform any clean-up.
```sh
  docker stop <container_id>
```
+ We can also stop the container using the "kill" command.
+ The kill command will immediately stop the container using the "SIGKILL" signal.
+ If within 10s after using the docker stop if container fails to stop then docker will forcefully use the docker kill command.

+ When ever new container is created OS create a new directory with name "<container_id>" under "/var/lib/docker/<container_id>" and all network file, mount files and other setting are stored under this.
+ Docker logs are also stored under this directory only with "<container_id>.json" file.


#### **Custom Docker Image Creation Process**
**IMP Topic**
+ (Refer section 3 of Udemy Course.)

+ First we need to create a docker file.
+ This docker file must have basic 3 steps
  + FROM
  + RUN
  + CMD
+ Note:- docker create a new image and container for every command after **FROM**.
+ Basic working while creating of custom image.
+ At the end of the **FROM** command docker download the image from docker repo or use any docker image locally created.
+ At the start of the **RUN** command docker create a new container called as **intermediate container** using the image from the previous command and execute the command mentioned in the **RUN** as the start-up command for this new container.
+ At the end of the **RUN** command docker takes the snapshot of this container save as a new image and delete this **intermediate container**.
+ At the start of the **CMD** command docker create a new container called as **intermediate container** using the image from the previous command and store the command mentioned in the **CMD** as the start-up command for this new container.
+ At the end of the **CMD** command docker takes the snapshot of this container save as a new image and delete this **intermediate container**.
+ This is a chaining process, 
  1. docker takes the image from the previous command.
  2. create a new container and execute/add the start-up command.
  3. takes the snapshot of the container as a new image.
  4. finally delete the container and pass the image to the next command.
+ So at the end of the DockerFile we have a final custom image that we can use to create a new container.

+ All the above steps are executed when we run docker build command.
```sh
    docker build <"path where docker file is present">
```
+ Once image is created then need to use the image_id that is given by the build command and use docker run command.
```sh
    docker run <image_id>
```
+ Whenever we rebuild the same docker file again the chaining process is not followed by the docker and uses the cache image from the local machine.
+ If sequence of the CMD is changes in Docker file then cache will not work and entire Docker will be build after the change CMD. (Refer section 3 video 38)
+ We can **Tag** the Docker Image using -t flag.
+ The naming convention is "docker_id/project_name:version"
+ Example "rushi1006/redis-server:latest"
```sh
  docker build -t rushi1006/redis-server:latest .
```
+ In above example "latest" is the actual tag.
+ If we have multiple docker file with different tag, then docker will select the latest tag when we create container.
```sh
  docker run rushi1006/redis-server
```
+ In above example which ever the latest docker image is present will be selected unless we mention therushi1006/redis-server:latestrushi1006/redis-server:latestrushi1006/redis-server:latest version.rushi1006/redis-server:latest

+ We cah also create docker image manually using **Docker Commit**
+ First we need to create a container from the base image e.g. alpine and get the shell access using "docker exec" command.
+ Install all the dependencies inside the container.
+ Get the container ID using ps command "docker ps" or "docker ps -a" and execute docker commit command.
```sh
  docker commit -c 'CMD ["echo", "Hello World"]' `1bbf19989bf5` `rushi1006/test_project:10`
```
+ In above command we mention start up command is "echo hello world".
+ "1bbf19989bf5" is the container ID in which we have installed the dependencies.
+ "rushi1006/test_project:10" is the image name(tag) that we can use to create new container.
```sh
  docker run -it rushi1006/test_project:10 
``` 
* NOTE:- First we need to build the image from the Dockerfile and then we can use run command(combination of docker create and docker start).

## Day - 2
#### DOCKER PORT MAPPING
* Mapping of container port with the local machine port is called Docker port mapping.
* We can do port mapping at run time or while creating container.
* For run time we can use below command.
```sh
docker run -p {local_machine_port_number}:{container_port_number} image_name
```
```sh
docker run -p 5000:8080 rushi1006/simpleweb
```
#### CREATING NODE.JS PROJECT USING DOCKER FILE.
* Ideally we should copy all the files related to project into location called **WORKDIR**.
```sh
WORKDIR /usr/app
```
* Now all the commands that we execute will be executed from the **WORKDIR** location.
* If we change the source code of the application then we need to rebuild the docker image to reflect the changes.
* Ideally when we make any changes to the source code all the steps below the **COPY** command is re-executed as we first copy and then do other steps.
* Check step 3 in below snippet.
```sh
# BASE IMAGE
FROM node:14-alpine

WORKDIR /usr/app

# Copy all files into container.
COPY ./ ./

# Install some dependencies
RUN npm install

# Startup Command
CMD ["npm", "start"]
```
```sh
rushi@ubuntu:~/Study/docker-start/simpleweb$ docker build -t rushi1006/simpleweb .
[+] Building 5.4s (9/9) FINISHED                                                                                                      
 => [internal] load .dockerignore                                                                                                0.0s
 => => transferring context: 2B                                                                                                  0.0s
 => [internal] load build definition from Dockerfile                                                                             0.0s
 => => transferring dockerfile: 266B                                                                                             0.0s
 => [internal] load metadata for docker.io/library/node:14-alpine                                                                2.1s
 => [1/4] FROM docker.io/library/node:14-alpine@sha256:434215b487a329c9e867202ff89e704d3a75e554822e07f3e0c0f9e606121b33          0.0s
 => [internal] load build context                                                                                                0.0s
 => => transferring context: 300B                                                                                                0.0s
 => CACHED [2/4] WORKDIR /usr/app                                                                                                0.0s
 => [3/4] COPY ./ ./                                                                                                             0.0s
 => [4/4] RUN npm install                                                                                                        3.2s
 => exporting to image                                                                                                           0.1s
 => => exporting layers                                                                                                          0.1s
 => => writing image sha256:1df2ab63e281302ce9429c137ba7dabfccefd9629c801a80a87de1aef05366d2                                     0.0s 
 => => naming to docker.io/rushi1006/simpleweb
```
* If only source code is update and npm packages are not updated then STEP 4 should not be executed.
* We can achive that by updating the docker image as below.
```sh
# BASE IMAGE
FROM node:14-alpine

WORKDIR /usr/app

# Copy only package.json. So that npm install will not trigger until we update the package.json file.
COPY ./package.json ./

# Install some dependencies
RUN npm install

# Now we can copy the source code and all other files. Even if we are not copying the package.json npm install will not trigger.
# Only step below the COPY command will execute.
COPY ./ ./

# Startup Command
CMD ["npm", "start"]
```
```sh
=> [internal] load .dockerignore                                                                                                0.0s
 => => transferring context: 2B                                                                                                  0.0s
 => [internal] load build definition from Dockerfile                                                                             0.0s
 => => transferring dockerfile: 492B                                                                                             0.0s
 => [internal] load metadata for docker.io/library/node:14-alpine                                                                1.0s
 => [1/5] FROM docker.io/library/node:14-alpine@sha256:434215b487a329c9e867202ff89e704d3a75e554822e07f3e0c0f9e606121b33          0.0s
 => [internal] load build context                                                                                                0.0s
 => => transferring context: 303B                                                                                                0.0s
 => CACHED [2/5] WORKDIR /usr/app                                                                                                0.0s
 => CACHED [3/5] COPY ./package.json ./                                                                                          0.0s
 => CACHED [4/5] RUN npm install                                                                                                 0.0s
 => [5/5] COPY ./ ./                                                                                                             0.0s
 => exporting to image                                                                                                           0.0s
 => => exporting layers                                                                                                          0.0s
 => => writing image sha256:d59653be9d47c384fc4b530b4ec27a03aac00a108fb09e879542f117f34149b1                                     0.0s
 => => naming to docker.io/rushi1006/simpleweb
```


## Day-3
#### DOCKER COMPOSE.
* Docker Compose is a CLI that helps to reduce the docker CLI arguments.
* Example:- Docker Compose Automates some of the long-winded arguments we were passing to 'docker run'
* Docker Compose is used to handle multi-container environment.
* We need to create a docker-compose.yaml file where we will mention our containers configuration.
* Example of Docker compose file
```yml
version: '3'
services:
  redis-server:
    image: 'redis'
  node-app:
    build: .
    ports:
      - "4001:8081"
```
* Key **Services** is treated as containers.
* Key **build** search for the Dockerfile in the current location(Where docker-compose.yaml is present)
* **redis-server** is the name of one container(also know as name of container).
* Same goes for **node-app**.
* Ideally there is no direct communication between containers.
* We have to manually set communication between containers.
* We can use this services names inside application code to directly communicate between services(containers).
```js
const client = redis.createClient(6379, redis-server);
```
* In above case request is forward to docker for **'redis-server'** it will be directed to **'redis-server' service**.
* To start all container we use **docker compose up** command.
* **docker compose up** is similar to **docker run**
* **docker compose up --build** is similar to **docker build and docker run**, it will re-build the containers.
* To run the docker compose command in background we use -d option.
```sh
rushi@ubuntu:~/Study/docker-start/visits$ docker compose up -d
[+] Running 3/3
 ⠿ Network visits_default           Created                                                                                      0.0s  
 ⠿ Container visits-node-app-1      Started                                                                                      0.4s
 ⠿ Container visits-redis-server-1  Started                                                                                      0.5s

```
* We can also execute single container using docker compose command.
```sh
rushi@ubuntu:~/Study/docker-start/visits$ docker compose up -d redis-server
[+] Running 2/2
 ⠿ Network visits_default           Created                                                                                      0.0s
 ⠿ Container visits-redis-server-1  Started                                                                                      0.4s
```
* Once the container is created we use **docker ps** command to see the container id and other information.
* If we want to stop the docker containers using docker compose command we need to down option.
```
rushi@ubuntu:~/Study/docker-start/visits$ docker compose down
[+] Running 3/3
 ⠿ Container visits-node-app-1      Removed                                                                                      0.8s
 ⠿ Container visits-redis-server-1  Removed                                                                                      0.4s
 ⠿ Network visits_default           Removed                                                                                      0.2s
```
* Docker compose official command documentation link. [Documentation](https://docs.docker.com/compose/reference/).
* Docker compose has a restart policy for a specific container.
* Restart policy
  1. no: Never restart the container.
  2. always: Restart the container never it fails.
  3. on-failure: Restart the container only on failure(error code exit).
  4. unless-stopped: Restart the container till forcibly stop it(Human intervention).
```yaml
version: '3'
services:
  redis-server:
    image: 'redis'
  node-app:
    restart: always
    build: .
    ports:
      - "4001:8081"
```
* Below logs show that container node-app was restarted on every failure.
```sh
visits-node-app-1      | 
visits-node-app-1      | > start
visits-node-app-1      | > node index.js
visits-node-app-1      | 
visits-node-app-1      | listening on port 8081
visits-node-app-1 exited with code 0
visits-node-app-1      | 
visits-node-app-1      | > start
visits-node-app-1      | > node index.js
visits-node-app-1      | 
visits-node-app-1      | listening on port 8081
```
* docker ps commands shows the status of all the containers running on the machine.
```sh
rushi@ubuntu:~/Study/docker-start$ docker ps
CONTAINER ID   IMAGE             COMMAND                  CREATED         STATUS         PORTS                                       NAMES
8806fc3f2193   visits_node-app   "docker-entrypoint.s…"   6 minutes ago   Up 5 minutes   0.0.0.0:4001->8081/tcp, :::4001->8081/tcp   visits-node-app-1
2f479634ff15   redis             "docker-entrypoint.s…"   8 minutes ago   Up 6 minutes   6379/tcp                                    visits-redis-server-1
```
* If configuration file(.yaml file) is not present in the current folder then command will fail.
```sh
rushi@ubuntu:~/Study/docker-start$ docker compose ps
no configuration file provided: not found
```
* docker compose ps command only shows the containers running by a docker-compose.yaml file.
```sh
rushi@ubuntu:~/Study/docker-start/visits$ docker compose ps
NAME                    COMMAND                  SERVICE             STATUS              PORTS
visits-node-app-1       "docker-entrypoint.s…"   node-app            running             0.0.0.0:4001->8081/tcp, :::4001->8081/tcp
visits-redis-server-1   "docker-entrypoint.s…"   redis-server        running             6379/tcp
```

## Day - 4
### Docker Volume.
* Storing the the reference of Local files inside container.
* With the help of this we do not need to re-build the container to reflect the changes.
```sh
rushi@ubuntu:~/Study/docker-start/frontend$ docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app rushi1006/frontend-react-dev
```
* The first "-v /app/node_modules" is called as **Bookmark Volume**. We are not passing any local machine file path for reference.
* The volume which will not have reference to a local machine file are called as **Bookmark Volume**. They are treated as place holder.
* **Bookmark volume** are the volume for which we do not map any local machine file.(Inside container ignore those file during mapping).
* The second "-v $(pwd):/app" is referencing to the local directory path(pwd) to "/app" inside the container.
* If we want to build the image with different name other than "Dockerfile" then we need to pass the context(all files and folder need to start the image) and the full path of the Docker_filename.
```sh
rushi@ubuntu:~/Study/docker-start/frontend$ docker run -f Dockerfile.dev .
```
* We can use docker compose to create volumes.
```yaml
version: '3'
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - /app/node_modules
      - .:/app
```
* In case we are using volume, then we ideally do not need to perform any copy operation for same directory/files inside the DockerFile.

### Running Test using docker.
* To run a test first we need to have a container ready.
* Once the container is ready then only we can run our test.
* First we create a container using
```sh
rushi@ubuntu:~/Study/docker-start/frontend$ docker build -f Dockerfile.dev .
```
* Get the container id and then change the run command of the container and attach the interavtive shell.
```sh
rushi@ubuntu:~/Study/docker-start/frontend$ docker exec -it b138ad7a9a50 npm run test
```
* Execution of test inside the container falls under docker.
* The plus of of above method is that we get the interactive shell to interact with the test suits.
* The second approach is that we use docker-compose to create a seperate service(container) and change the run command inside docker-compose file.
```yaml
version: '3'
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - /app/node_modules
      - .:/app
  tests:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - /app/node_modules
      - .:/app
    command: ["npm", "run", "test"]
```
```sh
rushi@ubuntu:~/Study/docker-start/frontend$ docker compose up
.
.
.

frontend-tests-1  | Test Suites: 1 passed, 1 total
frontend-tests-1  | Tests:       2 passed, 2 total
frontend-tests-1  | Snapshots:   0 total
frontend-tests-1  | Time:        0.832s
frontend-tests-1  | Ran all test suites.
frontend-tests-1  | 
frontend-tests-1  | Watch Usage
frontend-tests-1  |  › Press p to filter by a filename regex pattern.
frontend-tests-1  |  › Press q to quit watch mode.
frontend-tests-1  |  › Press Enter to trigger a test run.
frontend-tests-1  |   console.error node_modules/react-dom/cjs/react-dom.development.js:86
```
* In case of second approach we do not get the interactive shell if we use **docker attach** command.
* Watch Section 6 video 76 again.
* Idealy there is no need to attach the interactive shell while running the test suit.
* Ideally second approach is more preferrable for PROD env.
* 
### Multi-Stage Build Process in Docker
* The main purpose of the Multi-Stage Build process is to reduce the docker image size.
* Inside Docker we can multiple FROm statement and the docker image size depends on the last FROM statement.
* In Multi-Stage we should copy all static and src code to into one stage and in the next stage we should have copy and start command.
```docker
FROM node:alpine as stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx
COPY --from=stage /app/build /usr/share/nginx/html
```
* To perform multi-stage we need to use **as** keyword follwed by the name **stage**(The name can be anything).
* We can use multiple **as** to have more stages.
* We need to use name **stage** in the next step.
* Image size difference.
```sh
rushi@ubuntu:~/Study/docker-start/frontend$ docker images
REPOSITORY                     TAG       IMAGE ID       CREATED              SIZE                                                     
rushi1006/single_stage_build   latest    08a05640c5ac   3 seconds ago        339MB
rushi1006/multi_stage_build    latest    fe395032e52c   About a minute ago   143MB
```
* Note:- The **rushi1006/single_stage_build** is without nginx service and **rushi1006/multi_stage_build** is the combination of src code and nginx and other static files.

### Best Example to use Volume.
* We can use single docker-compose file to create multiple env.
```yaml
version: '3'
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - /app/node_modules
      - .:/app
  tests:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - /app/node_modules
      - .:/app
    command: ["npm", "run", "test"]
  prod:
    build: .
    ports:
      - "8080:80"
```
* In above case we are not creating volume for PROD service so that any changes made to src will not reflect in PROD(service).
* But in case of **web** which we can treat as **dev** env and attached the volume so that any change done to source code will reflect immediately inside container.
* This is the best example fo using Volume in Docker.