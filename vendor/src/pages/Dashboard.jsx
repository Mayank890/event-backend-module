import React, { useEffect, useState } from "react";
import axios from "axios";
const Dashboard = () => {
  const [tickets, setTickets] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [events, setEvents] = useState(0);

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    // Function to fetch users
    const fetchUsers = async () => {
      try {
        // Adjust the URL to match your API endpoint

        const events = await axios.get(
          "http://localhost:5000/api/events/vendor/" + email
        );
        const bookings = await axios.get(
          "http://localhost:5000/api/bookings/allbooking"
        );
        const bookingsForEmail = bookings.data.filter(
          (booking) => booking.event_id.vendor_email === email
        );

        const totalTicketsSold = bookingsForEmail.reduce((total, event) => {
          return total + event.no_seats;
        }, 0);

        setTickets(totalTicketsSold); // Store the users in state

        // Calculate total revenue for the filtered bookings
        const totalRevenue = bookingsForEmail.reduce((total, item) => {
          // Calculate revenue for each booking (assuming booking contains fields like no_seats, price_per_seat, and platform_charge)
          const revenueForBooking =
            item.no_seats * item.total_amount + item.platform_charges;
          //   // Add revenue for this item to the total revenue
          return total + revenueForBooking;
        }, 0);

        setRevenue(totalRevenue);
        setEvents(events.data.length);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const cards = [
    {
      name: "Total Events",
      href: "#",
      icon: false,
      amount: events,
    },
    {
      name: "Total Tickets",
      href: "#",
      icon: false,
      amount: tickets,
    },

    {
      name: "Total Revenue",
      href: "#",
      icon: false,
      amount: `₹ ${revenue}`,
    },
    // More items...
  ];
  return (
    <>
      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.name}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {/* <card.icon
                    className="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  /> */}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        {card.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {card.amount}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
