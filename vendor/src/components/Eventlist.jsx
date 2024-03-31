import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
const EventList = () => {
  // Sample events data
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []); // Removed navigate from dependencies to prevent re-fetching due to navigation

  const fetchEvents = async () => {
    const vendorEmail = localStorage.getItem("userEmail");
    if (!vendorEmail) {
      message.error("Vendor email not found. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.theeventera.live/api/events/vendor/${vendorEmail}`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      message.error(error.response?.data?.message || "Failed to fetch events");
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(
        `https://api.theeventera.live/api/events/delete/${eventId}`
      );
      if (response.status === 200) {
        message.success("Event deleted successfully");
        fetchEvents(); // Simply re-fetch the events without reloading the page
      } else {
        message.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      message.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div>
      {/* Create Event Button */}
      <div className="mb-4 text-right">
        <button
          type="button"
          onClick={() => navigate("/create-event")}
          className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Create Event
        </button>
      </div>

      {/* Event List Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Event Name
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-b dark:border-gray-700`}
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {event.event_name}
                </td>
                <td className="px-6 py-4">{event.event_date}</td>
                <td className="px-6 py-4">{event.category}</td>
                <td className="px-6 py-4">
                  {event.status === "activate" ? (
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                    >
                      Inactivate
                    </button>
                  )}
                </td>{" "}
                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/updateevent/${event._id}`)}
                    type="button"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteEvent(event._id)} // Use the event's ID
                    type="button"
                    class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/events/bookings/${event._id}`} // Use the event's ID
                    type="button"
                    class="focus:outline-none text-center text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 "
                  >
                    Bookings
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventList;
