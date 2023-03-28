const express = require("express")
const router = new express.Router();
const users = require("../models/userModel");
const nodemailer = require("nodemailer")


//email config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

// register user details
router.post("/register", async (req, res) => {
    const { fname, lname, email, mobile, message } = req.body; //destructuring req.body.fname  ,  req.body.lname ... and so on.
    if (!fname || !lname || !email || !mobile) {
        res.status(401).json({ status: 401, error: "All Input require" })
    }
    try {
        const preuser = await users.findOne({ email: email })
        if (preuser) {
            const userMessage = await preuser.Messagesave(message);
            console.log(userMessage);
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "sending email using nodejs",
                text: "Your response has been submitted."
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error" + error);
                } else {
                    console.log("Email sent" + info.response);
                    res.status(201).json({ status: 201, message: "Email sent Successfully" })
                }
            })
        } else {
            const finalUser = new users({
                fname, lname, email, mobile, message
            });
            const storeData = await finalUser.save();
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "sending email using nodejs",
                text: "Your response has been submitted."
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error" + error);
                } else {
                    console.log("Email sent" + info.response);
                    res.status(201).json({ status: 201, message: "Email sent Successfully" })
                }
            })
            res.status(201).json({ status: 201, storeData })
        }
    } catch (error) {
        res.status(401).json({ status: 401, error: "All Input require" })
        console.log("catch error");
    }
})


module.exports = router;