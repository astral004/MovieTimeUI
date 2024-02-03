import {render, waitFor, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";

import mockServer from "../__mocks__/mockServer";
import Movie from "../components/Movie";

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

test('renders a single movie and its reviews', async () => {
    const TITLE_OF_MOVIE = 'Blacksmith Scene';
    const REVIEW_CARD_CLASS = 'review'
    const NUMBER_OF_REVIEWS = 2;

    const {container} = render(
        <MemoryRouter>
            <Movie />
        </MemoryRouter>
    );

    await waitFor(() => screen.getByText(TITLE_OF_MOVIE));
    const reviewCards = container.getElementsByClassName(REVIEW_CARD_CLASS);
    // screen.debug();
    expect(reviewCards.length).toBe(NUMBER_OF_REVIEWS);
})