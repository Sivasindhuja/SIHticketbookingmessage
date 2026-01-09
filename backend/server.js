import express from "express";
import cors from "cors";
const app=express();
app.use(express.json());
app.use(cors());

import bookings from "./bookings.js";
import otpStore from "./otpstore.js";

app.get("/",(req,res)=>{
    console.log("health check");
    res.send("health check");
})


app.post("/booking",(req,res)=>{
    const {fullName,phoneNumber,destCity,destCityPinCode,DateOfTravel} =req.body;

    if(!fullName || !phoneNumber || !destCity || !destCityPinCode || !DateOfTravel){
        return res.send("Enter all the values");
    }

    const ticketId="TKT"+Math.floor(Math.random()*10000000);

    const booking={
        ticketId,
        fullName,
        phoneNumber,
        destCity,
        destCityPinCode,
        DateOfTravel,
        status:"CONFIRMED",
        isPhoneVerified:false
    }
    bookings.push(booking);

    res.send({
        "message":"Ticket booked successfully!!!",
        "ticketId":ticketId
    })
})

app.post("/send-otp",(req,res)=>{

    const {phoneNumber}=req.body;
    //generate an otp
    const otp=Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[phoneNumber]={
        otp,
        "expiresAt":Date.now() + 5 * 60 * 1000
    }

    console.log(`your otp for ${phoneNumber} is ${otp}`);

    res.json(`otp sent successfully`);

})

app.post("/verify-otp", (req, res) => {
    const { phoneNumber, otp } = req.body;
    const record = otpStore[phoneNumber];

    if (!record) {
        return res.status(400).json({
            message: "OTP not found. Please request again."
        });
    }

    if (Date.now() > record.expiresAt) {
        delete otpStore[phoneNumber];
        return res.status(400).json({
            message: "OTP expired"
        });
    }

    if (record.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    const booking = bookings.find(
        (b) => b.phoneNumber === phoneNumber
    );

    if (booking) {
        booking.isPhoneVerified = true;
    }

    delete otpStore[phoneNumber];

    return res.status(200).json({
        message: "Phone number verified successfully"
    });
});

app.post("/send-tourism-info", (req, res) => {
    const { phoneNumber } = req.body;

    const booking = bookings.find(
        (b) => b.phoneNumber === phoneNumber
    );

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    if (!booking.isPhoneVerified) {
        return res.status(403).json({
            message: "Phone number not verified"
        });
    }

    //Simulated tourism content(further ai summarised)
    const tourismInfo = `
Welcome to ${booking.destCity}!

 Pincode: ${booking.destCityPinCode}
 Famous Cuisine: Local traditional dishes
Culture: Traditional attire & customs
Places to Visit: Popular tourist attractions
Festivals: Local festivals & events
Handicrafts: Famous local crafts
Things to Buy: Local products & souvenirs
Combo Tickets: Available at major attractions
Nearby Events & Ads: Ongoing events nearby
`;

    console.log("Tourism info sent to:", phoneNumber);
    console.log(tourismInfo);

    return res.status(200).json({
        message: "Tourism information sent successfully",
        tourismInfo
    });
});




app.listen("5000",()=>{
    console.log("server listening to the port 5000");
})