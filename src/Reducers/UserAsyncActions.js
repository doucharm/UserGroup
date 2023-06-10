import { UserActions } from "./Reducer Slice"
import { UserQuery } from "Data/UserQuery";

export const UserFetchHelper = (id, query, resultselector, dispatch, getState) => {
    const log = (text) => (p) => {
        console.log(text)
        console.log(JSON.stringify(p))
        return p
    }
    const p = query(id)
        .then(
            response => response.json(),
            error => error
        )
        .then(
            (i) => log('incomming')(i)
        )
        .then(
            json => log('converted')(resultselector(json)),
            error => error
        )
        .then(
            json => log('dispatching')(dispatch(UserActions.users_update(json))),
            error => error
        )
    return p
}

export const UserFetch = (id) => (dispatch, getState) => {
    const userSelector = (json) => json.data.userById
    const bodyfunc = async () => {
        let userData = await UserFetchHelper(id, UserQuery, userSelector, dispatch, getState)
        console.log(userData)
        return userData
    }
    return bodyfunc()
}

export const UserAsyncUpdate = (user) => (dispatch, getState) => {
    const userMutationJSON = (user) => {
        return {
            query: `mutation($lastchange: DateTime!, $id: ID!, $email: String!, $name: String!, $surname: String!) {
                userUpdate(
                  user: {id: $id, lastchange: $lastchange, surname: $surname, email: $email, name: $name}
                ) {
                  id
                  msg
                  user {
                    name
                    surname
                    email
                    lastchange
                  }
                }
              }`,
            variables: user
        }
    }

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache', 
        redirect: 'follow', 
        body: JSON.stringify(userMutationJSON(user))
    }

    return fetch('/api/gql', params)
        .then(
            resp => resp.json()
        )
        .then(
            json => {
                const msg = json.data.userUpdate.msg
                if (msg === "fail") {
                    console.log("Update selhalo")
                } else {
                    const lastchange = json.data.userUpdate.user.lastchange
                    dispatch(UserActions.users_update({ ...user, lastchange: lastchange }))
                }
                return json
            }
        )
}

export const UserAsyncInsert = (user) => (dispatch, getState) => {
    const userMutationJSON = (user) => {
        return {
            query: `mutation ($id: ID!, $name: String!, $surname: String!,$email: String!) {
                userInsert(user: {id: $id, name: $name, surname: $surname, email: $email}) {
                  msg
                }
              }`,
            variables: user
        }
    }

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache', 
        redirect: 'follow', 
        body: JSON.stringify(userMutationJSON({ ...user }))
    }
    return fetch('/api/gql', params)
}


