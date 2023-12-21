import React from 'react'
import SignUp from './SignUp';
import LogIn from './LogIn';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Pos from './Pos';
import EditProduct from './EditProduct';
import EditMenu from './EditMenu';
import Fooders from './Fooders';
import Dashboard from './Dashboard';
import Main from './Main';
import Menu from './Menu';
import Products from './Products';
import Customers from './Customers';
import Orders from './Orders';
import Profile from './Profile';
import OrderDetails from './OrderDetails';
import Documents from './Document';
import EditFooder from './EditFooder';
import Users from './Users';
import Staff from './Staffs';
import EditStaff from './EditStaff';
import SupportTicket from './SupportTicket';

const NavRoute = () => {

    return (

        <div>

            <Router>
                <Routes>
                    <Route path="/khateraho" element={<Main />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/fooders" element={<Fooders />} />
                    <Route path="/menus" element={<Menu />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/document" element={<Documents />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/staffs" element={<Staff />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/support-tickets" element={<SupportTicket />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/order/details" element={<OrderDetails />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/" element={<LogIn />} />
                    <Route path="/pos" element={<Pos />} />
                    <Route path="/product/edit" element={<EditProduct />} />
                    <Route path="/menu/edit" element={<EditMenu />} />
                    <Route path="/fooder/edit" element={<EditFooder />} />
                    <Route path="/staff/edit" element={<EditStaff />} />
                </Routes>
            </Router>
        </div>
    )
}

export default NavRoute