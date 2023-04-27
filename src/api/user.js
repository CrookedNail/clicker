export default function (fetchGraphQLData) {
    return {
        async getUser(id) {
            const query = `query {
  usersPermissionsUsers(filters: {id: {eq: ${id} }}) {
    data {
      id
      attributes {
        username
        discordAvatar
        completedLevel
        damagePerClick
        damagePerTick
        gold
        goldPerTick
        clicks
        inventory
        activeItems
      }
    }
  }
}`;

            const response = await  fetchGraphQLData(query)

            return formatUser(response)
        },

        async getAllUsers() {
            const query = `query {
  usersPermissionsUsers(sort: "completedLevel:DESC") {
    data {
      attributes {
        username
        discordAvatar
        completedLevel
        damagePerClick
        damagePerTick
        gold
        goldPerTick
        clicks
        inventory
        activeItems
      }
    }
  }
}`;
            const response = await  fetchGraphQLData(query)

            return response.data.usersPermissionsUsers.data
        },

        async updateCompletedLevels(id, completedLevel) {
            try {
                const query = `
      mutation UpdateUser($id: ID!, $completedLevel: Int!) {
  updateUsersPermissionsUser(id: $id, data: { completedLevel: $completedLevel} ) {
    data {
      id
      attributes {
        completedLevel
      }
    }
  }
}
    `;

                const variables = {
                    id,
                    completedLevel
                };

                const response = await fetchGraphQLData(query, variables);

                return response
            } catch (error) {
                console.error(error);
            }
        },

        async updateDiscordAvatar(id, discordAvatar) {
            try {
                const query = `
      mutation UpdateUser($id: ID!, $discordAvatar: String!) {
  updateUsersPermissionsUser(id: $id, data: { discordAvatar: $discordAvatar }) {
    data {
      id
      attributes {
        discordAvatar
      }
    }
  }
}
    `;

                const variables = {
                    id,
                    discordAvatar
                };

                const response = await fetchGraphQLData(query, variables);

                return response
            } catch (error) {
                console.error(error);
            }
        },

        async updateStats(id, inventory, clicks, gold, activeItems) {
            try {
                const query = `mutation UpdateUser($id: ID!,$inventory: JSON!, $activeItems: JSON!, $clicks: Int!, $gold: Int!) {
  updateUsersPermissionsUser(id: $id, data: { inventory: $inventory, activeItems: $activeItems, clicks: $clicks, gold: $gold }) {
    data {
      id
      attributes {
        inventory
        activeItems
        clicks
        gold
      }
    }
  }
}`;

                const variables = {
                    id,
                    inventory,
                    clicks,
                    gold,
                    activeItems
                };

                const response = await fetchGraphQLData(query, variables);

                return response
            } catch (error) {
                console.error(error);
            }
        }
    };
}

function formatUser(res) {
    return {
        id: res.data.usersPermissionsUsers.data[0].id,
        userName: res.data.usersPermissionsUsers.data[0].attributes.username,
        discordAvatar: res.data.usersPermissionsUsers.data[0].attributes.discordAvatar,
        completedLevel: res.data.usersPermissionsUsers.data[0].attributes.completedLevel,
        damagePerClick: res.data.usersPermissionsUsers.data[0].attributes.damagePerClick,
        damagePerTick: res.data.usersPermissionsUsers.data[0].attributes.damagePerTick,
        gold: res.data.usersPermissionsUsers.data[0].attributes.gold,
        goldPerTick: res.data.usersPermissionsUsers.data[0].attributes.goldPerTick,
        clicks: res.data.usersPermissionsUsers.data[0].attributes.clicks,
        inventory: res.data.usersPermissionsUsers.data[0].attributes.inventory,
        activeItems: res.data.usersPermissionsUsers.data[0].attributes.activeItems
    }
}
