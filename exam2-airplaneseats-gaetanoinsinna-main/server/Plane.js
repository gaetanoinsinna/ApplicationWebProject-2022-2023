"use strict";

function Plane(id, type, rows, seats, capacity, availability) {

  this.id = id;
  this.type = type;
  this.rows = rows;
  this.seats = seats;
  this.capacity = capacity;
  this.availability = availability;
  
}

function Reservation (id,planeId,row,seat,userId) { 
    this.id = id;
    this.planeId = planeId;
    this.row = row;
    this.seat = seat;
    this.userId = userId;
}

module.exports = { Plane, Reservation };
