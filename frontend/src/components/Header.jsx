import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from '../slices/authSlice'
import { logo } from '../assets/logo.png';
import { Link } from "react-router-dom";

const Header = () => {
    const { userInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try{
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (err){
            console.log(err);
        }
    };
    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>
                            <img src={require('../assets/logo.png')} alt='Logo' width='50px' height='50px' />
                            FinancePro
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className='ms-auto'>

                            <LinkContainer to='/incomeTracking'>
                                <Nav.Link to='/incomeTracking'><FaShoppingCart />Track Income</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to='/expenseTracking'>
                                <Nav.Link to='/expenseTracking'><FaShoppingCart />Track Expenses</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to='/upgrade'>
                                <Nav.Link to='/upgrade'><FaShoppingCart /> Upgrade Today!</Nav.Link>
                            </LinkContainer>

                            { userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/login'>
                                <Nav.Link to='/login'><FaUser /> Sign In</Nav.Link>
                            </LinkContainer>) 
                            }
                            
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
    };
    export default Header;