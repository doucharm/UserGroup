import { authorizedFetch } from "./authorizedFetch"
/**
 * This query asks for all of the group types on sever
 * @returns The data of grouptype page on server
 */
export const GroupTypePageJSON = () => ({
    "query":
    `query  {
          groupTypePage 
          {
            name
            lastchange
            id
            nameEn
          }
        }`,
})
/**
 * This function fetch the grouptype page from the server
 * @returns promise
 */
export const GroupTypePage = () =>
    authorizedFetch('/gql', {
        body: JSON.stringify(GroupTypePageJSON()),
    })
   
/**
 * This functions declare what we would do with the data we get from server, in this case the grouptype page
 * @param {*} query The promise, in this case GroupTypePage
 * @param {*} selector Choose the appropriate data 
 * @returns promise
*/
export const GroupTypePageFetch = (query,selector) => {
        const p = query()
        .then(
            response => response.json(),
            error => error  
        )
        .then(
            json => selector(json),
            error => error
        )
        return p
      }
      
/**
 * In the function below we call the previous function that require the query and the selector in which are GroupTypePage and the selector is the data.groupTypePage
 * @param {*} set_group_type Part of the useState to deliver the data we got from server to an array
 * @returns promise
 */
export const group_type_fetch = (set_group_type) => 
{
        const selector = (json) => json.data.groupTypePage
        const bodyfunc = async () => {
            let grouptypes = await GroupTypePageFetch(GroupTypePage, selector) // Put what we get from sever into a variable
            set_group_type(grouptypes) //Push that variable into group_type on Grouptype_Selector
            return grouptypes
        }
        return bodyfunc()
}