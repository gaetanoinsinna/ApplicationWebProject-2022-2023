import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"

function PageNotFound(){
    return(<>
    {<h1>Page Not Found!</h1>}
    <Link to="/planes"><Button className="btn">Return Home</Button></Link>
    </>)
}

export default PageNotFound