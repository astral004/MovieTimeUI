import {useCallback, useEffect, useState} from "react";
import FavoritesDataService from "./services/favorites.js";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Link, Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import {Nav, Navbar} from "react-bootstrap";

import Login from "./components/Login";
import Logout from "./components/Logout";

import MoviesList from "./components/MoviesList";
import Movie from "./components/Movie";
import AddReview from "./components/AddReview";
import Favorites from "./components/Favorites";

import './App.css';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {

    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);

    const addFavorite = (movieId) => {
        setFavorites([...favorites, movieId]);
    }

    const deleteFavorite = (movieId) => {
        setFavorites(favorites.filter(f => f !== movieId));
    }

    useEffect(() => {
        let loginData = JSON.parse(localStorage.getItem("login"));
        if (loginData) {
            let loginExp = loginData.exp;
            let now = Date.now() / 1000;
            if (now < loginExp) {
                //not expired
                setUser(loginData);
                retrieveFavorites(loginData.googleId);
            } else {
                //expired
                localStorage.setItem("login", null);
            }
        }
    }, []);

    const retrieveFavorites = useCallback(async (id) => {
        if (id) {
            await FavoritesDataService.getFavorites(id).then(response => {
                setFavorites(response.data.favorites);
            }).catch(e => {
            });
        }
    }, []);

    const updateFavorites = async (user, favorites) => {
        if (user && favorites) {
            const data = {
                _id: user.googleId,
                favorites: favorites
            }
            await FavoritesDataService.updateFavorites(data).then(() => retrieveFavorites());
        }
    };

    useEffect(() => {
        updateFavorites(user, favorites);
    }, [favorites]);

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="App">
                <Navbar bg="primary" expand="lg" sticky="top" variant="dark">
                    <Container className="container-fluid">
                        <Nav.Link as={Link} to="/">
                            <Navbar.Brand>
                                <img src={"/images/movies-logo.jpg"} alt="movies logo" className="moviesLogo"/> MOVIE TIME
                            </Navbar.Brand>
                        </Nav.Link>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="ml-auto">
                                <Nav.Link as={Link} to="/">
                                    Movies
                                </Nav.Link>
                                {user && (<Nav.Link as={Link} to={"/favorites"}>Favorites</Nav.Link>)}
                            </Nav>
                        </Navbar.Collapse>
                        {user ? (
                            <Logout setUser={setUser} clientId={clientId}/>
                        ) : (
                            <Login setUser={setUser}/>
                        )}
                    </Container>
                </Navbar>

                <Routes>
                    <Route exact path="/" element={
                        <MoviesList
                            user={user}
                            addFavorite={addFavorite}
                            deleteFavorite={deleteFavorite}
                            favorites={favorites}
                        />}
                    />
                    {/*<Route exact path="/movies" element={*/}
                    {/*    <MoviesList*/}
                    {/*        user={user}*/}
                    {/*        addFavorite={addFavorite}*/}
                    {/*        deleteFavorite={deleteFavorite}*/}
                    {/*        favorites={favorites}*/}
                    {/*    />}*/}
                    {/*/>*/}
                    <Route
                        path="/movies/:id"
                        element={<Movie user={user}/>}
                    />
                    <Route
                        path="/movies/:id/review"
                        element={<AddReview user={user}/>}
                    />
                    <Route
                        path='/favorites'
                        element={<Favorites user={user} />}
                    />
                </Routes>
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
