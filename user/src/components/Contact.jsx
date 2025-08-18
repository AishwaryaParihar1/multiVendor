import React from "react";
import Navbar from "./Navbar";

import Footer from "./Footer";

const Contact = () => {
  return (
    <>

      

      <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-4xl font-bold text-orange-600 mb-6">Contact Us</h1>

        <form
        
     
          className="bg-white shadow-lg hover:shadow-2xl hover:shadow-orange-500 shadow-orange-500 rounded-lg p-8 max-w-lg w-full space-y-6"
        >
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-600 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name" // Add name attribute
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Your Name"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email" // Add name attribute
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Your Email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-gray-600 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone" // Add name attribute
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Your Phone Number"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="message" className="text-gray-600 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message" // Add name attribute
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows="4"
              placeholder="Your Message"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold text-lg shadow-lg hover:bg-orange-600 transition-all duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
     
    </>
  );
};

export default Contact;
