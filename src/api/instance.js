import axios from "axios";

const fetchData = () => {
    const defaultOptions = {
        baseURL: import.meta.env.VITE_SERVER_URL,
        withCredentials: false,
        headers: {
            Authorization: `bearer ${import.meta.env.VITE_API_KEY}`,
            "Content-Type": "application/json"
        }
    };

    return axios.create(defaultOptions);
};

const fetchGraphQLData = async (query, variables) => {
    const response = await fetchData().post("/graphql", {
        query,
        variables
    });
    return response.data;
};

export { fetchData, fetchGraphQLData };
