import { authorizedFetch } from "./authorizedFetch"

/**
 * This function asks for the possible users with the input letters
 * @param {*} letters The input as letters to find the appropriate users
 * @returns data of the appropriate users
 */
export const UserbyLettersJSON = (letters) => ({
    "query":
        `query ($letters: String!) {
          userByLetters(letters: $letters) 
          {
            id
            name
            surname
            email 
            valid
            lastchange
          }
        }`,
    "variables": { "letters": letters }
})
/**
 * Fetch it from sever using authorizedFetch with the newparams is the above function
 * @param {*} letters the input to find the appropriate users
 * @returns promise
 */
export const UserbyLetters = (letters) =>
    authorizedFetch('/gql', {
        body: JSON.stringify(UserbyLettersJSON(letters)),
    })

/**
 * This function helps to define what we would do with the data we get from sever
 * @param {*} letters the input to find the appropriate users
 * @param {*} query The promise we got using UserbyLetters
 * @param {*} selector helps to choose the correct data
 * @returns promise
 */
export const UserbyLettersFetch = (letters, query, selector) => {
    const p = query(letters)
        .then(
            response => response.json(), //convert it to jason
            error => error
        )
        .then(
            json => selector(json), //get the part that we need
            error => error
        )
    return p
}

/**
 * In the function below we call the previous function that require the letter, the query and the selector in which are input letters, GroupTypePage and the data.groupTypePage respectively
 * @param {*} letters the input to find the appropriate users
 * @param {*} set_users_list part of the useState to put all of the users with those letters in an array
 * @returns promise
 */
export const fetch_by_letters = (letters, set_users_list) => {
    const selector = (json) => json.data.userByLetters
    const bodyfunc = async () => {
        let groupData = await UserbyLettersFetch(letters, UserbyLetters, selector)
        set_users_list(groupData) //return the users list with given letters
        return groupData
    }
    return bodyfunc()
}