import { GroupActions, RoleActions } from "./Reducer Slice";
import { GroupQuery } from "Data/GroupQuery";
import { RoleQuery } from "Data/RoleQuery";
/**
 * Ask for the item on server and adds it or update it in the store to the heap
 * @param {*} id 
 * @returns promise
 */
export const GroupFetchHelper = (id, query, resultselector, dispatch, getState) => {
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
      // .then(
      //     response => log('received')(response.json()),
      //     error => error
      //     //error
      //     )
      .then(
          json => log('converted')(resultselector(json)),
          error => error
      )
      .then(
          json => log('dispatching')(dispatch(GroupActions.group_update(json))),
          error => error
      )

  return p
}

export const RoleFetchHelper = (query, selecter ,dispatch, getState) => {
    const log = (text) => (p) => {
        console.log(text)
        console.log(JSON.stringify(p))
        return p
    }
    const p = query()
        .then(
            response => response.json(),
            error => error  
        )
        .then(
            (i) => log('incomming')(i)
        )
        // .then(
        //     response => log('received')(response.json()),
        //     error => error
        //     //error
        //     )
        .then(
            json => log('converted')(selecter(json)),
            error => error
        )
        .then(
            json => log('dispatching')(dispatch(RoleActions.roles_update(json))),
            error => error
        )
    return p
  }

/**
* Fetch the group from server checks its type and asks once more for detailed data. Finally puts the result in the store.
* @param {*} id 
* @returns 
*/
export const GroupFetch = (id) => (dispatch, getState) => {
  const groupSelector = (json) => json.data.groupById
  const bodyfunc = async () => {
      let groupData = await GroupFetchHelper(id, GroupQuery, groupSelector, dispatch, getState)
      console.log(groupData)
      return groupData
  }
  return bodyfunc()
}

export const RoleFetch = () => (dispatch, getState) => {
    const selecter = (json) => json.data.roleTypePage
    const bodyfunc = async () => {
        let RoleData = await RoleFetchHelper(RoleQuery,selecter, dispatch, getState)
        console.log(RoleData)
        return RoleData
    }
    return bodyfunc()
  }

export const GroupAsyncUpdate = (group) => (dispatch, getState) => {
    const groupMutationJSON = (group) => {
        return {
            query: `mutation ($id: ID!, $name: String!, $lastchange: DateTime!) {
                groupUpdate(group: {id: $id, name: $name, lastchange: $lastchange}) {
                  id
                  msg
                  group {
                    id
                    name
                    lastchange
                  }
                }
              }`,
            variables: group
            }
        }

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        redirect: 'follow', // manual, *follow, error
        body: JSON.stringify(groupMutationJSON(group))
    }


    return fetch('/api/gql', params)
    //return authorizedFetch('/api/gql', params)
        .then(
            resp => resp.json()
        )
        .then(
            json => {
                const msg = json.data.groupUpdate.msg
                if (msg === "fail") {
                    console.log("Update selhalo")
                } else {
                    //mame hlasku, ze ok, musime si prebrat token (lastchange) a pouzit jej pro priste
                    const lastchange = json.data.groupUpdate.group.lastchange
                    dispatch(GroupActions.group_update({...group, lastchange: lastchange}))
                }
                return json
            }
        )   
}

export const MembershipAsyncUpdate = (group,membership) => (dispatch, getState) => {
    const membershipMutationJSON = ({membership}) => {
        return {
            query: `mutation ($userId: ID!, $groupId: ID!, $name: String!, $surname: String!,$email: String!) {
                membershipInsert(membership: {id: $groupID) {
                  msg
                  membership {
                    id
                    user (name: $name, surname: $surname,email: $email, id: $userId) {
                        id
                        name
                        surname
                        email
                    }
                  }
                }
              }`,
            variables: membership
            }
        }

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        redirect: 'follow', // manual, *follow, error
        body: JSON.stringify(membershipMutationJSON(membership))
    }


    return fetch('/api/gql', params)
    //return authorizedFetch('/api/gql', params)
        .then(
            resp => resp.json()
        )
        .then(
            json => {
                const msg = json.data.membershipInsert.msg
                if (msg === "fail") {
                    console.log("Update selhalo")
                } else {
                    //mame hlasku, ze ok, musime si prebrat token (lastchange) a pouzit jej pro priste
                    
                    dispatch(GroupActions.group_update({group}))
                }
                return json
            }
        )   
}