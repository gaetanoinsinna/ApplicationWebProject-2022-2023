import { Row, Col, Button, Container } from "react-bootstrap";
import ButtonSeat from "./ButtonComponents";
import { useState, useEffect } from "react";
import "./stylePlane.css";
import { useParams } from "react-router-dom";
import  PickForm  from "./FormComponents"
import { Alert } from "react-bootstrap";
import API from "../API";

const dict = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
};

const createArray = (number) => {
  return Array.from({length: number},(_, index) => index + 1);
} 



function PlaneContent(props) {

  const [selectedPlane,setSelectedPlane] = useState(useParams().id);
  const [plane,setPlane] = useState('');
  const [listRes,setListRes] = useState([]);

  const [currSelNum,setCurrSelNum] = useState();
  const [wipeOut, setWipeOut] = useState(false)

  const [seatToBuy, setSeatToBuy] = useState([('','')]);
  const [deleteRes,setDeleteRes] = useState(false);

 
  const [confirmRes, setConfirmRes] = useState(false);
  const [inDB, setInDB] = useState();
  const [submitRes,setSubmitRes] = useState(false);

  const [selectedForm,setSelectedForm] = useState(false);
  const [show,setShow] = useState(false);
  const [conflictString,setConflictString] = useState("");
  

  const updateSelection = (num) => {
      setCurrSelNum(currSelNum+num);
  }

  useEffect(() => {
    const getReservationsByUserId = async () => {
      const updateDB = await API.getReservationsByUserId(props.userLoggedIn, selectedPlane);
      (updateDB.length>0)?setInDB(true):setInDB(false)
    };
  
    getReservationsByUserId();
  }, [selectedPlane, props.userLoggedIn]);

  useEffect(() => {
    const getPlane = async () => {
      const p = await API.getPlane(selectedPlane);
      setPlane(p);
    }

    getPlane();
  },[deleteRes,confirmRes]);


  useEffect( () => {
    const getReservationsById = async () => {
        const r = await API.getReservationsById(selectedPlane);
        setListRes(r);

    }

      const deleteReservationsById = async () => {
        await API.deleteReservationsById(props.userLoggedIn);
      
    }

    const handleDelete = async () => {
      await getReservationsById();
      
      if(deleteRes) {
        await deleteReservationsById(props.userLoggedIn);
        setDeleteRes(false);
        setWipeOut(true);
        deleteReservationsById();
        setInDB(false);
      }

    }
    
    handleDelete();

  },[deleteRes,confirmRes]);

  const generateReservation = async (arraySeats) => {
    const reservations = await arraySeats.map(a => ({planeId:selectedPlane,row:a[0],seat:dict[a[1]],userId:props.userLoggedIn}));
    setSeatToBuy(reservations);
    setConfirmRes(true);
  };

 

  useEffect(() => {
    const addReservation = async () => {
      
      try {
        const reservations = await API.getReservationsById(selectedPlane);
        const conflict = seatToBuy.filter(seat => reservations.some(reservation => reservation.row === seat.row && reservation.seat === seat.seat));
    
        if (conflict.length > 0) {
          setConflictString(conflict.map((r)=>`${r.row}${r.seat}`).join(' '));
          setShow(true);
          setTimeout(()=>{
            setShow(false);
          },5000);
          return;
        }
    
        await Promise.all(
          seatToBuy.map(async (r) => {
            try {
              await API.addReservation(r);
            } catch (error) {
              console.log(error);
            }
          })
        );

        const decrementAvailability = async () => {
          await API.decrementAvailability(selectedPlane,seatToBuy.length);
        }
   
        decrementAvailability();
        setInDB(true);
        
      } catch (error) {
        console.log("Error during reservations:", error);

      }
        
    };

    const handleConfirmRes = async () => {
      await addReservation();
      setConfirmRes(false);
      setWipeOut(true);
    };
  
    if (confirmRes) {
      if(setSeatToBuy.length>0){
      }
      handleConfirmRes();
    } 
  
  }, [confirmRes,submitRes]);
  

  const rows = createArray(plane.rows);
  const seats = createArray(plane.seats);

  
  return (
    <>
    {(show)? 
    <Alert variant="warning" className="text-center">
    <Alert.Heading>Attention</Alert.Heading>
      <p>These seats {conflictString} are already occupied by other users!</p>
    </Alert>
    :null}
    

    {<h5 className="text-center"> Occupied Seats: {plane.capacity - plane.availability} Available
      Seats: {plane.availability} Total Seats: {plane.capacity} Selected Seats: {currSelNum>0?currSelNum:0}</h5>}

    <PickForm selectedPlane={selectedPlane} inDB={inDB} generateReservation={generateReservation} 
              dict={dict} plane={plane} setSubmitRes={setSubmitRes} loggedIn={props.loggedIn} 
              setCurrSelNum={setCurrSelNum} currSelNum={currSelNum} seatToBuy={seatToBuy} setSelectedForm={setSelectedForm}> </PickForm>
    
    <Container className="plane">
        {rows.map((x, i) => (
          <Row key={i}>
            <Col>
              <RowContent
                rows = {rows}
                seats = {seats}
                rowNum={i + 1}
                listRes={listRes}
                updateSelection = {updateSelection}
                userLoggedIn = {props.userLoggedIn}
                loggedIn = {props.loggedIn}
                setCurrSelNum={setCurrSelNum}
                wipeOut={wipeOut}
                setWipeOut={setWipeOut}
                seatToBuy={seatToBuy}
                setSeatToBuy={setSeatToBuy}
                selectedPlane={selectedPlane}
                inDB={inDB}
                setInDB={setInDB}
                selectedForm={selectedForm}
                setSelectedForm={setSelectedForm}
              ></RowContent>
            </Col>
          </Row>
        ))}
        
      </Container> 

      <Container fluid>
        <Row className="justify-content-center">
{(props.loggedIn && !inDB && !selectedForm) ? 
      <Button variant="success" className="btn-logged" onClick={()=>generateReservation(seatToBuy)}> Confirm </Button> :
      <Button variant="success" className="btn-logged" disabled> Confirm </Button>}

      {(props.loggedIn && !selectedForm) ? 
      <Button variant="warning" className="btn-logged" onClick={()=>setWipeOut(true)}> Cancel </Button> :
      <Button variant="warning" className="btn-logged" disabled> Cancel </Button>}

        </Row>

        <Row className="justify-content-center">
        {(props.loggedIn) ? 
          <Button variant="danger" className="btn-logged-del" onClick={()=>{setDeleteRes(true);setSubmitRes(false);setSelectedForm(false);}}> Delete ALL your reservations </Button> :
          <Button variant="danger" className="btn-logged-del" disabled> Delete ALL your reservations</Button>}
        </Row>
      
      
      

      </Container>
     
    </>
  );
}

