const formElement=document.getElementById("bookingForm");

formElement.addEventListener("submit",async (e)=>{
    e.preventDefault();

    const bookingDetails={
        fullName:document.getElementById("name").value,
        phoneNumber:document.getElementById("phno").value,
        destCity:document.getElementById("dest-city").value,
        destCityPinCode:document.getElementById("dest-pincode").value,
        DateOfTravel:document.getElementById("travel-date").value
    }

    try{
        const response=await fetch("http://localhost:5000/booking",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(bookingDetails)

        });
        const data=await response.json();

        document.getElementById("result").innerHTML= "Ticket booked successfully! Ticket ID: " + data.ticketId;;
    }
    catch(e){
            document.getElementById("result").innerText ="Error booking ticket. Please try again.";
            console.error(e);
    }

    // //create a random number and alert that as the tiket id
    // const ticketId="TKT"+Math.floor(Math.random()*100000000);
    // console.log(ticketId);

    // alert(`Ticket booked successfully!!! your ticket id is ${ticketId},your destination is ${bookingDetails.destCity}`)

})