const Invoice = require('../models/invoice.model');
const sgMail = require('@sendgrid/mail');
const apiKey = process.env.SENG_GRID_KEY;
const fromMail = process.env.SENG_GRID_MAIL;

sgMail.setApiKey(apiKey);

const jsonErrorHandler = (req, res, next, error) => {
    const errorObject = {
        api: req.originalUrl,
        message: error.message,
        stack: error.stack,
    };
    console.log(errorObject);
    res.status(500).json(errorObject);
    return next();
};

const add = async (req, res, next) => {
    try {
        let invoice = new Invoice(req.body);
        invoice = await invoice.save();
        return res.json(invoice);
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};

const get = async (req, res, next) => {
    try {
        let invoices = await Invoice.find().sort({ timestamp: -1 });
        return res.json(invoices);
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};

const markAsPaid = async (req, res, next) => {
    try {
        let invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json('Invoice not found!');
        }
        invoice.paid = true;
        invoice = await invoice.save();
        return res.json(invoice);
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};

const sendMail = async (req, res, next) => {
    try {
        let invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json('Invoice not found!');
        }

        const itemsTable = `
        <table style="width:100%">
          <thead>
            <tr>
              <th>Description</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.unit}</td>
                <td>${item.quantity}</td>
                <td>${item.unitPrice}</td>
                <td>${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

        // Calculate the total of all item.total values
        const totalAmount = invoice.items.reduce((total, item) => total + item.total, 0);

        // Format the dates to a user-friendly format
        const formattedInvoiceDate = new Date(invoice.invoiceDate).toLocaleDateString();
        const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString();

        // Create the complete HTML for the email, including the total amount
        const html = `
        <h1>Invoice Details</h1>
        <p>Invoice ID: ${invoice.invoiceNumber}</p>
        <p>Invoice Date: ${formattedInvoiceDate}</p>
        <p>Due Date: ${formattedDueDate}</p>
        <p>Client Name: ${invoice.clientName}</p>
        <p>Client Address: ${invoice.clientAddress}</p>
        <p>Client Email: ${invoice.clientEmail}</p>
        <p>Client Phone: ${invoice.clientPhone}</p>
        <p>Note: ${invoice.note}</p>
        <p>Paid: ${invoice.paid ? 'Yes' : 'No'}</p>
        ${itemsTable}
        <p>Total Amount: ${totalAmount}</p>
      `;

        const message = {
            to: invoice.clientEmail,
            from: fromMail,
            subject: "hello",
            text: html,
            html
        };

        await sgMail.send(message);
        return res.json(invoice);
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};




module.exports = {
    add,
    get,
    markAsPaid,
    sendMail
};