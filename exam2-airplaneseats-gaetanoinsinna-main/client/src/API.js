"use strict";

import { Plane, Reservation } from "./Plane";

const SERVER_URL = "http://localhost:3001";

const getListPlanes = async () => {
    const response = await fetch(`${SERVER_URL}`+"/api/planes");
    if (response.ok) {
      const planesJson = await response.json();
      return planesJson.map(
        (p) => new Plane(p.id, p.type, p.rows, p.seats, p.capacity, p.availability)
      );
    } else throw new Error("Internal server error!");
};

const getPlane = async (id) => {
    const response = await fetch(`${SERVER_URL}`+"/api/planes/"+`${id}`);
    if (response.ok) {
        const p = await response.json();
        return new Plane(p.id, p.type, p.rows, p.seats, p.capacity, p.availability)
    } else throw new Error("Internal server error!"); 
}

const getReservationsById = async (id) => {
    const response = await fetch(`${SERVER_URL}`+"/api/reservations/"+`${id}`);
    if (response.ok) {
        const resJson = await response.json();
        return resJson.map(
            (r) => new Reservation (r.id,r.planeId,r.row,r.seat,r.userId)
        );
    } else throw new Error("Internal server error!");
}

const getReservationsByUserId = async (userId,planeId) => {
    const response = await fetch(`${SERVER_URL}`+"/api/users/"+`${userId}`+"/reservations",{
      method: 'POST',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify({planeId:planeId})
    });
    if (response.ok){
      const resJson = await response.json();
      return resJson.map(
        (r) => new Reservation (r.id,r.planeId,r.row,r.seat,r.userId)
    );
} else throw new Error("Internal server error!");
}

const deleteReservationsById = async (id) => {
  const response = await fetch(`${SERVER_URL}`+"/api/users/"+`${id}`+"/reservations",{
    method: 'DELETE'
  });
  if (response.ok) {
    const resJson = await response.json();
    return resJson.map((r) => new Reservation(r.id,r.planeId,r.row,r.seat,r.userId));

  } else throw new Error("Internal server error!");
}

const addReservation = async (res) => {
  const response = await fetch(`${SERVER_URL}`+"/api/reservations",{
    method: 'POST',
    headers: { 'Content-Type' : 'application/json'},
    body: JSON.stringify({planeId:res.planeId, row:res.row, seat:res.seat, userId:res.userId})
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  } else {
    const result = await response.json();
    if (result.error) {
      throw result.error;
    } else {
      return result;
    }
  }

  }

  const decrementAvailability = async (planeId,numSeats) => {
    const response = await fetch(`${SERVER_URL}`+"/api/planes/"+`${planeId}`,{
      method: 'PUT',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify({numSeats:numSeats})
    });
    if(!response.ok){
      const err = await response.json();
      throw err;
    } else return null;
  }



const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
  };
  
  const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;
    }
  };
  
  const logOut = async() => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
  }

const API = {getListPlanes,getPlane,getReservationsById,deleteReservationsById,getReservationsByUserId,addReservation,decrementAvailability,logIn,getUserInfo,logOut};

export default API;