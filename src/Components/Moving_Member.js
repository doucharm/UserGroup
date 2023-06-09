import { Component, useState } from "react"
import { RocketTakeoffFill } from "react-bootstrap-icons"
import { TwoStateButton } from "./Delete_Button"
import {v1} from 'uuid'
/**
 * Component for moving a member in a group to another group.
 * @param {Object} membership membership contain both current group and user ID
 * @param {Object} toggle_moving function that toggle the moving button
 * @param {Object} actions global actions
 * @returns {Component} component necessary for entering data
 */
export const MovingMember = ({membership,actions}) =>
{
    const [destination,set_destination] = useState("")
    const onInputChange  = (e) =>
    {
        set_destination(e.target.value) // set input destination
    }
    return ( // an input box for id and an confirm button
        <>
        <input className = "form-control-warning "onChange={onInputChange} placeholder="Enter destination group's ID"/> 
        <button onClick={()=> onMove({membership,destination,actions})} className=" btn btn-danger"><RocketTakeoffFill></RocketTakeoffFill></button>
        </>
    )
}
export const Moving_Member_Button =  ({membership, actions}) =>
{
    return (
        <TwoStateButton sec_button={<MovingMember membership={membership} actions={actions}/>} icon={RocketTakeoffFill} />
    )
}
/**
 * onMove function perform 2 actions: adding a user to a selected group and removing him at current group* removing both membership and current role
 * @param {Object} membership membership contain both current group and user ID
 * @param {Object} destination the group's ID that will receive the user
 * @param {Object} actions global actions
 */
export const onMove = ({destination,membership,actions}) => // perform moving member by invaliding this membership and create a new valid membership in the intended destination
    {
        const payload_leave = // old membership to invalidate, indicating that this user is no longer in this group
        {
            id:membership.id,
            lastchange:membership.lastchange,
            valid:false
        }
        const payload_arrive = //adding this user into another group by generating a new membership 
        {
            group_id:destination,
            user_id:membership.user.id,
            id:v1(),
            store_update:
            {
                group:
                {
                    id:destination
                },
                membership:null
            }
        }

        const current_role=membership?.user.roles?.filter((item) => item.group?.id===membership.group?.id && item.valid===true).splice(-1)[0]
        try
        {
        if(current_role) // removing the current role of this user in this group
        {
        actions.roleAsyncUpdate({role:{...current_role,valid:false}, membership:{...membership,valid:false}}) // remove the role that this user has when moved
        }
        actions.membershipAsyncInsert(payload_arrive)
        actions.membershipAsyncUpdate(payload_leave)
        actions.onMemberRemove({group:{id:membership.group.id},membership:membership})
        }
        catch
        {
            window.alert("Moving failed, invalid destination")
        }
    }