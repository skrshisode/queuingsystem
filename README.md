# README #

This README would normally document whatever steps are necessary to get your application up and running.

## *Ola Auto Queuing System* ##

This repository contains a stateless API and Apps which are served via Nginx reverse proxy. The project is self contained and the only dependencies are Docker engine and docker-compose.

##### Running the project #####
Following command will pull all the necessary images and setup the project up and running in dettached mode.

`docker-compose build`<br/>
`docker-compose up -d`

##### Documentation #####

[Swagger API docs](http://localhost/api/v0/docs/)

##### Assumptions/Limitations #####

* Driver can pickup multiple customers at a time
* Driver triggers dropoff of the customer which is simulated using
  `setTimeout` function. If page is reloaded then it gets cleared
  and trip will never get completed.
* UI is not clean.
* More... at the time of demo!
