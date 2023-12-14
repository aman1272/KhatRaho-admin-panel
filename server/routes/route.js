const express = require('express');
const router = express.Router();
const { signUp, signIn, fooders, customers, orders,
    updateProfile, updatePassword, getUser, foodersMenus,
    foodersProducts, foodersDocuments, ordersDetails, getProduct,
    deleteProduct, editProduct, updateProdStatus, updateMenu
    , deleteMenu, editFooder, getMenu, addMenu,
    updateFooderStatus, editUsersStatus, getUsers,
    getSupportTickets, getstaff, editStaffsStatus } = require('../app/controllers/admin')

router.post("/user/detail", getUser);
router.post("/signin", signIn);
router.post("/signup", signUp);
router.put("/profile/update", updateProfile);
router.put("/password/update", updatePassword);

router.get("/get/users", getUsers);
router.put("/edit/user/status", editUsersStatus);
router.get("/get/staff", getstaff);
router.put("/edit/staff", editStaffsStatus);

router.get("/fooders", fooders);
router.put("/edit/fooder", editFooder);
router.put("/edit/fooder/status", updateFooderStatus);
router.get("/fooders/menus", foodersMenus);
router.get("/menu", getMenu);
router.post("/add/menu", addMenu);
router.post("/menu/delete", deleteMenu);
router.put("/edit/menu", updateMenu);


router.get("/fooders/products", foodersProducts);
router.get("/products/get", getProduct);
router.post("/products/edit", editProduct);
router.post("/products/change/status", updateProdStatus);
router.post("/product/delete", deleteProduct);

router.get("/customers", customers);
router.get("/get/support-ticket/data", getSupportTickets);

router.get("/orders", orders);
router.get("/orders/details", ordersDetails);


module.exports = router;