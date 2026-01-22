import React from "react";

const Login = React.lazy(()=>import("../pages/tms/auth/Login"))
const Dashboard = React.lazy(()=>import("../pages/tms/dashboard/DashBoard"))
const Trips = React.lazy(()=>import("../pages/tms/Trips/Trips"))
const User = React.lazy(()=>import("../pages/tms/user/UserList"))
const AddUser = React.lazy(()=>import("../pages/tms/user/AddUser"))
const EditUser = React.lazy(()=>import("../pages/tms/user/EditUser"))
const Companies = React.lazy(()=>import("../pages/tms/companies/Companies"))
const Drivers = React.lazy(()=>import("../pages/tms/driver/Driver"));
const AddDriver = React.lazy(()=>import("../pages/tms/driver/AddDriver"));
const UpdateDriver = React.lazy(()=>import("../pages/tms/driver/UpdateDriver"));
const AddNewCompany = React.lazy(()=>import("../pages/tms/companies/AddNewCompany"))
const UpdateNewCompany = React.lazy(()=>import("../pages/tms/companies/UpdateNewCompany"))
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
    public: true, // anyone can access
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    permission: "dashboard", // required permission
  },
  {
    path: "/companies",
    element: <Companies />,
    permission: "companies", // required permission
  },
  {
    path:"/add-new-company",
    element:<AddNewCompany/>,
  },
  {
  path: "/update-company/:companyId",
  element: <UpdateNewCompany />
},
  {
    path: "/trips",
    element: <Trips />,
    permission: "create-trips", // required permission
  },
  {
    path:"/user",
    element:<User/>,
    permission:"user-list"
  },
   {
    path:"/AddUser",
    element:<AddUser/>,
  },
  {
    path:"/EditUser/:userId",
    element:<EditUser/>,
  },
    {
    path: "/drivers",
    element: <Drivers />,
    permission: "drivers-list", // required permission
  },
  {
    path:"/add-drivers",
    element:<AddDriver/>
  },
  {
    path:"/edit-drivers/:id",
    element:<UpdateDriver/>
  }
];