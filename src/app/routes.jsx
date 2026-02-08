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
    permission: "dashboard",
    name: "Dashboard",
    module: "General",
  },
  {
    path: "/companies",
    element: <Companies />,
    permission: "companies",
    name: "Companies",
    module: "Masters",
  },
  {
    path:"/add-new-company",
    element:<AddNewCompany/>,
    name: "Add Company",
  },
  {
    path: "/update-company/:companyId",
    element: <UpdateNewCompany />,
    name: "Update Company",
  },
 
  {
    path:"/user",
    element:<User/>,
    permission:"user-list",
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
    permission: "drivers-list",
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
    permission:"vehicle-list",
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
    path:"/vehcile-assign",
    element:<VehicleDriverAssign/>,
    permission:"vehicle-driver-assignment",
    name: "Vehicle–Driver Assignment",
    module: "Fleet Mapping",
  },
  {
    path:"/vehicle-Driver-Assignment-History",
    element:<VehicleDriverAssignmentHistory/>,
    permission:"vehicle-Driver-Assignment-History",
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
    permission:"route-master",
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
  permission:"party-module",
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
  permission:"job-list",
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
    permission: "trip-list",
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
  }

];