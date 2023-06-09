import { Get_Node } from "./Get_Chart_Node";
import { OrganizationChart } from 'primereact/organizationchart';
import { useSelector } from "react-redux";
import './Hierarchy_Chart.css'
/**
 * Function Get_Each_Node is an async function that get ONE group from the server
 * @param {*} id this ID is passed onto a query to perform fetch
 * @param {*} display_id the id that is displayed will have a special node
 * @returns {Promise} a TreeNode with attributes needed to draw chart
 */
export const Get_Each_Node = async ({id,display_id}) => {
    const get_help = async (sg) => {
      const sgid=sg.id
      return await Get_Each_Node({id:sgid,display_id});
    };
    const item = await Get_Node(id);
    const childrenPromises = item.subgroups?.filter(sg =>sg.valid).map(get_help); // perform recursive functions to get Nodes from smaller subsgroups
    const all_children = await Promise.all(childrenPromises);
    if (all_children.length>0) // if the group has children ( members or subgroups )
    {
      const data = 
        {
          children: all_children,
          expanded: true,
          data:
          {
            name:item.name,
          },
          type:"group",
          className: item.id===display_id? 'selected' : 'group',
          style: { borderRadius: '12px' },
        }
      
      return data
    } 
    else // emtpy group TreeNode
    {
      const data = 
        {

          data:
          {
            name:item.name,
          },
          type:"group",
          className: item.id===display_id? 'selected' : 'endgroup',
          style: { borderRadius: '12px' },
        }
      return data
    }
  };
  
/**
 * Function waiting for all recursive functions to be excercuted and collect final result.
 
 * @returns a complete map of the entire entity
 */
export const Get_Hierarchy = async (display_id) => 
{
    const id="2d9dcd22-a4a2-11ed-b9df-0242ac120003" // id of the university ( highest level )
    const hie=await Get_Each_Node(({id,display_id}))
    return hie
}
/**
 * Draw a chart using the splice 'hierarchy' in the store and template in Hierarchy_Chart.css
 * @param {*} show_chart wether or not to show the chart drawn
 
 * @returns a chart displaying the university hierarchy
 */
export const Get_Chart = (show_chart) =>
{
    const hierarchy=useSelector(state => state.hierarchy)
    const hierarchy_list=[hierarchy]
if ( show_chart && hierarchy_list[0] )
  {
      const nodeTemplate = (node) => { // node template to display information
       if (node.type === 'group') 
          {
              return (
                  <div className="flex flex-column">
                      <div className="flex flex-column align-items-center">
                          <span className="font-bold mb-3">{node.data.name}</span>
                          <br />
                      </div>
                  </div>
              );
          }
      };
      return (
        <div className="organizationchart-demo">
            <div className="chart-bg">
                <OrganizationChart value={hierarchy_list} nodeTemplate={nodeTemplate} className="company"></OrganizationChart>
            </div>
        </div>
    )
  }
 else if ( !show_chart )
 {
  return ;
 } else
 {
 return ("No chart available");
 }
}
        