import axios from "axios";

class FavoritesDataService {

    async updateFavorites(data){
        return await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorites`, data);
    }

    async getFavorites(id) {
        return await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorites/${id}`);
    }
}

export default new FavoritesDataService();