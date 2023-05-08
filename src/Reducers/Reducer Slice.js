import { Create_Group,Delete_Group,Update_Group,Adding_Subgroup,GroupMemberUpdate, GroupMemberRemove } from "./Group Reducer";
import { Adding_Member,Remove_Member,Update_Member,Moving_Member } from "./Member Reducer";
import { GroupAsyncUpdate, GroupFetch, RoleFetch } from "./GroupAsyncAction";
import { Update_Role } from "./Role Reducer";
import { createSlice } from '@reduxjs/toolkit'
export const GroupSlice = createSlice({
    name: 'groups',
    initialState: {},
    reducers: {
        group_add: Create_Group,
        group_delete: Delete_Group,
        group_update: Update_Group,
        group_add_sub:Adding_Subgroup,
        group_memberUpdate: GroupMemberUpdate,
        group_memberRemove: GroupMemberRemove,

        memberAdd:Adding_Member,
        memberRemove: Remove_Member,
        memberUpdate: Update_Member,
        memberMoving: Moving_Member
    }
})
export const GroupActions = GroupSlice.actions
export const GroupReducer = GroupSlice.reducer
export const bindGroupActions = (dispatch) => {
    return {
        onGroupUpdate: (g) => dispatch(GroupActions.group_update(g)),
        onGroupAdd: (g) => dispatch(GroupActions.group_add(g)),
        onGroupDelete: (g) => dispatch(GroupActions.group_delete(g)),
        onAddSubGroup:({group,new_subgroup}) =>dispatch(GroupActions.group_add_sub({group,new_subgroup})),
        onGroupMemberUpdate: (payload) => dispatch(GroupActions.group_memberUpdate(payload)),
        onGroupMemberRemove: ({user, group}) => dispatch(GroupActions.group_memberRemove({user, group})),
        
        onMemberAdd: ({user, group}) => dispatch(GroupActions.memberAdd({user, group})),
        onMemberRemove: ({group,user}) => dispatch(GroupActions.memberRemove({group,user})),
        onMemberUpdate: ({group,user}) => dispatch(GroupActions.memberUpdate({group,user})),
        onMemberMoving: ({old_group,new_group,moving_member}) => dispatch(GroupActions.memberMoving({old_group,new_group,moving_member})),

        groupFetch: (id) => dispatch(GroupFetch(id)),
        groupAsyncUpdate: (group) => dispatch(GroupAsyncUpdate(group)),
        roleFetch: () => dispatch(RoleFetch())
    }
}

export const RoleSlice = createSlice(
    {
        name: 'roles',
        initialState: {},
        reducers: {
            roles_update: Update_Role
        }

    }
)

export const RoleActions = RoleSlice.actions
export const RoleReducer = RoleSlice.reducer