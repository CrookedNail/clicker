import { fetchGraphQLData } from "@/api/instance";
import userModule from "./user";
import levelModule from "./level";
import itemModule from "./items"

export default {
    user: userModule((query, variables) => fetchGraphQLData(query, variables)),
    level: levelModule((query) => fetchGraphQLData(query)),
    items: itemModule((query) => fetchGraphQLData(query))
};
