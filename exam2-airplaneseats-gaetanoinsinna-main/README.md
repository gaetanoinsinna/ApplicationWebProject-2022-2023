[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/TsciYmrA)

# Exam #2: "Airplane Seats"
## Student: s308538 INSINNA GAETANO

## React Client Application Routes

- Route `/`: redirection to the home page`/planes`
- Route `/planes`: home page. The user can see and choose one of the airplanes clicking on the respective button that redirects each one to the own page
- Route `/planes/:id` each plane has its own page and here the user can choose the seats to reserve. There are two alternative ways in order to do that: the first one is to write the number of seats that the user want to reserve and than automatically the first `numberSeat` free seats requested will be reserved; the second one is to pick directly on the airplane map the seats to reserve and than confirm the selection.
- Route `/login` in this page we have the login form
- Route `*` Not Found Page

## API Server
- GET `/api/planes`
  - ```
    [
      {
        "id": 1,
        "type": "local",
        "rows": 15,
        "seats": 4,
        "capacity": 60,
        "availability": 58
      },
      {
        "id": 2,
        "type": "regional",
        "rows": 20,
        "seats": 5,
        "capacity": 100,
        "availability": 97
      },
      {
        "id": 3,
        "type": "international",
        "rows": 25,
        "seats": 6,
        "capacity": 150,
        "availability": 147
      }
    ]
  
- GET `/api/planes/:id`
  - the parameter is the `planeId`
  - ```
    {
      "id": 2,
      "type": "regional",
      "rows": 20,
      "seats": 5,
      "capacity": 100,
      "availability": 97
    }
  
- PUT `/api/planes/:id`
  - decrements the availability of the selected plane
  - the parameters are the `planeId` passed by `request.params` and the number of seats to decrement passed by `request.body`
  - if the plane is not found it will be returned a `404` not found error
  - it returns the plane selected with the update availability
  - ```
    {
      "id": 2,
      "type": "regional",
      "rows": 20,
      "seats": 5,
      "capacity": 100,
      "availability": 97
    }
- GET `/api/reservations`
  - get all the reservations in the database
  - ```
    [
      {
        "id": 5,
        "planeId": 1,
        "row": 5,
        "seat": "C",
        "userId": 2
      },
      {
        "id": 6,
        "planeId": 1,
        "row": 5,
        "seat": "D",
        "userId": 2
      }
    ]
  - GET `/api/reservations/:planeId`
    - get all the reservations in the database for a planeId passed by params
    - if the plane is not in the `plane` database it is returned a `404` not found error

  - POST `/api/reservations`
    - first check if the reservation (passed by request body) is not in the database, if so then add the reservation
    - if the reservation is already in the database the status code is `403` forbidden request because the request is legit, but the server denies it

  - POST `/api/users/:userId/reservations`
    - get all the reservations of the `userId` for the `planeId`, get all the reservations of a specific user for specific plane. They are passed by params and body respectively 
    - if the reservation it is not found it will be occurr a `404` error

  - DELETE `/api/users/:userId/reservations`
    - the parameter is the `userId` and the function will delete all the reservation for that specific user and for all the planes of the reservations, will be updated the `availabilty`
    - if the `userId` is not found it will be occurr a `404` not found error

  - POST `/api/sessions`
    - it will create a new session with the user credentials and if is not correct it will return  `401` unauthorized otherwise a `201` if the login process went correctly
  
  - GET `/api/sessions/current`
    - it retrieves the current session and so the current user logged in, otherwise it will return a `401` error
  
  - DELETE `/api/sessions/current`
    - it deletes the current session and do the logout procedure

## Database Tables

- Table `plane` - contains ***id*** *type* *rows* *seats* *capacity* *availability* (primary key: ***id***)
- Table `reservation` - contains ***id*** *planeId* *row* *seat* *userId* (primary key: ***id*** - secondary keys: *planeId* *userId*)
- Table `user` - contains ***id*** *email* *password* *salt* *name* (primary key: ***id***)

## Main React Components
The main page consists of information about the plane, a form field and the plane map. The choices are mutually exclusive: the user can enter the number of seats required or select them from the map.  
- `RowContent`/`SeatContent` (in `PlaneComponents.jsx`). Row and Seat Content are the main components of the seats grid. They are based on two arrays which correspond to the values in the `plane` database(specifically the `rows` and `seats` values). At render time we have two arrays of rows and seats lengths. The `RowContent` calls the `SeatContent` for each value in the array, which calls `ButtonSeat` component for each value in the array. Thus we have a grid of `rows`$*$`seats` `ButtonSeat` that represents the plane seats. Additionally, the two arrays are used to display the number of each seat thanks to a dictionary that associates 0$\rightarrow$"A",1$\rightarrow$"B" and vice versa. In this way we can show the number of the seat for example 10A, 2B and so on.
- `ButtonSeat` (in `ButtonComponents.jsx`). This represents the seat itself. At a low level it is a button with these states:
  1. `unavailable`: means that the seat is already reserved. It is printed in red and it is not clickable (this state is passed by props)
  2. `toggled`/`untoggled`: if the button is clicked, it will be selected or unselected depending on the previous state (if it was selected, it will be deselected and vice versa). If the button is selected its colour changes to green and its information (row and seat) is sent to the upper component (`SeatComponent`) thanks to an array called `seatToBuy` (passed by props) that has the selected seats. Toggling a seat means a push in the array on the other hand untoggling means a pop. 
  
- `PickForm` (in `FormComponents.jsx`): is a form where the user can enter the number of seats s/he wants and confirm her/his booking. The features of this component are:
  1. the mutually exclusive operation with the grid map, that are guaranteed by conditional rendering and control of the states (for example, if the user clicks on an available seat can not type on the form or click its buttons until deselects the seats or if the user type a number and press on select s/he will not be able to click on available seats until cancels the selection)
  2. the generation of selected seats according to the reservations already booked and the number provided by the user 
  3. the presence of an alert showing the selected seats and some information such as "User not logged in" or "You already have a reservation on this plane!"
- The main part of the project is located in the file `PlaneComponents.jsx`. It contains the logic behind the mutally exclusivity ( which is propagated to the `PickForm` via props), the reservation and delete handling thanks to the calls to the API (both for adding a new reservation and for deleting all the logged in user reservations). These features are guaranteed, as for the `PickForm` component, by conditional rendering and controlled states (for example, if a user has already bought a reservation, s/he cannot confirm a new reservation until s/he deletes all her/his own reservations). Another important feature is the `props.loggedIn` state, which if the user is not logged in, can only see the map and the available seats. Finally, all the information about the current plane are displayed int according to the updates and selections in both ways (manual or automatic).



## Screenshot

![Screenshot](./client/public/Screenshot%202023-07-09%20at%2016.04.09.png)
![Screenshot](./client/public/Screenshot%202023-07-09%20at%2016.04.52.png)
![Screenshot](./client/public/Screenshot%202023-07-09%20at%2016.05.07.png)
![Screenshot](./client/public/Screenshot%202023-07-09%20at%2016.05.27.png)
![Screenshot](./client/public/Screenshot%202023-07-09%20at%2016.06.12.png)


## Users Credentials

- mariorossi@polito.it, polito
- giuseppeverdi@polito.it, polito
- johnsmith@polito.it, polito
- juanperez@polito.it, polito

