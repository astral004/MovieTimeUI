import {rest} from 'msw';
import {setupServer} from "msw/node";

console.log(`Mock server base URL: ${process.env.REACT_APP_API_BASE_URL}`);

const mockRatingsResponse = ["AO", "APPROVED", "Approved", "G", "GP"];
const mockMovieResponse = {
    "movies": [
        {
            "_id": "573a1390f29313caabcd4135",
            "plot": "Three men hammer on an anvil and pass a bottle of beer around.",
            "title": "Blacksmith Scene",
            "fullplot": "A stationary camera looks at a large anvil with a blacksmith behind it and one on either side. The smith in the middle draws a heated metal rod from the fire, places it on the anvil, and all three begin a rhythmic hammering. After several blows, the metal goes back in the fire. One smith pulls out a bottle of beer, and they each take a swig. Then, out comes the glowing metal and the hammering resumes.",
            "rated": "UNRATED",
        },
        {
            "_id": "573a1390f29313caabcd42e8",
            "plot": "A group of bandits stage a brazen train hold-up, only to find a determined posse hot on their heels.",
            "title": "The Great Train Robbery",
            "fullplot": "Among the earliest existing films in American cinema - notable as the first film that presented a narrative story to tell - it depicts a group of cowboy outlaws who hold up a train and rob the passengers. They are then pursued by a Sheriff's posse. Several scenes have color included - all hand tinted.",
            "rated": "TV-G",
        }
    ],
    "page": 0,
    "filters": {},
    "entries_per_page": 20,
    "total_results": 2
}
const mockMovieByIdResponse = {
    "_id": "573a1390f29313caabcd4135",
    "plot": "Three men hammer on an anvil and pass a bottle of beer around.",
    "title": "Blacksmith Scene",
    "fullplot": "A stationary camera looks at a large anvil with a blacksmith behind it and one on either side. The smith in the middle draws a heated metal rod from the fire, places it on the anvil, and all three begin a rhythmic hammering. After several blows, the metal goes back in the fire. One smith pulls out a bottle of beer, and they each take a swig. Then, out comes the glowing metal and the hammering resumes.",
    "rated": "UNRATED",
    "reviews": [
        {
        "_id": "64864c42180f22b6f61dd35a",
        "name": "John Doe",
        "user_id": "1234",
        "date": "2023-06-12T00:18:50.490Z",
        "review": "This movie is not cool!",
        "movie_id": "573a1390f29313caabcd4135"
        },
        {
            "_id": "6487beec9231d3796e44719a",
            "name": "KT",
            "user_id": "1234",
            "date": "2023-06-13T00:57:16.921Z",
            "review": "This movie is OK by me!",
            "movie_id": "573a1390f29313caabcd4135"
        }
    ]
}

const mockServer = setupServer(
    rest.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/ratings`,
        (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockRatingsResponse))
        }),
    rest.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies`,
        (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockMovieResponse))
        }),
    rest.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/id/undefined`,
        (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockMovieByIdResponse))
        })
);

export default mockServer;