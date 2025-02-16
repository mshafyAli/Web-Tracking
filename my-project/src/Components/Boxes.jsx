import React from "react";
import { Link } from "react-router-dom";

const Boxes = () => {
  return (
    <div>
      <div className="flex md:flex-row flex-col flex-wrap max-w-[84rem] mx-auto">
        <div className="md:w-1/4 p-4 text-white">
          <Link to="/academians.co.uk">
            <div className="bg-red-600 p-10 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold">Academians.co.uk</h2>
              <p className="text-sm ">Click here to check tracking</p>
            </div>
          </Link>
        </div>
        <div className="md:w-1/4 p-4 text-white">
          <Link to={"/the-academians.co.uk"}>
            <div className="bg-red-600 p-10 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold">The-Academians.co.uk</h2>
              <p className="text-sm">Click here to check tracking</p>
            </div>
          </Link>
        </div>
        <div className="md:w-1/4 p-4 text-white">
          <Link to={"/aussiephdwriter.com.au"}>
            <div className="bg-red-600 p-10 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold">APW</h2>
              <p className="text-sm">Click here to check tracking</p>
            </div>
          </Link>
        </div>
        <div className="md:w-1/4 p-4 text-white">
          <Link to={"/britishphdwriters.co.uk"}>
            <div className="bg-red-600 p-10 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold">BPW</h2>
              <p className="text-sm">Click here to check tracking</p>
            </div>
          </Link>
        </div>
        <div className="md:w-1/4 p-4 text-white">
          <Link to={"/the-academians.au"}>
            <div className="bg-red-600 p-10 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold">the-academians.au THA</h2>
              <p className="text-sm">Click here to check tracking</p>
            </div>
          </Link>
        </div>
        <div className="md:w-1/4 p-4 text-white">
          <Link to={"/the-academians.uk"}>
            <div className="bg-red-600 p-10 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold">the-academians.uk TA</h2>
              <p className="text-sm">Click here to check tracking</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Boxes;
