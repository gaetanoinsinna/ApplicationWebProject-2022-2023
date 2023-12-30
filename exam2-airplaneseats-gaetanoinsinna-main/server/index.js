'use strict';

const express = require('express');
const morgan = require('morgan');

const {check, validationResult} = require('express-validator');

const dao = require('./dao.js');
const userDao = require('./user-dao.js');
const cors = require('cors');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');


// init express
const app = new express();
const port = 3001;

//setting up the middlewares
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin : 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username,password,cb){
  const user = await userDao.getUser(username,password);
  if(!user)
    return cb(null,false, 'Incorrect username and/or password.');
  
    return cb(null, user);
}));

passport.serializeUser(function (user,cb){
  cb(null,user);
});

passport.deserializeUser(function(user,cb) {
  return cb(null,user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret:"secret! must not share",
  resave:false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

/* ROUTES */

/* PLANES */
app.get('/api/planes', (request,response) => {
  dao.listPlanes()
  .then(planes => response.json(planes))
  .catch(() => response.status(500).end()); 
});

app.get('/api/planes/:id', async(req,res)=>{
  try {
    const plane = await dao.getPlane(req.params.id);
    if(plane.error)
      res.status(404).json(plane);
    else
    res.json(plane);
  } catch {
    res.status(500).end();
  }
})

app.put('/api/planes/:id', (request,response) => {
  dao.decrementAvailability(request.params.id,request.body.numSeats)
  .then(plane => response.json(plane))
  .catch(() => response.status(500).end()); 
});


/* RESERVATIONS */
app.get('/api/reservations', (request,response) => {
  dao.listReservations()
  .then(reservations => response.json(reservations))
  .catch(() => response.status(500).end());
});



app.get('/api/reservations/:planeId',async(req,res)=>{
  try{
    const reservations = await dao.getReservations(req.params.planeId);
    if(reservations.error)
      res.status(404).json(reservations);
    else
      res.json(reservations);
  }catch {
    res.status(500).end();
  }
})

app.post('/api/reservations', (request, response) => {
  dao.checkReservation(request.body)
    .then(res => {
      if (res) {
        response.status(403).json(res).end();
      } else {
        dao.addReservation(request.body)
          .then(reservation => response.json(reservation))
          .catch(() => response.status(503).end());
      }
    })
    .catch(() => response.status(400).end());
});



app.post('/api/users/:userId/reservations',async (request,response)=>{
  try {
    const res = await dao.getReservationsByUserId(request.params.userId,request.body.planeId)
    response.json(res);
  } catch {
    response.status(404).end();
  }

});






app.delete('/api/users/:userId/reservations',(request,response)=>{
  dao.deleteReservations(request.params.userId)
  .then(reservation => response.json(reservation))
  .catch(()=>response.status(404).end());
});

/* SESSION */

app.post('/api/sessions', function(req,res,next){
  passport.authenticate('local', (err,user,info)=> {
    if (err) return next(err);
    if(!user){
      return res.status(401).send(info);
    }

    req.login(user, (err) => {
      if (err) 
        return next(err);

      return res.status(201).json(req.user);
    });
  })(req,res,next);
});

app.get('/api/sessions/current',(req,res)=>{
  if(req.isAuthenticated()){
    res.json(req.user);}
    else 
    res.status(401).json({error: 'Not authenticated'});
  });

  app.delete('/api/sessions/current', (req, res) => {
    req.logout(()=>{
      res.end();
    });
  });



// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});