import { Navbar, Container, Button } from "react-bootstrap";
import "./stylePlane.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useLocation } from "react-router-dom";
import { LogoutButton } from "./AuthComponents";

function Header(props) {
  const location = useLocation();

  return (
    <>

    <Navbar expand="lg" bg="primary" data-bs-theme="dark">
      <Container fluid>
       <Link to="/planes" className="navbar-brand"> <i className="bi bi-airplane-fill"></i> Airplane Seats </Link> 
        { props.loggedIn ?
        <LogoutButton logout={props.handleLogout}> </LogoutButton>:
        <Link to = '/login'><Button variant="success" onClick={() => {props.setRedirection(location)}}>Login</Button></Link>
        }
      </Container>
    </Navbar>

    </>
  );
}

export default Header;