function RowContent(props) {
  return (
    <>
      {props.seats.map((x, i) => (
        <SeatContent
          key={i}
          seatNum={i}
          rowNum={props.rowNum}
          listRes={props.listRes}
          updateSelection = {props.updateSelection}
          loggedIn = {props.loggedIn}
          userLoggedIn = {props.userLoggedIn}
          setCurrSelNum={props.setCurrSelNum}
          wipeOut={props.wipeOut}
          setWipeOut={props.setWipeOut}
          seatToBuy={props.seatToBuy}
          setSeatToBuy={props.setSeatToBuy}
          selectedPlane={props.selectedPlane}
          inDB={props.inDB}
          setInDB={props.setInDB}
          setSelectedForm={props.setSelectedForm}
          selectedForm={props.selectedForm}
        >
        </SeatContent>
      ))}
    </>
  );
}

function SeatContent(props) {
  const [unavailable, setUnavailable] = useState(false);
  
  
  useEffect(() => {
    const found = props.listRes.find(
      (r) => r.row === props.rowNum && r.seat === dict[props.seatNum]
    );


    found === undefined ? setUnavailable(false) : setUnavailable(true);
  
  }, [props.listRes]);

  
  return (
    <>
      <ButtonSeat
        seatNum={props.seatNum}
        dict={dict}
        rowNum={props.rowNum}
        unavailable={unavailable}
        updateSelection = {props.updateSelection}  
        loggedIn = {props.loggedIn}
        userLoggedIn = {props.userLoggedIn}
        setCurrSelNum={props.setCurrSelNum}
        wipeOut={props.wipeOut}
        setWipeOut={props.setWipeOut}
        seatToBuy={props.seatToBuy}
        setSeatToBuy={props.setSeatToBuy}
        setSelectedForm={props.setSelectedForm}
        selectedForm={props.selectedForm}
      >
      </ButtonSeat>
    </>
  );
}


export default PlaneContent;
