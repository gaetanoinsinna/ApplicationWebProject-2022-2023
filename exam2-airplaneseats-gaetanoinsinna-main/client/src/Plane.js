"use strict";

function Plane(id, type, rows, seats, capacity, availability) {

  this.id = id;
  this.type = type;
  this.rows = rows;
  this.seats = seats;
  this.capacity = capacity;
  this.availability = availability;

  this.rowsArray = Array.from({length: rows},(_, index) => index + 1);
  this.seatsArray = Array.from({length: seats},(_, index) => index + 1);

  

  this.getRows = () => {
    return [...this.rowsArray];
  }

  this.getSeats = () => {
    return [...this.seatsArray];
  }

}

function PlaneAvailable () { 
    this.planes = [];

    this.addPlane = (plane) => {
        this.planes.push(plane);
    }

    this.getPlanes = () => {
        return[...this.planes];
    }
}

function Reservation (id,planeId,row,seat,userId) { 
    this.id = id;
    this.planeId = planeId;
    this.row = row;
    this.seat = seat;
    this.userId = userId;

    this.reservations = [];
    
    this.addReservation = (reservation) => {
        this.reservations.push(reservation);
    }

    this.getReservations = () => {
        return [...this.reservations];
    }

}

export { Plane, PlaneAvailable, Reservation};
