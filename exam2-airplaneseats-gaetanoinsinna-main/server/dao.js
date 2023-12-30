"use strict";

const sqlite = require("sqlite3");
const { json } = require("express/lib/response");

const { Plane, Reservation } = require("./Plane");
const res = require("express/lib/response");

const db = new sqlite.Database("booking.sqlite", (err) => {
    if (err) throw err;
  });

/* PLANES */
//retrieve all planes
exports.listPlanes = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM plane";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const planes = rows.map(
          (p) => new Plane(p.id, p.type, p.rows, p.seats, p.capacity, p.availability)
        );
      resolve(planes);
      }
    });
  });
};

//retrieve :id plane
exports.getPlane = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM plane WHERE id = ?";
    db.get(sql, [id],(err,row) => {
      if(err) reject(err);
      if(row == undefined) resolve({error:'Plane not found!'});
      else {
        const plane = new Plane(row.id, row.type, row.rows, row.seats, row.capacity, row.availability);
        resolve(plane);
      }
    })
  });
};

/* RESERVATIONS */
//retrieve all reservations
exports.listReservations = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM reservation";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const reservations = rows.map(
          (r) => new Reservation (r.id,r.planeId,r.row,r.seat,r.userId)
        );
        resolve(reservations);
      }
    });
  });
};


exports.addReservation = (reservation) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO reservation VALUES (?,?,?,?,?)";
    db.run(sql,[reservation.id,reservation.planeId,reservation.row,reservation.seat,reservation.userId], (err, rows) => {
      if (err) reject(err);
      else {
        resolve(reservation);
      }
    });
  });
};

exports.decrementAvailability = (id,numSeats) => {
  return new Promise((resolve,reject) => {
    const sql = "SELECT * FROM plane WHERE id = ?";
        db.get(sql, [id],(err,row) => {
        if(err) reject(err);
        if(row == undefined) resolve({error:'Plane not found!'});
        else {
        const plane = new Plane(row.id, row.type, row.rows, row.seats, row.capacity, row.availability);

        db.run("UPDATE plane SET availability = ? WHERE id = ?",[plane.availability - numSeats,id],(e,o)=>{
          if(e) reject(e);
          else {
            resolve(o);}
        });

        resolve(plane);
      }})
  })
}


//retrieve all reservations of a certain :planeId
exports.getReservations = (planeId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM reservation WHERE planeId = ?";
    db.all(sql, [planeId], (err, rows) => {
      if (err) reject(err);
      if (rows === undefined) resolve({error: 'Plane not found in Reservations!'});
      else {
        const reservation = rows.map((rows) =>new Reservation (rows.id,rows.planeId,rows.row,rows.seat,rows.userId) );
        resolve(reservation);
      }
    })
  });
};



exports.getReservationsByUserId = (userId,planeId) => {
  return new Promise((resolve,reject) => {
    const sql = "SELECT * FROM reservation WHERE planeId = ? AND userId = ?";
    db.all(sql, [planeId,userId], (err, rows) => {
      if (err) reject(err);
      if (rows == undefined) resolve({error: 'Plane not found in Reservations!'});
      else {
        const reservation = rows.map(( rows) =>new Reservation (rows.id,rows.planeId,rows.row,rows.seat,rows.userId) );
        resolve(reservation);
      }
    })
  })
}




exports.deleteReservations = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM reservation WHERE userId = ?";
    db.all(sql, [userId], (err, rows) => {
      if (err) reject(err);
      else {
        const reservations = rows.map(
          (r) => new Reservation (r.id,r.planeId,r.row,r.seat,r.userId)
        );

        db.run("DELETE FROM reservation WHERE userId = ? ",[userId]);
        
        reservations.map((r)=>{
        
          db.get("SELECT * FROM plane WHERE id = ?",[r.planeId],(err,plane)=>{
            if(err) reject(err);
            else {
              const availabilityUpdate = plane.availability + reservations.filter(p=>p.planeId == r.planeId).length;
              db.run("UPDATE plane SET availability = ? WHERE id = ?", [availabilityUpdate, r.planeId]);
            }
            resolve(plane);
          })
        }
        )
        
        resolve(reservations);
      }
    });
  });
};

exports.checkReservation = (reservation) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM reservation WHERE planeId = ? AND row = ? AND seat = ?";
    db.all(sql, [reservation.planeId, reservation.row, reservation.seat], (err, res) => {
      if (err) {
        reject(err);
      } else {
        if (res.length > 0) {
          const errorMessage = res.map((reservation) => `${reservation.row},  ${reservation.seat}`).join(", ");
          reject(errorMessage);
        } else {
          resolve();
        }
      }
    });
  });
};




/* USERS */

