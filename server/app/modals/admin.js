const pool = require('./db')
const Password = require("node-php-password");
const phpUnserialize = require('php-serialize');

const get_user = async (req, res) => {
    try {
        const userId = req.body.data
        const sql = `SELECT email, name FROM admin.admin_users WHERE userId = "${userId}"`
        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error in get user");
                //  res.status(200).send({ err, error: true, message: "Something went wrong" })
            }
            else {
                res.status(200).send(result)
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const insert_user = async (req, res) => {
    try {
        if (!req.body.data) return res.send({ message: " empty fields not acceptable", error: true })
        else {
            const { email, name, status, mobile_num, addStaff } = req.body.data
            const password = Password.hash(req.body.data.password);

            const sql = `INSERT INTO admin.admin_users(name, email, password) VALUES ("${name}", "${email}", "${password}");`
            const sql2 = `INSERT INTO admin.admin_users(name, email, password, mobile_num, status) VALUES ("${name}", "${email}", "${password}", "${mobile_num}", "${status}");`
            const query = addStaff ? sql2 : sql

            await pool.execute(query, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting data')
                    // res.status(200).send({ err, error: true, message: "Something went wrong" })
                }
                else {
                    res.status(200).send({ message: "User added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}
const sign_in = async (req, res) => {
    try {
        if (!req.body) return res.send({ message: " username cannot be empty", error: true })
        else if (!req.body.email) return res.send({ message: " Username cannot be empty!", error: true })
        else if (!req.body.password) return res.send({ message: " Password cannot be empty.", error: true })
        else {
            const sql = `SELECT * FROM admin.admin_users WHERE email = "${req.body.email}"`
            await pool.execute(sql, (err, result) => {
                if (!result || err) { res.status(200).send({ message: "User not Found", error: true, }) }
                const isUser = result[0]?.email == req.body.email

                if (isUser) {
                    const hash = result[0].password
                    if (Password.verify(req.body.password, hash)) {
                        const { name, email, userId } = result[0]
                        res.status(200).send({ message: "Sign in Successfully", error: false, status: true, user: { name, email, userId }, success: true })
                    } else {
                        res.status(200).send({ message: "Your password is incorrect", error: true })
                    }
                } else {
                    res.status(200).send({ message: "User not Found", error: true, })
                }

            })
        }

    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
};

const update_profile = async (req, res) => {

    try {
        if (!req.body.data) return res.send({ message: " empty fields not acceptable" })
        else {
            const { userId, email, name, editprofile, status, mobile_num } = req.body.data

            const sql = `UPDATE admin_users SET name = "${name}", email = "${email}" WHERE userId = ${userId} ;`
            const sql2 = `UPDATE admin_users SET name = "${name}", email = "${email}", status = "${status}",
        mobile_num = "${mobile_num}" WHERE userId = ${userId} ;`

            const query = editprofile ? sql2 : sql
            await pool.execute(query, (err, result) => {
                if (!result || err) {
                    console.log('Error in update profile')
                    res.status(200).send({ err, error: true, message: "Something went wrong" })
                }
                else {
                    res.status(200).send({ message: " Profile  updated successfully", error: false, success: true, })
                }
            })
        }
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }

}

const update_password = async (req, res) => {

    try {
        if (!req.body.data) return res.send({ message: " empty fields not acceptable", error: true })
        else {
            const { userId, password } = req.body.data

            const newPassword = Password.hash(password);
            const sql = `UPDATE admin.admin_users SET password = "${newPassword}" WHERE userId = ${userId} ;`
            await pool.execute(sql, (err, result) => {
                if (result) { res.status(200).send({ message: "password updated successfully", error: false, success: true }) }
                else { res.status(200).send({ err, error: true, message: "Something went wrong" }) }
            })
        }
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const get_supports_tickets = async (req, res) => {
    const { limit, skip } = req.headers
    try {
        const sql = `SELECT id, status, subject, description, created_date, ip, f.name,
        f.username,
        f.landline,
        f.login_mobile_number, (SELECT COUNT(*) FROM support_ticket) AS total_counts
        FROM admin.support_ticket
        LEFT JOIN admin.fooders AS f ON f.fooder_id = support_ticket.fooder_id ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}`

        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error in get user");
                //  res.status(200).send({ err, error: true, message: "Something went wrong" })
            }
            else {
                res.status(200).send({ data: result, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }

}

const get_staff = async (req, res) => {

    try {
        const { limit, skip, userid } = req.headers

        const sql = `SELECT userId, name, email, status, mobile_num, type, (SELECT COUNT(*) FROM admin_users) AS total_counts
         FROM admin_users LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT userId, name, email, status, mobile_num, type
         FROM admin_users WHERE userId = ${userid} ;`

        const query = userid ? sql2 : sql
        await pool.execute(query, (err, result) => {
            if (result) {
                res.status(200).send({ data: result, success: true, error: false })
            }
            else {
                console.log("Error in edit staff")
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}


const edit_staff_status = async (req, res) => {

    try {
        const { userid, changetype } = req.headers
        const { status, type } = req.body

        const sql = `UPDATE  admin.admin_users SET status = "${status}" WHERE userId = "${userid}" `
        const sql2 = `UPDATE  admin.admin_users SET type = "${type}" WHERE userId = "${userid}" `
        const query = changetype ? sql2 : sql
        await pool.execute(query, (err, result) => {
            if (result) {
                res.status(200).send({ message: `successfully updated`, success: true, error: false })
            } else {
                console.log("Error in edit staff")
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}


const customers_data = async (req, res) => {
    const { limit, skip } = req.headers
    const sql = `SELECT 
    o.eater_name, 
    o.eater_phonenumber, 
    o.eater_id, 
    COUNT(oi.order_id) AS order_count,
    (SELECT COUNT(*) FROM admin.orders) AS total_counts
FROM admin.orders AS o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.eater_name, o.eater_phonenumber, o.eater_id, o.creation_date
    ORDER BY creation_date DESC LIMIT ${limit} OFFSET ${skip}`
    await pool.execute(sql, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            res.status(200).send({ data: result, success: true, error: false })
        }
    })
}

const get_User = async (req, res) => {
    const { limit, skip } = req.headers

    const sql = `SELECT name, mobile, region, address, status, eater_id, joining_date,(
        SELECT COUNT(eater_id) AS NumberOfusers FROM admin.eaters
    ) AS total_counts 
    FROM admin.eaters ORDER BY joining_date DESC LIMIT ${limit} OFFSET ${skip}`
    await pool.execute(sql, (err, result) => {
        if (!result || err) {
            res.status(200).send({ message: "Something went wrong", error: true, })
        }
        else {
            res.status(200).send({ data: result, success: true, error: false })
        }
    })
}


const edit_User_status = async (req, res) => {
    const { eater_id } = req.headers
    const status = req.body.status

    const sql = `UPDATE  admin.eaters SET status = "${status}" WHERE eater_id = "${eater_id}" `
    await pool.execute(sql, (err, result) => {
        if (!result || err) {
            res.status(200).send({ message: "Something went wrong", error: true, })
        }
        else {
            res.status(200).send({ success: true, message: " Update Successfully", error: false })
        }
    })
}

const fooder_data = async (req, res) => {
    const { limit, skip, id, editfooder, showfoodersname } = req.headers

    const sql = `SELECT
    f.fooder_id,
    f.name,
    f.username,
    f.landline,
    f.login_mobile_number,
    f.address,
    f.joining_date,
    f.is_approved,
    f.timestamp, f.location_name,
    total_counts.NumberOfFooders
FROM admin.fooders AS f
CROSS JOIN (
    SELECT COUNT(*) AS NumberOfFooders FROM admin.fooders
) AS total_counts ORDER BY joining_date DESC LIMIT ${limit} OFFSET ${skip}`

    const sql2 = `SELECT
f.fooder_id,
f.name,
f.username,
f.login_mobile_number,
f.address, f.is_approved ,f.location_name,
FROM admin.fooders AS f WHERE f.fooder_id = "${id}"`

    const sql3 = `SELECT  
    f.name, f.started_on, f.landline, f.upi_address, f.fssai_number,
    f.upi_image, f.gstin, f.address, fd.type, fd.service_charge,
    fd.facilities, fd.daily_hrs, fd.logo, fd.tax1_value, 
    fd.tax2_name, fd.tax2_value
FROM admin.fooders as f
LEFT JOIN admin.fooders_details AS fd ON f.fooder_id = fd.fooder_id
WHERE f.fooder_id = "${id}";`

    const sql4 = `SELECT name, fooder_id FROM admin.fooders;`

    const query = id ? (editfooder ? sql3 : sql2) : (showfoodersname ? sql4 : sql)

    await pool.execute(query, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            const facilities = result[0]?.facilities || []
            const daily_hrs = result[0]?.daily_hrs || []
            if (facilities.length && daily_hrs.length) {
                const deserialized_facilities = phpUnserialize.unserialize(facilities);
                const deSeria_daily_hrs = phpUnserialize.unserialize(daily_hrs);
                res.status(200).send({ data: result, deSeria_daily_hrs, deserialized_facilities })
            } else {
                res.status(200).send({ data: result })
            }
        }
    })
}

// f.upi_image = "${qrImage.name}",
// fd.logo = "${logo.name}",

const edit_Fooder = async (req, res) => {

    const { id } = req.headers
    const { address, name, date, facilities, fssai_number, gstin, landline
        , logo, qrImage, service_charge, tax1_value, tax2_name, tax2_value, time, type, upi_address } = JSON.parse(req.body.data)

    const deserialized_facilities = facilities ? phpUnserialize.serialize(facilities) : [];
    const deSeria_daily_hrs = time ? phpUnserialize.serialize(time) : [];

    const sql = `UPDATE fooders AS f
    JOIN fooders_details AS fd ON f.fooder_id = fd.fooder_id
    SET 
      f.name = ?,
      f.started_on = ?,
      f.landline = ?,
      f.upi_address = ?,
      f.fssai_number = ?,
      f.gstin = ?,
      f.address = ?,
      fd.type = ?,
      fd.service_charge = ?,
      fd.facilities = ?,
      fd.daily_hrs = ?,
      fd.tax1_value = ?,
      fd.tax2_name = ?,
      fd.tax2_value = ?
    WHERE f.fooder_id = ?`;

    const values = [
        name, date, landline, upi_address, fssai_number, gstin, address,
        type, service_charge, deserialized_facilities, deSeria_daily_hrs,
        tax1_value, tax2_name, tax2_value, id
    ];

    await pool.execute(sql, values, (err, result) => {
        if (!result || err) {
            res.status(200).send({ message: "Something went wrong", error: true, err })
        }
        else {
            res.status(200).send({ message: "Fooder has updated successfully", error: false })
        }
    })
}

const edit_fooder_status = async (req, res) => {
    const { fooder_id } = req.headers
    const status = req.body.status

    const sql = `UPDATE  admin.fooders SET is_approved = "${status}" WHERE fooder_id = "${fooder_id}" `
    await pool.execute(sql, (err, result) => {
        if (!result || err) {
            console.log("err", err)
            res.status(200).send({ message: "Something went wrong", error: true, })
        }
        else {
            res.status(200).send({ success: true, message: " Update Successfully", error: false })
        }
    })
}

const fooder_menus = async (req, res) => {
    const { limit, skip, fooder_id } = req.headers

    const sql1 = `SELECT
    fm.name AS 'menu_name',
        fm.fooder_id, fm.id,
        fm.status,
        fm.description,
        fm.entry_date,
        fm.tags,
        f.name AS 'fooder_name',
            COUNT(fp.menu_id) AS 'product_count',
                (SELECT COUNT(*) FROM admin.fooders_menus WHERE fooder_id = ${fooder_id}) AS 'total_item'
FROM admin.fooders_menus fm
LEFT JOIN fooders f ON fm.fooder_id = f.fooder_id
LEFT JOIN fooders_products fp ON fm.id = fp.menu_id
WHERE fm.fooder_id = "${fooder_id}"
GROUP BY fm.id ORDER BY entry_date DESC LIMIT ${limit} OFFSET ${skip} `

    const sql2 = `SELECT
    fm.name AS 'menu_name',
        fm.fooder_id, fm.id,
        fm.status,
        fm.description,
        fm.entry_date,
        fm.tags,
        f.name AS 'fooder_name',
            COUNT(fp.menu_id) AS 'product_count',
                total_counts.TotalItem AS 'total_item'
FROM admin.fooders_menus fm
LEFT JOIN fooders f ON fm.fooder_id = f.fooder_id
LEFT JOIN fooders_products fp ON fm.id = fp.menu_id
CROSS JOIN(
                    SELECT COUNT(*) AS TotalItem FROM admin.fooders_menus
                ) AS total_counts
GROUP BY fm.id, total_counts.TotalItem
ORDER BY entry_date DESC LIMIT ${limit} OFFSET ${skip} `

    const query = fooder_id ? sql1 : sql2

    await pool.execute(query, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            res.status(200).send({ data: result })
        }
    })
}

const add_Menu = async (req, res) => {
    const { description, name, status, tags, fooder_id } = JSON.parse(req.body.data)

    const timestamp = new Date().valueOf();
    const sql = `INSERT INTO admin.fooders_menus ( name, tags, description, status, fooder_id, entry_date, image )
     VALUES ( "${name}", "${tags}", "${description}", "${status}", "${fooder_id}", "${timestamp}", "") `

    await pool.execute(sql, (err, result) => {
        if (!result || err) {
            console.error('Error:', err);
            res.status(200).send({ message: "Something went wrong", error: true, err })
        }
        else {
            res.status(200).send({ message: "Menu Added successfully", error: false, success: true })
        }
    })
}

const get_Menu = async (req, res) => {
    const { id, showmenus, fooder_id } = req.headers
    const sql = `SELECT name, tags, description, id, status FROM admin.fooders_menus WHERE id = "${id}" `
    const sql2 = `SELECT name, id FROM admin.fooders_menus WHERE fooder_id = "${fooder_id}" `

    const query = (fooder_id && showmenus) ? sql2 : sql

    await pool.execute(query, (err, result) => {
        if (!result || err) {
            res.status(200).send({ message: "Something went wrong", error: true, })
        }
        else {
            res.status(200).send({ data: result, error: false })
        }
    })
}

const edit_Menu = async (req, res) => {
    const { id } = req.headers
    const { description, name, status, tags } = JSON.parse(req.body.data)

    const sql = `UPDATE admin.fooders_menus SET name = "${name}", tags = "${tags}",
     description = "${description}", status = "${status}"  WHERE id = "${id}" `

    await pool.execute(sql, (err, result) => {
        if (!result || err) {
            res.status(200).send({ message: "Something went wrong", error: true, })
        }
        else {
            res.status(200).send({ message: "Menu has updated successfully", error: false })
        }
    })
}

const delete_menu = async (req, res) => {
    const { id } = req.body
    const sql = `DELETE FROM admin.fooders_menus WHERE id = "${id}" `
    await pool.execute(sql, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            res.status(200).send({ data: result, message: "Remove Product successfully", error: false })
        }
    })
}

const fooder_products = async (req, res) => {
    const { limit, skip, fooder_id, editproduct } = req.headers

    const sql1 = `SELECT
    fp.name AS product_name, fp.id,
        fp.price,
        fp.proprice,
        fp.status,
        fp.tags,
        fp.picture,
        fp.preparation_time,
        fp.description,
        fp.top_rated,
        fp.best_seller,
        fp.most_ordered,
        fp.entry_date,
        fp.details, fp.product_type,
        fm.name AS menu_name,
        f.name AS fooder_name,
            (SELECT COUNT(*) FROM admin.fooders_products WHERE fooder_id = "${fooder_id}") AS 'total_item'
    FROM
    admin.fooders_products AS fp
LEFT JOIN
    fooders_menus AS fm ON fp.menu_id = fm.id 
    LEFT JOIN
    fooders AS f ON f.fooder_id = fm.fooder_id 
    WHERE fp.fooder_id = "${fooder_id}" 
    ORDER BY fp.entry_date DESC LIMIT ${limit} OFFSET ${skip} `

    const sql2 = `SELECT
    fp.name AS product_name,
        fp.price, fp.id,
        fp.proprice,
        fp.status,
        fp.tags,
        fp.picture,
        fp.preparation_time,
        fp.description,
        fp.top_rated,
        fp.best_seller,
        fp.most_ordered,
        fp.entry_date,
        fp.details, fp.product_type,
        fm.name AS menu_name,
        f.name AS fooder_name,
            (SELECT COUNT(*) FROM admin.fooders_products) AS total_item
    FROM
    admin.fooders_products AS fp
LEFT JOIN
    fooders_menus AS fm ON fp.menu_id = fm.id 
    LEFT JOIN
    fooders AS f ON f.fooder_id = fm.fooder_id 
ORDER BY fp.entry_date DESC LIMIT ${limit} OFFSET ${skip} `

    const sql3 = `SELECT fp.variant4, fp.variant3, fp.variant2, fp.variant1, fp.top_rated,
fp.status, fp.proprice, fp.product_type, fp.tags, fp.name AS product_name,
fp.price, fp.preparation_time, fp.picture, fp.most_ordered, fm.name AS menu_name,
fp.menu_id, fp.id, fp.description, fp.best_seller FROM admin.fooders_products AS fp
JOIN fooders_menus AS fm ON menu_id = fm.id WHERE fp.id = "${fooder_id}"`

    const query = fooder_id ? (editproduct ? sql3 : sql1) : sql2

    await pool.execute(query, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            res.status(200).send({ data: result })
        }
    })
}

const get_Product = async (req, res) => {
    const { id } = req.headers
    const sql = `SELECT * FROM admin.fooders_products WHERE id = "${id}" `
    await pool.execute(sql, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            res.status(200).send({ data: result })
        }
    })
}

const delete_Product = async (req, res) => {
    const { id } = req.body
    const sql = `DELETE FROM admin.fooders_products WHERE id = "${id}" `
    await pool.execute(sql, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            res.status(200).send({ data: result, message: "Remove Product successfully" })
        }
    })
}

const edit_Product = async (req, res) => {
    const { id } = req.body
    const sql = `UPDATE * FROM admin.fooders_products WHERE id = "${id}" `
    await pool.execute(sql, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            res.status(200).send({ data: result, message: "Remove Product successfully" })
        }
    })
}

const edit_Product_status = async (req, res) => {
    const { id, status } = req.body
    const sql = `UPDATE  admin.fooders_products SET status = "${status}" WHERE id = "${id}" `
    await pool.execute(sql, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            res.status(200).send({ data: result, message: "Remove Product successfully", error: false })
        }
    })
}

const fooder_documents = async (req, res) => {
    const { limit, skip, fooder_id } = req.headers
    const sql = `SELECT * FROM admin.fooders_products WHERE fooder_id = "${fooder_id}" ORDER BY entry_date DESC LIMIT ${limit} OFFSET ${skip} `
    await pool.execute(sql, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            res.status(200).send({ data: result })
        }
    })
}

const orders_data = async (req, res) => {
    const { limit, skip } = req.headers

    const sql = `SELECT
    orders.id AS order_id,
        orders.order_number_qrcode AS qr_code_number,
            orders.total,
            orders.eater_suggestions,
            orders.table_id,
            orders.eater_phonenumber,
            orders.order_date,
            orders.fooder_id,
            orders.eater_id,
            orders.eater_name,
            orders.payment_type,
            orders.creation_date,
            orders.payment_status,
            orders.status,
            fooders_tables.table_name AS fooder_table,
                (SELECT COUNT(*) FROM orders) AS TotalItem
    FROM
    orders
LEFT JOIN
    fooders_tables
    ON
    orders.table_id = fooders_tables.id
ORDER BY
    creation_date DESC LIMIT ${limit} OFFSET ${skip} `

    await pool.execute(sql, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            res.status(200).send({ data: result })
        }
    })
}

