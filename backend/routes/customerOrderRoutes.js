const express = require("express");
const router = express.Router();
const {
  addOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
  addRazorPayOrder,
  createOrderByRazorPay,
  sendEmailInvoiceToCustomer,
} = require("../controller/customerOrderController");

const { emailVerificationLimit } = require("../lib/email-sender/sender");

//add a order
router.post("/add", addOrder);

// create stripe payment intent
router.post("/create-payment-intent", createPaymentIntent);

//add RazorPay order
router.post("/add/RazorPay", addRazorPayOrder);

//add a order by RazorPay
router.post("/create/RazorPay", createOrderByRazorPay);

//get a order by id
router.get("/:id", getOrderById);

//get all order by a user
router.get("/", getOrderCustomer);

//#send email invoice to customer
router.post(
  "/customer/invoice",
  emailVerificationLimit,
  sendEmailInvoiceToCustomer
);

module.exports = router;
