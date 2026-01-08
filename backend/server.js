import express from "express";
import cors from "cors";
const app=express();
app.use(express.json());
app.use(cors());

import bookings from "./bookings.js";

app.get("/",(req,res)=>{
    console.log("health check");
    res.send("health check");
})

//
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
        status:"CONFIRMED"
    }
    bookings.push(booking);

    res.send({
        "message":"Ticket booked successfully!!!",
        "ticketId":ticketId
    })
})

app.listen("5000",()=>{
    console.log("server listening to the port 5000");
})