const orders_detail = async (req, res) => {
    const { order_id } = req.headers
    const sql = `SELECT
    oi.fooder_name AS order_foode_name,
        oi.product_name,
        oi.quantity,
        oi.product_price,
        oi.product_proprice,
        oi.last_updated,
        oi.addon_item,
        o.service_charge_details,
        o.tax_details,
        o.eater_suggestions,
        o.eater_name AS order_eater_name,
            o.eater_phonenumber AS order_eater_phonenumber,
                o.fooder_name AS order_foode_name_in_order,
                    o.creation_date,
                    o.status, o.discount_type, o.discount_rate,
                    o.order_date,
                    o.order_number_qrcode,
                    f.login_mobile_number, f.state, f.city
FROM admin.order_items AS oi
LEFT JOIN orders AS o ON oi.order_id = o.id
LEFT JOIN fooders AS f ON oi.fooder_id = f.fooder_id
 WHERE oi.order_id = "${order_id}" ORDER BY last_updated DESC`

    await pool.execute(sql, (err, result) => {
        if (!result || err) { res.status(200).send({ message: "Something went wrong", error: true, }) }
        else {
            res.status(200).send({ data: result })
        }
    })
}


module.exports = {
    insert_user, sign_in, get_user,
    fooder_data, customers_data, orders_data,
    update_profile, update_password, fooder_menus,
    fooder_products, fooder_documents, orders_detail,
    get_Product, delete_Product, edit_Product, edit_Product_status,
    edit_Menu, delete_menu, get_Menu, edit_Fooder, add_Menu, edit_fooder_status,
    edit_User_status, get_User, get_staff, edit_staff_status, get_supports_tickets
}
