import { v4 as uuid } from "uuid"
export default function (fetchGraphQLData) {
    return {
        async getLevel(lvl) {
            const query = `query {
  levels(filters: {or: [
      {level: {eq: ${lvl} }},
      {level: {eq: ${lvl + 1} }}
    ]}
  )
  {
    data {
      id
      name:attributes  {
        level
      }
      enemies: attributes {
        enemies {
          data {
            attributes {
              name
              subname
              hp
              rewardMoney
              mask
              type
              avatar
              avatarDamaged
              bgMusic
              punchSounds
              phrasesSounds
            }
          }
        }
      }
      items: attributes {
        items {
          data {
            id
            attributes {
              name
              description
              type
              img
              cost
              sellCost
              stats {
                dps
                dpt
                critChance
                critDamage
              }
              skill {
                data {
                  id
                  attributes {
                    name
                    description
                    duration
                    cooldown
                    type
                    stats {
                      dps
                      dpt
                    }
                    img
                  }
                }
              }
            }
          }
        }
        shops {
          data {
            id
            attributes {
              name
              description
              type
              img
              cost
              sellCost
              stats {
                dps
                dpt
                critChance
                critDamage
              }
              skill {
                data {
                  id
                  attributes {
                    name
                    description
                    duration
                    cooldown
                    type
                    stats {
                      dps
                      dpt
                    }
                    img
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
            const response = await fetchGraphQLData(query);

            return responseFormatter(response.data.levels)
        },
    };
}

function responseFormatter(res) {
    const formated = res.data.map((item) => {
        return {
            id: item.id,
            level: item.name.level,
            enemies: item.enemies.enemies.data.map((enemy) => {
                return {
                    name: enemy.attributes.name,
                    subname: enemy.attributes.subname,
                    avatar: enemy.attributes.avatar,
                    avatarDamaged: enemy.attributes.avatarDamaged,
                    hp: enemy.attributes.hp,
                    rewardMoney: enemy.attributes.rewardMoney,
                    type: enemy.attributes.type,
                    mask: enemy.attributes.mask,
                    bgMusic: enemy.attributes.bgMusic,
                    punchSounds: enemy.attributes.punchSounds,
                    phrasesSounds: enemy.attributes.phrasesSounds
                }
            }),
            items: item.items.items.data.map((item) => {
                return {
                    id: item.id,
                    name: item.attributes.name,
                    description: item.attributes.description,
                    type: item.attributes.type,
                    img: item.attributes.img,
                    cost: item.attributes.cost,
                    sellCost: item.attributes.sellCost,
                    stats: {
                        dps: item.attributes.stats.dps,
                        dpt: item.attributes.stats.dpt,
                        critChance: item.attributes.stats.critChance,
                        critDamage: item.attributes.stats.critDamage
                    },
                    skill: {
                        id: item.attributes.skill?.data?.id,
                        name: item.attributes.skill?.data?.attributes.name,
                        description: item.attributes.skill?.data?.attributes.description,
                        img: item.attributes.skill?.data?.attributes.img,
                        duration: item.attributes.skill?.data?.attributes.duration,
                        cd: item.attributes.skill?.data?.attributes.cooldown,
                        type: item.attributes.skill?.data?.attributes.type,
                        stats: {
                            dps: item.attributes.skill?.data?.attributes.stats.dps,
                            dpt: item.attributes.skill?.data?.attributes.stats.dpt
                        }
                    },
                    uuid: uuid()
                }
            }),
            shop: item.items.shops.data.map((item) => {
                return {
                    id: item.id,
                    name: item.attributes.name,
                    description: item.attributes.description,
                    type: item.attributes.type,
                    img: item.attributes.img,
                    cost: item.attributes.cost,
                    sellCost: item.attributes.sellCost,
                    stats: {
                        dps: item.attributes.stats.dps,
                        dpt: item.attributes.stats.dpt,
                        critChance: item.attributes.stats.critChance,
                        critDamage: item.attributes.stats.critDamage
                    },
                    skill: {
                        id: item.attributes.skill?.data?.id,
                        name: item.attributes.skill?.data?.attributes.name,
                        description: item.attributes.skill?.data?.attributes.description,
                        img: item.attributes.skill?.data?.attributes.img,
                        duration: item.attributes.skill?.data?.attributes.duration,
                        cd: item.attributes.skill?.data?.attributes.cooldown,
                        type: item.attributes.skill?.data?.attributes.type,
                        stats: {
                            dps: item.attributes.skill?.data?.attributes.stats.dps,
                            dpt: item.attributes.skill?.data?.attributes.stats.dpt
                        }
                    },
                    uuid: uuid()
                }
            })
        }
    })

    return formated
}
