import { useState } from 'react';
import { PersonAdd, ArrowLeftRight } from 'react-bootstrap-icons';
import { v1 } from 'uuid';
import { fetch_by_letters } from 'Data/UserByLetters';
import { useSelector } from 'react-redux';

// Replace Button is a combination of Adding Member Button and Delete Button
// It is used to replace a member of a group with another user
export const Replace_Condition = ({ group, membership, actions }) => {
    const [inputId, setInputId] = useState('');
    const [usersList, setUsersList] = useState([]);
    const users = useSelector((state) => state.users);
    const handleInputChange = (event) => {
        setInputId(event.target.value);
    };

    const handleSubmit = (event) => {  // search for user by letter
        event.preventDefault();
        fetch_by_letters(inputId, setUsersList);
    };

    const handleReplace = (newUser) => {
        const current_role = membership?.user.roles?.filter((item) => item.group?.id === membership.group?.id && item.valid === true) // Keep the current role of the user for the new user
        let moving_role = ""
        if (current_role.length > 0) {
            moving_role = current_role[current_role.length - 1]
        }
        const membershipId = v1();
        const modifyUser = {
            ...newUser,
            roles: [],
            membership: [
                {
                    id: membershipId,
                },
            ],
        };
        const newMembership = {
            id: membershipId,
            valid: true,
            user: modifyUser,
            group: { id: membership.group.id },
            lastchange: Date.now(),
        };

        const payload = {
            store_update: {
                group: { id: membership.group.id },
                membership: newMembership,
            },
            id: newMembership.id,
            user_id: modifyUser.id,
            group_id: group.id,
        };
        const checkExistence = group.memberships.find(
            (m) => m.user.id === payload.user_id && m.valid  // Check if the user is already membership of the group
        );
        console.log(checkExistence);
        if (!checkExistence) { // if not then insert new user and remove old user from the group
            actions
                .userAsyncUpdate(modifyUser)
                .then(() => actions.membershipAsyncInsert(payload))
                .then(() =>
                    actions.membershipAsyncUpdate({
                        id: membership.id,
                        lastchange: membership.lastchange,
                        valid: false,
                    })
                )
                .then(() => actions.onMemberRemove({ group, membership }))
                .then(
                    () => {
                        if (moving_role.roletype) {
                            const new_role =
                            {
                                role: moving_role.roletype,
                                membership: newMembership,

                            }
                            actions.roleAsyncUpdate(moving_role)
                            actions.roleAsyncInsert(new_role)
                        }
                    }
                )
                .catch((error) => {
                    console.log('Error occurred:', error);
                });


        } else {
            console.log("existed");
        }
    };

    const UserBasic = ({ user }) => {
        const onClick = () => {
            handleReplace(user);
        };

        return (
            <tr>
                <td>{user.name} {user.surname}</td>
                <td>
                    <button onClick={onClick}><PersonAdd /></button>
                </td>
            </tr>
        );
    };
    return (
        <>
            <form method="GET" id="my_form" onSubmit={handleSubmit}></form>
            <table className="table table-sm table-info">
                <caption>Possible users with that name:</caption>
                <thead>
                    <label htmlFor="Id" form="my_form">Add new member:</label>
                    <input
                        form="my_form"
                        id="Id"
                        type="text"
                        value={inputId}
                        onChange={handleInputChange}
                    />
                    <button type="submit" title="Submit Form" form="my_form"><ArrowLeftRight /></button>
                    <br></br>
                    <td>Replace</td>
                </thead>
                <tbody>
                    {usersList?.map((user) => <UserBasic key={user.id} user={user} />)}
                </tbody>
            </table>
        </>
    );
}

export const Replace_Button = ({ group, actions, membership }) => {
    const [searchMode, setSearchMode] = useState(false);

    const handleClick = () => {
        setSearchMode(true);
    };

    if (searchMode) { // Searchbar using for search the wanted user by name
        <Replace_Condition group={group} membership={membership} actions={actions} />
    } else {
        return (
            <button onClick={handleClick}><ArrowLeftRight /></button>
        );
    }
};