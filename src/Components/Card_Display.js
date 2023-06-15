import { HeaderTextInput } from "./Header_Text_Input"
import { Table_Display } from "./Components Display"
import { GroupType_Select } from "./Grouptype_Selector"
import { useSelector } from "react-redux"
import { OrganizationChart } from "primereact/organizationchart"
import { useState } from "react"

// Our page has 2 main branches, first one contains the card header of the group we're accessing to, the second one shows the details of that group like the users or subgroups
export const Card_Display = ({ group, set_display_id, actions }) => {
    const [show_chart,set_show_chart] = useState(false)
    const Get_Chart = (show_chart) =>
    {
        const hierarchy=useSelector(state => state.hierarchy)
        
        const hierarchy_list=[hierarchy,]
        console.log("hierarchy into the part",JSON.stringify(hierarchy_list))
    if( show_chart && hierarchy_list[0] )
    {
        console.log("this part is called")
        return (
            <div className="card bg-warning overflow-x-auto">
                <OrganizationChart value={hierarchy_list} />
            </div>
        )  
    }

     else return ("Nic");
    }
    const chart_view=Get_Chart(show_chart)
    console.log("chart view",chart_view)
    return (
        <main>
            <div class="card  border-success  bg-info mb-3" >
                <div class="card-header">
                    <Get_Card_Header group={group} set_display_id={set_display_id} actions={actions} />
                </div>
                <div class="card-body">
                    Components of the group:
                    <Table_Display group={group} set_display_id={set_display_id} actions={actions} />
                    <button onClick = {event => set_show_chart(!show_chart)}>Display hierarchy</button>
                    {chart_view}
                </div>
            </div>
        </main>
    )
}
// The functions return the card header
export const Get_Card_Header = ({ group, set_display_id, actions }) => {
    const MasterGroup = () => { // Create a button that allows us to go to the mastergroup of the group to which we're accessing
        if (group.mastergroup) { // Only if the group has a mastergroup
            return (
                <button onClick={event => set_display_id(group.mastergroup.id)}>Master group </button>
            )
        } else return;
    }
    // The output on the page's interface
    return (
        <div>
            <MasterGroup />
        <tr>
            ID: {group.id} <br />
            <HeaderTextInput group={group} actions={actions}/>
            Last change:{group.lastchange} <br />
            Group type: <GroupType_Select group={group} actions={actions}/> 
        </tr>
        </div>
    )
}

