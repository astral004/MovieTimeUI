import React, {useState} from "react";
import MovieDataService from "../services/movies.js";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Form,
    Button,
    Container} from "react-bootstrap";

const AddReview = ({user}) => {
    const navigate = useNavigate();
    let params = useParams();
    let location = useLocation();

    let editing = false;
    let initialReviewState = "";
    //will have diff value
    //if editing existing review
    if (location.state){
        editing = true;
        initialReviewState = location.state.currentReview.review
    }

    const [review, setReview] = useState(initialReviewState);

    const onChangeReview = e => {
        const review = e.target.value;
        setReview(review);
    }

    const saveReview = () => {
        let data = {
            review: review,
            name: user.name,
            user_id: user.googleId,
            movie_id: params.id
        }

        if(editing){
            data.review_id = location.state.currentReview._id
            MovieDataService.updateReview(data)
                .then(response => {
                    navigate("/movies/"+params.id);
                })
                .catch(e => {
                    console.error("Error:", e);
                })
        } else {
            MovieDataService.createReview(data)
                .then(response => {
                    navigate('/movies/'+params.id);
                })
                .catch(e => {
                    console.error("Error:", e);
                });
        }
    }

    return (
        <Container className={"main-container"}>
            <Form>
                <Form.Group className={"mb-3"}>
                    <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
                    <Form.Control
                        as={"textarea"}
                        type={"text"}
                        required
                        review={review}
                        onChange={onChangeReview}
                        defaultValue={ review }
                    />
                </Form.Group>
                <Button variant={"primary"} onClick={saveReview}>
                    Submit
                </Button>
            </Form>
        </Container>
    )
}

export default AddReview;