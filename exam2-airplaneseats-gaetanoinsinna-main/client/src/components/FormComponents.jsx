import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import API from "../API";


function PickForm(props) {
    const [numberSeat, setNumberSeat] = useState('');
    const [seatToBuy, setSeatToBuy] = useState([]);
    const [listRes,setListRes] = useState([]);
    const [show, setShow] = useState(false);
    const [stringSeats, setStringSeats] = useState();
    const [gen,setGen] = useState();

  
    useEffect(()=>{
      if(props.seatToBuy.length===1){
      props.setCurrSelNum(1);
      setSeatToBuy([]);
      setStringSeats('');
      setNumberSeat('');
      }
    },[props.seatToBuy.length])
    

    
    useEffect(()=>{
        setStringSeats('');
        setNumberSeat('');
        const loadRes = async () => {
        setListRes(await API.getReservationsById(props.selectedPlane));
        }
        loadRes();
        
    },[props.selectedPlane])

    useEffect(()=>{
      setShow(false);
    },[props.loggedIn,numberSeat]);

    function genSeat(length, row, seat) {
        const seatsVector = [];
      
        const tot = row * seat;
      
        for (let i = 0; i < tot; i++) {
          const r = Math.floor(i / seat) + 1;
          const s = (i % seat);
          
            
          if(listRes.find((res)=>res.row === r && res.seat === props.dict[s.toString()]) === undefined){
            seatsVector.push([r, s]);
          }
          
          if (seatsVector.length >= length) {
            break;
          }

        }
        setSeatToBuy(seatsVector);
      
        return seatsVector;
      }

    const handleSubmit = async (event) => {
        event.preventDefault();

        props.generateReservation(gen);
        props.setSubmitRes(true);
        setShow(false);
        setNumberSeat('');
        setStringSeats('');
      };

    const handleGeneration = async () =>{
        const gen = genSeat(numberSeat,props.plane.rows, props.plane.seats);
        setGen(gen);
      
        if(numberSeat>0){
          setStringSeats(gen.map((g) => `${g[0]}${props.dict[g[1]]}`).join(", "));
        }
        props.setSelectedForm(true);
        props.setCurrSelNum(numberSeat);
        setShow(true);

    }

    return(<>
    <Container fluid>
      
    <Form onSubmit={handleSubmit} className="text-center">

    {props.seatToBuy.length === 0?
  <>
  
      <Form.Group>
        <Form.Label>Choose a number of seat to be booked!</Form.Label>
        {(props.inDB || !props.loggedIn)?
        <Form.Control type="number" value={numberSeat} max={props.plane.availability} onChange={e=>setNumberSeat(e.target.value)} disabled/>:
        <Form.Control  type="number" min={1} max={props.plane.availability} value={numberSeat} onChange={e=>setNumberSeat(e.target.value)}/>}
      </Form.Group>

   
    {(!props.inDB)?
    ((props.loggedIn)?<Alert show={show} variant="success">
    <Alert.Heading>Seats selection</Alert.Heading>
    <p>These seats are selected: {stringSeats}. If you want cancel or modify your seat click on cancel, otherwise confirm!</p>
  </Alert> : <Alert show={show} variant="danger">
        <Alert.Heading>Seats selection</Alert.Heading>
        <p>User not logged in</p>
      </Alert> ) 
      :
      <Alert show={show} variant="danger">
      <Alert.Heading>Seats selection</Alert.Heading>
      <p>You already have a reservation on this plane! Delete all your reservations first.</p>  
    </Alert>
    }</>:(<> 
    <Form.Group className="sm-4">
        <Form.Label>Choose a number of seat to be booked!</Form.Label>
        <Form.Control type="number" value={numberSeat} onChange={e=>setNumberSeat(e.target.value)} disabled/>
      </Form.Group>
    </>)}
      
    
   {props.seatToBuy.length ===0?
  <>
  {!show?<Button className="btn-logged" variant="primary" onClick={()=>{handleGeneration()}}>Select</Button>:null}
       {show?<>{(props.inDB || !props.loggedIn)?<Button className="btn-logged" variant="success" type="submit" disabled>Submit</Button>
       :<Button className="btn-logged" variant="success" type="submit">Confirm</Button>}</>:null}
      <Button className="btn-logged" variant="warning" onClick={()=>{setNumberSeat('');setShow(false);props.setCurrSelNum(0);props.setSelectedForm(false)}}>Cancel</Button>
  </>:( 
    <>
    <Button className="btn-logged" variant="primary" disabled>Select</Button> 
  <Button className="btn-logged" variant="warning" disabled>Cancel</Button>
    </>
  )
  
  
}
     <hr></hr>
     <Form.Label>Or pick them directly on the map!</Form.Label>
    </Form>
    
    </Container>
     
    </>);
}

export default PickForm
