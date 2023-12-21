import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import WithBootstrap from "../WithBootstrap";
import Sidebar from "./Sidebar";

const OrdersDetails = () => {
    const navigate = useNavigate();
    const currency = ` ₹ `
    const [showComponent, setShowComponent] = useState(false);
    const [orderDetails, setOrdersDetails] = useState([])
    const [alert, setAlert] = useState({})
    const [toggle, setToggle] = useState({})


    useEffect(() => {
        const order_id = window.sessionStorage.getItem('order_id')
        if (order_id) {
            getOrdersDetail(order_id)
        }
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, []);


    const getOrdersDetail = async (order_id) => {
        try {
            const response = await axios({
                url: "http://localhost:8000/orders/details",
                method: "GET",
                headers: {
                    order_id
                }
            })
            console.log("response", response.data)
            if (!response.data.error) { setOrdersDetails(response?.data?.data) }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getOrdersCartData = () => {
        if (orderDetails.length) {
            let charges = JSON?.parse(orderDetails[0]?.service_charge_details)
            let taxes = JSON?.parse(orderDetails[0]?.tax_details)
            const serviceChargeName = charges?.name
            const serviceChargePerc = charges?.percentage
            const totalAmount = orderDetails?.reduce((acc, order) => Number(acc) +
                Number((order.product_proprice || order.product_price) * order.quantity), 0);
            const discountType = orderDetails[0]?.discount_type
            const discountRate = orderDetails[0]?.discount_rate
            const discountPercentage = !discountType ? discountRate : ""
            const discountAmount = discountType ? discountRate : totalAmount * discountRate / 100
            const totalItem = orderDetails?.length
            const cgstTaxPercent = taxes[0]?.percentage
            const cgstTax = totalAmount * cgstTaxPercent / 100
            const sgstTaxPercent = taxes[1]?.percentage
            const sgstTax = totalAmount * sgstTaxPercent / 100
            const serviceCharge = serviceChargePerc * totalAmount / 100
            const totalTax = sgstTax + cgstTax + serviceCharge
            const finalPrice = totalAmount + totalTax - discountAmount

            const customerName = orderDetails[0]?.order_eater_name
            const customerNumber = orderDetails[0]?.order_eater_phonenumber
            const fooderName = orderDetails[0]?.order_foode_name
            const fooderNumber = orderDetails[0]?.login_mobile_number
            const state = orderDetails[0]?.state
            const city = orderDetails[0]?.city
            const Suggestions = orderDetails[0]?.eater_suggestions
            let status
            let status_class
            if (orderDetails[0]?.status == 0) { status = "Pending"; status_class = "order-status-pending" }
            else if (orderDetails[0]?.status == 1) { status = "Accept and Prepare Order"; status_class = "order-accept" }
            else if (orderDetails[0]?.status == 2) { status = "Order Ready"; status_class = "order-ready" }
            else if (orderDetails[0]?.status == 3) { status = "Delivered and paid"; status_class = "Unpaid" }
            if (orderDetails[0]?.status == 4) { status = "Reject"; status_class = "order-reject" }

            const orderNumber = orderDetails[0]?.order_number_qrcode
            const timestamp = orderDetails[0]?.creation_date * 1000
            const formatDate = (date) => {
                const months = [
                    'January', 'February', 'March', 'April', 'May', 'June', 'July',
                    'August', 'September', 'October', 'November', 'December'
                ];
                const month = months[date.getMonth()];
                const day = date.getDate();
                const year = date.getFullYear();
                let hours = date.getHours();
                const minutes = date.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                if (hours > 12) {
                    hours -= 12;
                }
                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                return ` ${day} ${month} ${year} · ${hours}:${formattedMinutes} ${ampm}`;
            }
            const currentDate = new Date(timestamp);
            const formattedDate = formatDate(currentDate);

            return {
                totalItem, totalAmount, sgstTax, cgstTax, sgstTaxPercent, cgstTaxPercent,
                finalPrice, serviceChargeName, serviceChargePerc, totalTax, serviceCharge,
                customerName, customerNumber, fooderName, fooderNumber, state, city, status,
                orderNumber, formattedDate, discountRate, discountAmount, discountPercentage,
                status_class, Suggestions
            }
        }
    }


    return (
        <>
            <Sidebar name={"Orders"} >
                {
                    showComponent ?

                        <div className=" content-wrapper" >
                            <div className="row">
                                <div className="col-sm-12 card card-rounded card-body">
                                    <div>
                                        <div className="table-responsive table-alone mt-2 ">
                                            <div className="d-flex justify-content-between" >
                                                <div>
                                                    <h5>Order Id # {getOrdersCartData().orderNumber}</h5>

                                                </div>
                                                <div>
                                                    <h5 className={`d-flex justify-content-center align-items-center`}>Status :<span className={`rounded-pill p-1 ${getOrdersCartData().status_class}`} >{getOrdersCartData().status}</span></h5>
                                                    <h5>Placed on : <span className="text-primary"  >{getOrdersCartData().formattedDate}</span> </h5>
                                                </div>
                                                <div>
                                                    <button type="button" class="btn btn-warning btn-sm" onClick={() => { }} ><div className="d-flex justify-content-center" ><i class="mdi mdi-printer vsalign"></i><span>Bill</span></div></button>
                                                    <button type="button" class="btn btn-dark btn-sm margin-between" onClick={() => { }} ><div className="d-flex justify-content-center" ><i class="mdi mdi-printer vsalign"></i><span>KOT</span></div></button>
                                                    <Link to="/orders"> <button type="button" class="btn btn-danger btn-sm" onClick={() => { }} ><div className="d-flex justify-content-center" ><i class="mdi mdi mdi-keyboard-backspace"></i><span>Go Back</span></div></button></Link>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between m-3" >
                                                <div>
                                                    {getOrdersCartData().fooderName && <h4>Fooder Name : {getOrdersCartData().fooderName}</h4>}
                                                    {getOrdersCartData().fooderNumber && <p><span class="mdi mdi-phone" />Number : {getOrdersCartData().fooderNumber}</p>}
                                                    <p><span class="mdi mdi-office-building"></span>{getOrdersCartData().state}/{getOrdersCartData().city}</p>
                                                </div>
                                                <div>
                                                    {getOrdersCartData().customerName && <h4>Customer Name : {getOrdersCartData().customerName}</h4>}
                                                    {getOrdersCartData().customerNumber && <p><span class="mdi mdi-phone" />Number : {getOrdersCartData().customerNumber}</p>}
                                                </div>
                                            </div>

                                            <table className="table select-table ">
                                                <thead>
                                                    <tr>
                                                        <th>S.NO.</th>
                                                        <th>PRODUCT NAME</th>
                                                        <th>PRICE</th>
                                                        <th> QUANTITY</th>
                                                        <th>TOTAL</th>
                                                    </tr>
                                                </thead>
                                                {orderDetails?.map((item, i) => {
                                                    const price = item.product_proprice ? item.product_proprice : item.product_price
                                                    const amount = price * item.quantity
                                                    return (
                                                        <>
                                                            <tbody className="border-table-row " >
                                                                <tr key={i}>
                                                                    <td>
                                                                        <p>{i + 1}</p>
                                                                    </td>
                                                                    <td>
                                                                        <p>{item.product_name}</p>
                                                                    </td>
                                                                    <td >
                                                                        <p >{price}</p>
                                                                    </td>
                                                                    <td>
                                                                        <p>{item?.quantity}</p>
                                                                    </td>
                                                                    <td>
                                                                        <p>{amount}</p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </>
                                                    )

                                                })}
                                            </table>
                                            <div >
                                                <div className="cart-items-right footerbtn" >
                                                    {getOrdersCartData().totalAmount && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                        <div className="d-flex">
                                                            <div className="wrapper">
                                                                <span className="totalwrd">Subtotal</span>
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <span className="text-danger" >{currency}{getOrdersCartData().totalAmount.toFixed(2)}</span>
                                                        </div>
                                                    </div>}
                                                    {(!!getOrdersCartData().discountAmount) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                        <div className="d-flex">
                                                            <div className="wrapper">
                                                                <span className="totalwrd">Discount ({getOrdersCartData().discountPercentage}%)</span>
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <span className="text-danger" >{currency}{getOrdersCartData().discountAmount.toFixed(2)}</span>
                                                        </div>
                                                    </div>}
                                                    {(!!getOrdersCartData().serviceCharge) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                        <div className="d-flex">
                                                            <div className="wrapper">
                                                                <span className="totalwrd">{getOrdersCartData().serviceChargeName}({getOrdersCartData().serviceChargePerc}%)</span>
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <span className="text-danger" >{currency}{getOrdersCartData().serviceCharge.toFixed(2)}</span>
                                                        </div>
                                                    </div>}
                                                    {(!!getOrdersCartData().cgstTax) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                        <div className="d-flex">
                                                            <div className="wrapper">
                                                                <span className="totalwrd">CGST({getOrdersCartData().cgstTaxPercent}%)</span>
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <span className="text-danger" >{currency}{getOrdersCartData().cgstTax.toFixed(2)}</span>
                                                        </div>
                                                    </div>}
                                                    {(!!getOrdersCartData().sgstTax) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                        <div className="d-flex">
                                                            <div className="wrapper">
                                                                <span className="totalwrd">SGST({getOrdersCartData().sgstTaxPercent}%)</span>
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <span className="text-danger" >{currency}{getOrdersCartData().sgstTax.toFixed(2)}</span>
                                                        </div>
                                                    </div>}
                                                    {(!!getOrdersCartData().finalPrice) && <div className="totaldiv wrapper d-flex align-items-center justify-content-between">
                                                        <div className="d-flex">
                                                            <div className="wrapper">
                                                                <h3 className="totalwrd">Total Amount Paid :</h3>
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <h3 className="totalwrd"><span className="" > {currency}{getOrdersCartData().finalPrice.toFixed(2)}</span></h3>
                                                        </div>
                                                    </div>}
                                                </div>
                                            </div>

                                        </div>
                                        <div className="totaldiv wrapper d-flex align-items-center justify-content-start wrapper p-3">
                                            <h5 className="totalwrd">  Eater Suggestions*</h5>
                                            {/* <p>hxbsxhisxinsx jb uhsiu uihsaio ioasho iahsoiashoihx oiashoixhsaoixh</p> */}
                                            <p>{getOrdersCartData().Suggestions}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <div class="text-center mt-5">
                            <div class="spinner-border" role="status">
                            </div>
                        </div>
                }
            </Sidebar>
        </>
    )
}
export default WithBootstrap(OrdersDetails)