import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import PlaneContent from "./components/PlaneComponents";
import Header from "./components/NavbarComponents";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { LoginForm } from "./components/AuthComponents";
import PageNotFound from "./components/PageNotFound";
import HomePage from "./components/HomeComponents";
import { useState, useEffect } from "react";
import { Alert, Container, Row } from "react-bootstrap";


import API from "./API";


function App() {

  const [loggedIn,setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  
  const [redirection, setRedirection] = useState();
  const [userLoggedIn, setUserLoggedIn] = useState(-1);


  useEffect(() => {
    const checkAuth = async () => {
      await API.getUserInfo(); 
      setLoggedIn(true);
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUserLoggedIn(user.id);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUserLoggedIn(-1);

    setMessage('');
  };
 
  return (
    <>
      <BrowserRouter>
      <Header loggedIn={loggedIn} handleLogout={handleLogout} setRedirection={setRedirection}></Header>
      <Container fluid>
        {message && <Row> <Alert variant={message.type} onClose={()=>setMessage('')} dismissible>{message.msg}</Alert></Row>}
        <Outlet/>
      </Container>
        <Routes>
          <Route path="/" element={<Navigate to = "/planes"></Navigate>}></Route>
          <Route path="/planes" element={<HomePage></HomePage>}></Route>
          <Route path="/planes/*" element={
            <Routes>
              <Route path="/:id" element={
                <PlaneContent loggedIn={loggedIn} userLoggedIn={userLoggedIn}></PlaneContent>}></Route>
            </Routes>
          }>
          </Route>
          
        
          <Route path="/login" element={loggedIn ? <Navigate to = {redirection} > </Navigate> : 
          <LoginForm login={handleLogin}></LoginForm>}></Route>
          <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
