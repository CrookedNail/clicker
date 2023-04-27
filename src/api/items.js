export default function (fetchGraphQLData) {
    return {
        async getAllItems() {
            const query = `query {
	items(pagination: { limit: 1000, start: 0 }) {
    data {
      attributes {
        name
        description
        type
        img
        cost
        stats {
          dps
          dpt
        }
      }
    }
  }
}`;

            const response = await fetchGraphQLData(query)

            return responseFormatter(response)
        }
    }
}

function responseFormatter(res) {
    return res.data.items.data.map((item) => {
        return {
            id: item.id,
            name: item.attributes.name,
            description: item.attributes.description,
            type: item.attributes.type,
            img: item.attributes.img,
            cost: item.attributes.cost,
            stats: {
                dps: item.attributes.stats.dps,
                dpt: item.attributes.stats.dpt
            }
        }
    })
}
