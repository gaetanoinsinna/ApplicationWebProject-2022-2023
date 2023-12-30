import { Button, Col, Container, Row } from "react-bootstrap";
import "./stylePlane.css"
import { Link } from "react-router-dom";
function HomePage () {
    return (<>
    <Container fluid>
        <Row>
            <Col className="text-center"> 
                <Link to="/planes/1/"> 
                    <Button variant="outline-primary" className="btn-plane"> 
                        <i className="bi bi-airplane-fill"></i> Local
                    </Button> 
                </Link>
            </Col> 

            <Col className="text-center"> 
                <Link to="/planes/2"> 
                    <Button variant="outline-primary" className="btn-plane"> 
                        <i className="bi bi-airplane-fill"></i> Regional
                    </Button> 
                </Link>
            </Col> 

            <Col className="text-center"> 
                <Link to="/planes/3"> 
                    <Button variant="outline-primary" className="btn-plane"> 
                        <i className="bi bi-airplane-fill"></i> International
                    </Button> 
                </Link>
            </Col> 


        </Row>
      
    </Container>
        
    </>);
}

export default HomePage