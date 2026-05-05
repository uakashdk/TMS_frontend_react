import React from "react";

const Login = React.lazy(()=>import("../pages/tms/auth/Login"))
const Dashboard = React.lazy(()=>import("../pages/tms/dashboard/DashBoard"))
const Trips = React.lazy(()=>import("../pages/tms/Trips/Trips"));
const AddTrip = React.lazy(()=>import("../pages/tms/Trips/AddTrip"));
const UpdateTrip = React.lazy(()=>import("../pages/tms/Trips/UpdateTrip"));
const User = React.lazy(()=>import("../pages/tms/user/UserList"))
const AddUser = React.lazy(()=>import("../pages/tms/user/AddUser"))
const EditUser = React.lazy(()=>import("../pages/tms/user/EditUser"))
const Companies = React.lazy(()=>import("../pages/tms/companies/Companies"))
const Drivers = React.lazy(()=>import("../pages/tms/driver/Driver"));
const AddDriver = React.lazy(()=>import("../pages/tms/driver/AddDriver"));
const UpdateDriver = React.lazy(()=>import("../pages/tms/driver/UpdateDriver"));
const AddNewCompany = React.lazy(()=>import("../pages/tms/companies/AddNewCompany"));
const UpdateNewCompany = React.lazy(()=>import("../pages/tms/companies/UpdateNewCompany"));
const VehicleList = React.lazy(()=>import("../pages/tms/Vehicles/Vehicle"));
const AddVehicle = React.lazy(()=>import("../pages/tms/Vehicles/AddVehicle"));
const UpdateVehicle = React.lazy(()=>import("../pages/tms/Vehicles/UpdateVehicle"));
const GetcurrentDriverVehicle = React.lazy(()=>import("../pages/tms/VehicleAssignment/getcurrentDriverVehicle"));
const GetVehicleCurrentDriver = React.lazy(()=>import("../pages/tms/VehicleAssignment/getVehicleCurrentDriver"));
const VehicleDriverAssign = React.lazy(()=>import("../pages/tms/VehicleAssignment/VehicleDriverAssign"));
const VehicleDriverAssignmentHistory = React.lazy(()=>import("../pages/tms/VehicleAssignment/vehicleDriverAssignmentHistory"));
const EditRoute = React.lazy(()=>import("../pages/tms/RouteMaster/EditRoute"));
const AddRoute = React.lazy(()=>import("../pages/tms/RouteMaster/AddRoute"));
const Route = React.lazy(()=>import("../pages/tms/RouteMaster/Route"));
const Party = React.lazy(()=>import("../pages/tms/PartyModule/Party"));
const AddParty = React.lazy(()=>import("../pages/tms/PartyModule/AddParty"));
const EditParty = React.lazy(()=>import("../pages/tms/PartyModule/EditParty"));
const JobList = React.lazy(()=>import("../pages/tms/jobs/JobList"));
const AddJobs = React.lazy(()=>import("../pages/tms/jobs/AddJobs"));
const UpdateJobs = React.lazy(()=>import("../pages/tms/jobs/UpdateJobs"));
const AddTripAdvance = React.lazy(()=>import("../pages/tms/Trips/TripAdvance"));
const TripExpence = React.lazy(()=>import("../pages/tms/Trips/TripExpence"));
const POD = React.lazy(()=>import("../pages/tms/POD/Pod"));
const RateContract = React.lazy(()=>import("../pages/tms/RateContract/RateContract"));
const AddRateContract = React.lazy(()=>import("../pages/tms/RateContract/AddRateContract"));
const PartyAdvance = React.lazy(()=>import("../pages/tms/PartyModule/PartyAdvance"));
const AddPartyAdvance = React.lazy(()=>import("../pages/tms/PartyModule/AddPartyAdvance"));
const Roles = React.lazy(()=>import("../pages/tms/Roles/RoleList"));
const AddRole = React.lazy(()=>import("../pages/tms/Roles/AddRole"));
const EditRole = React.lazy(()=>import("../pages/tms/Roles/UpdateRole"));
const UserPermission = React.lazy(()=>import("../pages/tms/user/UserPermission"));
// Route keys for easy reference
export const routeKeys = {
  LOGIN: "login",
  DASHBOARD: "dashboard",
  COMPANIES: "companies",
  TRIPS: "trips",
  DRIVERS: "drivers",
};

