import { format } from "date-fns";

// Creating local variables to store the room details
let roomDetails = [
    {
        room_id: 1,
        room_no: 101,
        room_name: "Couple's room",
        room_booked_dates: [],
        No_of_seats: 2,
        amenities: "A/C, Car Parking, TV, Dining room, Balcony",
        price: "1000/hr",
    },
    {
        room_id: 2,
        room_no: 201,
        room_name: "Single room",
        room_booked_dates: [],
        No_of_seats: 2,
        amenities: "A/C, Car Parking, TV, Dining room, Entrance Hall",
        price: "2000/hr",
    },
    {
        room_id: 3,
        room_no: 301,
        room_name: "Double bed room",
        room_booked_dates: [],
        No_of_seats: 4,
        amenities: "Balcony, A/C, Car Parking, TV, Dining room, Entrance Hall, Living Room",
        price: "3000/hr",
    },
    {
        room_id: 4,
        room_no: 401,
        room_name: "Deluxe room",
        room_booked_dates: [],
        No_of_seats: 6,
        amenities: "A/C, Car Parking, TV, Dining room, Entrance Hall, Bath tub",
        price: "4000/hr",
    },
    {
        room_id: 5,
        room_no: 501,
        room_name: "Simple room",
        room_booked_dates: [],
        No_of_seats: 6,
        amenities: "A/C, Car Parking, TV, Dining room",
        price: "5000/hr",
    },
    {
        room_id: 6,
        room_no: 601,
        room_name: "Three bed room",
        room_booked_dates: [],
        No_of_seats: 6,
        amenities: "A/C, Car Parking, TV, Dining room, Entrance Hall, Bath tub",
        price: "6000/hr",
    },
];

// Getting all available room details
export let getRoomDetails = (req, res) => {
    res.status(200).json({ message: "Available Room details", data: roomDetails });
};

let bookingRoom = [];

// Creating new room
export let createRoom = (req, res) => {
    let { room_no, room_name, amenities, No_of_seats, price } = req.body;

    let index = roomDetails.findIndex((ele) => ele.room_no == room_no);
    if (index !== -1) {
        return res.status(400).json({ message: "The room number already exists, try another room number to create" });
    }

    // Create new room from user
    let newRoom = {
        room_id: roomDetails.length + 1,
        room_no,
        room_name,
        amenities,
        No_of_seats,
        price,
        room_booked_dates: [],
    };

    roomDetails.push(newRoom);
    res.status(200).json({ message: "New room created successfully", data: newRoom });
};

// Booking a new room if the selected room is available
export let roomBooking = (req, res) => {
    let { customer_name, date, start_time, end_time, room_id } = req.body;

    // Booking date from user
    let bookingDate = new Date();
    let today = format(bookingDate, "yyyy-MM-dd");

    // Checking if room is available
    let roomIndex = roomDetails.findIndex((ele) => ele.room_id == room_id);
    if (roomIndex === -1) {
        return res.status(404).json({ message: "There is no room available with the entered room id", room_id });
    }

    // Checking if room is available on particular date
    let roomDate = roomDetails[roomIndex];
    let isBooked = roomDate.room_booked_dates.some((ele) => ele === date);
    if (isBooked) {
        return res.status(400).json({ message: `Room ${roomDate.room_no} is already booked on date ${date}` });
    }

    if (date < today) {
        return res.status(400).json({ message: "Please check the booking date, past dates cannot be chosen to book" });
    }

    // Checking if room is already booked
    let roomCheck = bookingRoom.some((ele) => ele.date === date && ele.room_id === room_id);
    if (roomCheck) {
        return res.status(400).json({ message: `The chosen Room number : ${roomDate.room_no} is not available` });
    }

    // Creating a room book
    let bookedRoom = {
        ...req.body,
        booking_status: "Booked",
        booking_date: today,
        booking_id: bookingRoom.length + 1,
    };

    // Adding the booked data to local variable
    bookingRoom.push(bookedRoom);

    // Updating room status
    roomDate.room_booked_dates.push(date);

    res.status(200).json({ message: `Room ${roomDate.room_no} booked successfully`, data: { room_name: roomDate.room_name, ...bookedRoom } });
};

// List customer data who booked room
export let getCustomerRoom = (req, res) => {
    if (bookingRoom.length === 0) {
        return res.status(404).json({ message: "There is no customer who booked a room" });
    }

    // Getting the customer details from bookingRoom array
    let customerDetails = bookingRoom.map((ele) => {
        let room = roomDetails.find((e) => e.room_id == ele.room_id);
        return {
            customer_name: ele.customer_name,
            room_name: room.room_name,
            room_no: room.room_no,
            date: ele.date,
            start_time: ele.start_time,
            end_time: ele.end_time,
        };
    });
    res.status(200).json({ message: "List of customers who booked room", data: customerDetails });
};

// Getting all booked room data
export let getBookedRooms = (req, res) => {
    if (bookingRoom.length === 0) {
        return res.status(200).json({ message: "There is no room booked" });
    }

    let bookedRooms = bookingRoom.map((ele) => {
        let room = roomDetails.find((e) => e.room_id === ele.room_id);
        return {
            room_name: room.room_name,
            booking_status: ele.booking_status,
            customer_name: ele.customer_name,
            date: ele.date,
            start_time: ele.start_time,
            end_time: ele.end_time,
        };
    });

    res.status(200).json({ message: "List of booked rooms", data: bookedRooms });
};

// Particular customer booked room details
export let getCustomerBookedDetails = (req, res) => {
    let { customer_name } = req.params;

    let singleCustomerDetail = bookingRoom.filter((ele) => ele.customer_name == customer_name);

    if (singleCustomerDetail.length === 0) {
        return res.status(404).json({ message: "There are no rooms booked with customer name:", customer_name });
    }

    singleCustomerDetail = singleCustomerDetail.map((ele) => {
        let room = roomDetails.find((e) => e.room_id == ele.room_id);
        return {
            room_name: room.room_name,
            date: ele.date,
            start_time: ele.start_time,
            end_time: ele.end_time,
            booking_id: ele.booking_id,
            booking_status: ele.booking_status,
            booking_date: ele.booking_date,
        };
    });

    // Output
    let result = {
        customer_name: customer_name,
        booking_count: singleCustomerDetail.length,
        roomDetails: singleCustomerDetail,
    };

    res.status(200).json({ message: "List of Customer ", data: result });
};