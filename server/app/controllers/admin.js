const { insert_user, sign_in, fooder_data, customers_data,
    orders_data, update_profile, update_password, get_user,
    fooder_menus, fooder_products, fooder_documents,
    orders_detail, get_Product, delete_Product, edit_Product,
    get_Menu, edit_Menu, edit_Product_status,
    delete_menu, edit_Fooder, add_Menu,
    edit_fooder_status, get_User, edit_User_status,
    edit_staff_status, get_staff, get_supports_tickets } = require('../modals/admin')

const signUp = async (req, res) => {
    insert_user(req, res)
};

const signIn = async (req, res) => {
    sign_in(req, res)
};

const getUser = async (req, res) => {
    get_user(req, res)
};

const updateProfile = async (req, res) => {
    update_profile(req, res)
};

const updatePassword = async (req, res) => {
    update_password(req, res)
};

const customers = (req, res) => {
    customers_data(req, res)
}

const getUsers = (req, res) => {
    get_User(req, res)
}

const editUsersStatus = (req, res) => {
    edit_User_status(req, res)
}

const getSupportTickets = (req, res) => {
    get_supports_tickets(req, res)
}

const getstaff = (req, res) => {
    get_staff(req, res)
}

const editStaffsStatus = (req, res) => {
    edit_staff_status(req, res)
}

const fooders = (req, res) => {
    fooder_data(req, res)
}

const editFooder = (req, res) => {
    edit_Fooder(req, res)
}

const updateFooderStatus = (req, res) => {
    edit_fooder_status(req, res)
}

const foodersMenus = (req, res) => {
    fooder_menus(req, res)
}

const getMenu = (req, res) => {
    get_Menu(req, res)
}

const addMenu = (req, res) => {
    add_Menu(req, res)
}

const updateMenu = (req, res) => {
    edit_Menu(req, res)
}

const deleteMenu = (req, res) => {
    delete_menu(req, res)
}

const foodersProducts = (req, res) => {
    fooder_products(req, res)
}

const getProduct = (req, res) => {
    get_Product(req, res)
}

const editProduct = (req, res) => {
    edit_Product(req, res)
}

const updateProdStatus = (req, res) => {
    edit_Product_status(req, res)
}

const deleteProduct = (req, res) => {
    delete_Product(req, res)
}

const foodersDocuments = (req, res) => {
    fooder_documents(req, res)
}

const orders = (req, res) => {
    orders_data(req, res)
}

const ordersDetails = (req, res) => {
    orders_detail(req, res)
}

module.exports = {
    signUp, signIn, customers, fooders, orders, updateProfile,
    updatePassword, getUser, foodersMenus, foodersProducts, foodersDocuments,
    ordersDetails, getProduct, deleteProduct, editProduct, updateMenu,
    updateProdStatus, deleteMenu, editFooder, getMenu, addMenu, updateFooderStatus,
    editUsersStatus, getUsers, getSupportTickets, getstaff, editStaffsStatus
};