import React, {useEffect, useState} from "react";
import MovieDataService from "../services/movies.js";
import {Link, useParams} from "react-router-dom";
import {Card,
    Container,
    Image,
    Col,
    Row,
    Button} from "react-bootstrap";
import moment from 'moment';

import "./Movie.css"

const Movie = ({user}) => {

    let params = useParams();

    const [movie, setMovie] = useState({
        id: null,
        title: "",
        rated: "",
        reviews: []
    });

    useEffect(()=> {
        const getMovie = id => {
            MovieDataService.getById(id).then(response => {
                setMovie(response.data);
                movie.id = response.data._id;
                movie.title = response.data.title;
                movie.rated = response.data.rated;
                movie.reviews = response.data.reviews;
            });
        }
        getMovie(params.id);
    }, [params.id]);

    const fixImage = (e) => {
        e.target.src = "/images/NoPosterAvailable-crop.jpg";
    }

    return(
      <div >
          <Container>
              <Row>
                  <Col>
                      <div className="poster">
                          <Image
                              className="bigPicture"
                              src={movie.poster+"/100px250"}
                              onError={fixImage}
                              fluid/>
                      </div>
                  </Col>
                  <Col>
                      <Card>
                          <Card.Header as={"h5"}>{movie.title}</Card.Header>
                          <Card.Body>
                              <Card.Text>
                                  {movie.plot}
                              </Card.Text>
                              {user &&
                              <Link to={"/movies/"+params.id+"/review"}>
                                  Add Review
                              </Link> }
                          </Card.Body>
                      </Card>
                      <br/>
                      <h2>Reviews</h2>
                      <br/>
                      {movie.reviews?.map((review, index) => {
                          return (
                              <div className="d-flex" key={index}>
                                  <div className="flex-shrink-0 reviewsText">
                                      <h5>{review.name + " reviewed on " + moment(review.date).format("Do MMMM YYYY")}</h5>
                                      <p className="review">{review.review}</p>
                                      {user && user.googleId === review.user_id &&
                                      <Row>
                                          <Col>
                                              <Link to={{
                                                      pathname: "/movies/"+params.id+"/review/"
                                                  }}
                                                  state={{
                                                      currentReview: review
                                                  }} >
                                                  Edit
                                              </Link>
                                          </Col>
                                          <Col>
                                              <Button variant={"link"} onClick={()=>{
                                                  let data = {
                                                      review_id: review._id,
                                                      user_id: review.user_id
                                                  }
                                                  MovieDataService.deleteReview(data)
                                                      .catch(e => console.error("Error:",e));
                                                  setMovie(prevState => {
                                                      prevState.reviews.splice(index, 1);
                                                      return ({
                                                          ...prevState
                                                      });
                                                  });
                                              }}>
                                                  Delete
                                              </Button>
                                          </Col>
                                      </Row>
                                      }
                                  </div>
                              </div>
                          )
                      })}
                  </Col>
              </Row>
          </Container>
      </div>
  )
}

export default Movie;