// Route configuration array
export const routes = [
  {
    path: "/login",
    element: <Login />,
    public: true,
    name: "Login",
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    permission: "view_dashboard",
    name: "Dashboard",
    module: "General",
  },
  {
    path: "/companies",
    element: <Companies />,
    permission: "view_company",
    name: "Companies",
    module: "Masters",
  },
  {
    path:"/add-new-company",
    element:<AddNewCompany/>,
    name: "Add Company",
    permission:"create_company",
  },
  {
    path: "/update-company/:companyId",
    element: <UpdateNewCompany />,
    name: "Update Company",
    
  },
 
  {
    path:"/user",
    element:<User/>,
    permission:"view_user",
    name: "Users",
    module: "Access Control",
  },
  {
    path:"/AddUser",
    element:<AddUser/>,
    name: "Add User",
  },
  {
    path:"/EditUser/:userId",
    element:<EditUser/>,
    name: "Edit User",
  },
  {
    path: "/drivers",
    element: <Drivers />,
    permission: "view_driver",
    name: "Drivers",
    module: "Fleet",
  },
  {
    path:"/add-drivers",
    element:<AddDriver/>,
    name: "Add Driver",
  },
  {
    path:"/edit-drivers/:id",
    element:<UpdateDriver/>,
    name: "Update Driver",
  },
  {
    path:"/vehicle-list",
    element:<VehicleList/>,
    permission:"view_vehicle",
    name: "Vehicles",
    module: "Fleet",
  },
  {
    path:"/Add-Vehicle",
    element:<AddVehicle/>,
    name: "Add Vehicle",
  },
  {
    path:"/update-vehicle/:id",
    element:<UpdateVehicle/>,
    name: "Update Vehicle",
  },
  {
    path:"/vehicle-assign",
    element:<VehicleDriverAssign/>,
    permission:"assign_driver_to_vehicle",
    name: "Vehicle–Driver-Assignment",
    module: "Fleet Mapping",
  },
  {
    path:"/vehicle-Driver-Assignment-History",
    element:<VehicleDriverAssignmentHistory/>,
    permission:"view_vehicle_driver_assignment_history",
    name: "Assignment History",
    module: "Fleet Mapping",
  },
  {
    path:"/Get-Vehicle-Current-Driver",
    element:<GetVehicleCurrentDriver/>,
    name: "Vehicle Current Driver",
    hidden: true,
  },
  {
    path:"/Get-current-Driver-Vehicle",
    element:<GetcurrentDriverVehicle/>,
    name: "Driver Current Vehicle",
    hidden: true,
  },
  {
    path:"/route-master",
    element:<Route/>,
    permission:"view_route",
    name: "Route Master",
    module: "Masters",
  },
  {
    path:"/add-route",
    element:<AddRoute/>,
    name: "Add Route-master",
  },
  {
    path:"/edit-route/:id",
    element:<EditRoute/>,
    name: "Edit Route",
  },

{
  path:"/party",
  element:<Party/>,
  permission:"view_party",
  name: "Party",
  module: "Masters",
},
{
  path:"/add-party",
  element:<AddParty/>,
  name: "Add Party",
},
{
  path:"/edit-party/:id",
  element:<EditParty/>,
  name: "Edit Party",
},

{
  path:"/job-list",
  element:<JobList/>,
  permission:"view_job",
  module: "Operations",
  name: "Job List",
},
{
  path:"/add-jobs",
  element:<AddJobs/>,
  name: "Add Jobs",
},
{
  path:"/update-jobs/:id",
  element:<UpdateJobs/>,
  name: "Update Jobs",
},
 {
    path: "/trips",
    element: <Trips />,
    permission: "view_trip",
    name: "Trips",
    module: "Operations",
  },
  {
    path: "/add-trip",
    element: <AddTrip />,
    name: "Add Trip",
  },
  {
    path: "/update-trip/:id",
    element: <UpdateTrip />,
    name: "Update Trip",
  },

  {
    path:"/add-trip-advance/:id",
    element:<AddTripAdvance/>,
    name:"Trip Advance",
  },

  {
    path:"/trip-expence/:id",
    element:<TripExpence/>,
    name:"Trip Expence"
  },

  {
    path:"/pod/:tripId",
    element:<POD/>,
    name:"POD"
  },
  {
    path:"/rate-contract",
    element:<RateContract/>,
    name:"Rate-contract",
    permission:"view-rate-contract",
    module: "Operations",
  },
  {
    path:"/add-rate-contract",
    element:<AddRateContract/>,
    name:"Add-rate-contract",
    permission:"create-rate-contract",
    hidden: true,
  },
  {
    path:"/part-advance",
    element:<PartyAdvance/>,
    name:"Party Advance",
    permission:"view-party-advance",
    module:'Operations'
  },
  {
    path:"/add-part-advance",
    element:<AddPartyAdvance/>,
    permission:"create-party-advance",
    // name:"Create-party-advance"
    hidden: true,
  },
  {
    path:"/roles",
    element:<Roles/>,
    name:"Roles",
    permission:"view_role",
    module: "Access Control",
  },
  { 
      path:"/add-role",
      element:<AddRole/>,
      // name:"Add Role",
      permission:"create_role",
       hidden: true,
  },
  {
    path:"/edit-role/:id",
    element:<EditRole/>,
    // name:"Edit Role",
    permission:"edit_role",
     hidden: true,
  },
  {
    path:"/user-permission/:userId",
    element:<UserPermission/>,
    name:"User Permission",
    hidden: true,
    permission:"view_user_permission",
  }
];