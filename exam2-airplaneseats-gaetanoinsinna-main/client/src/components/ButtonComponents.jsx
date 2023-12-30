import { Button } from "react-bootstrap";
import "./stylePlane.css";

import { useEffect, useState } from "react";

function ButtonSeat(props) {
  const [toggled, setToggled] = useState(false);


  useEffect(()=>{
    setToggled(false);
    props.setCurrSelNum(0);
    props.setWipeOut(false);
    props.setSeatToBuy([]);
    
  },[props.loggedIn, props.wipeOut]);
  

  if (props.unavailable) {
    return (
      <>
        <Button className="seat" disabled variant="danger">
          {props.rowNum + props.dict[props.seatNum]}
        </Button>
      </>
    );
  } else
    return (
      <>
        {toggled ? (
          <Button className="seat" variant="success"
            onClick={() => { if(props.loggedIn && !props.selectedForm){
              setToggled(false);
              props.updateSelection(-1);
              props.seatToBuy.pop();             
            }}}>
            {props.rowNum + props.dict[props.seatNum]}
          </Button>
        ) : (
          <Button className="seat" variant="light" 
            onClick={() => {
              if(props.loggedIn && !props.selectedForm){
                setToggled(true);
                props.updateSelection(1);
                props.seatToBuy.push([props.rowNum,props.seatNum]);
              }
            }}
          >
            {props.rowNum + props.dict[props.seatNum]}
          </Button>
        )}
      </>
    );
}

export default ButtonSeat;
