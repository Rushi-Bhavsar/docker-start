# Docker Notes

## Day-1
+ Container:- Container is a collection of resources for a specific process/processes.
+ Image:- Image is the collection of File System(process and its binary) snapshot and run command to start the specific process.

+ When we run the image then the FS snapshot is copied to contanier and the instance of process is created in contanier.

+ Override the run command at run time 
```docker
docker run {image_name} run_command/alternate_command

docker run busybox ls
docker run busybox echo "High Command"
```
+ run_command/alternate_command should be present inside the image.

+ See current running container.
```docker
docker ps

docker ps --all
```

+ Below is the oerview of the docker container life-cycle.

+ "docker run" is combination of two docker command "docker create" and "docker start".
+ "docker start" will run the run_command.
+ "docker create" will just create the docker image and copy the FS snapshot inside the container.

+ docker create command.
```docker
docker create hello-world
```
+ The above command returns the image id.

+ docker start command.
```docker
docker start -a {image_id}
```
+ If don't use "-a" then we won't see the output of the run_command on our terminal.
+ "-a" inform the docker-client to print the output of the run_command on our terminal.
+ We can start the old container using the start command.
+ But we can't change the run_command of the old container.
```docker
docker start -a {old_container_id} "new_run_command"

docker start -a 2323dwa21 echo bye there
```
+ The above docker command will give error message "you cannot start and attach multiple containers at once."
+ If we stop the container and try to start the same container again then it will use the "old_run_command" that is assigned to it.

+ Deleting the docker container and images completely
```docker
docker system prune
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - all dangling build cache

Are you sure you want to continue? [y/N]
```
