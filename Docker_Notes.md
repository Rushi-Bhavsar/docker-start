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
* Ideally we should copy all the files related to project into location called **WORKDIR**.
```sh
WORKDIR /usr/app
```
* Now all the commands that we execute will be executed from the **WORKDIR** location.
* If we change the source code of the application then we need to rebuild the docker image to reflect the chanegs.
* Ideally when we make any changes to the source code all the steps below the **COPY** command is re-executed as we first copy and then do other steps.
* Check step 3.
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
