# README #

This README would normally document whatever steps are necessary to get your application up and running.

## *Ola Auto Queuing System* ##

This repository contains a stateless API and Apps which are served via Nginx reverse proxy. The project is self contained and the only dependencies are Docker engine and docker-compose.

##### Running the project #####
Following command will pull all the necessary images and setup the project up and running in dettached mode.

`docker-compose build`<br/>
`docker-compose up -d`<br/>

Note:
* You might need to wait till all services are up and running!
* Make sure nothing is running on port 80 of your system.
  Otherwise it will conflict with Nginx container.

Now open browser and type `localhost`.

##### Documentation #####

[Swagger API docs](http://localhost/api/v0/docs/)

##### Assumptions/Limitations #####

* Driver can pickup multiple customers at a time
* Driver null value sanity has not been done. Need to add driver name
  in order to store it in localstorage and perform proper API calls.
* Driver triggers dropoff of the customer which is simulated using
  `setTimeout` function. If page is reloaded then it gets cleared
  and trip will again take specified time to complete.
  (Note: Instead of 5 min, have set it for 10 sec.)
* UI is not clean.
* More... at the time of demo!
