import { useState } from "react";

const ControlBoard = ({ user, data }) => {
  return <div className="controlboard-container">
      <div className="user-info">
          <p>{data?.name}</p>
          <p>{data?.rating}</p>
      </div>
  </div>;
};

export default ControlBoard;
