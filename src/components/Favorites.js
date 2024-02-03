import React, {useCallback, useEffect, useState} from "react";
import update from "immutability-helper";
import FavoritesCard from "./FavoritesCard.js"
import MovieDataService from "../services/movies";

import "./Favorites.css"
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import FavoritesDataService from "../services/favorites";
import {useNavigate} from "react-router-dom";

const Favorites = ({user}) => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [favs, setFavs] = useState([]);
    const googleId = localStorage.getItem("googleId");

    useEffect( () => {
        const getFavorites = id => {
            FavoritesDataService.getFavorites(id).then(res => {
                setFavs(res.data.favorites);
            })
        }
        getFavorites(googleId);
    }, []);

    useEffect(() => {
        const getMovie = id => {
            MovieDataService.getById(id).then(response => {
                movies.push(response.data);
                setMovies([...movies]);
            })
        }
        favs.map(favId => {
            getMovie(favId);
        })
    }, [favs]);

    const renderMovie = useCallback((movie, index, moveFav)=> {
        return (
            <FavoritesCard
                key={movie._id}
                id={movie._id}
                poster={movie.poster}
                number={index}
                title={movie.title}
                moveFav={moveFav}
            />
        );
    }, [])

    const moveFav = useCallback((dragIndex, hoverIndex) => {
        setMovies((prevMovies) =>
            update(prevMovies, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevMovies[dragIndex]],
                ],
            }),
        )
    }, []);

    useEffect( () => {
        let favoritesArray = [];
        movies.map( (movie) => {
            favoritesArray.push(movie._id)
        })
        const data = {
            _id: googleId,
            favorites: favoritesArray
        }
        FavoritesDataService.updateFavorites(data).then(r => {
            console.log(r.data)
        })
    }, [movies]);

    return (user ?
        <div>
            <div className={"favoritesContainer container"}>
                <div className={"favoritesPanel"}>Drag your favorites to rank them</div>
                <DndProvider backend={HTML5Backend}>
                <div style={{width: '500px', margin: "1em"}}>
                        {movies?.map( (movie, i) => renderMovie(movie, i, moveFav) )}
                </div>
                </DndProvider>
            </div>
        </div>
    : navigate("/"))
}

export default Favorites;