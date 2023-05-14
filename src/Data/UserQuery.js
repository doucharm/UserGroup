import { authorizedFetch } from "./authorizedFetch"


export const UserQueryJSON = (id) => ({
    "query":
        `query ($id: ID!) {
            userById(id: $id) {
                id
                name
                surname
                membership {
                  group {
                    id
                  }
                }
            }
        }`,
    "variables": {"id": id}
})

export const UserQuery = (id) =>
    authorizedFetch('/gql', {
        body: JSON.stringify(UserQueryJSON(id)),
    })