import React, { useRef, useState } from "react";
import { Button } from "./ui/button";

const Display = ({ contract, account }) => {
  const addressRef = useRef(null);
  const [data, setData] = useState("");
  const getData = async () => {
    let dataArray;
    const otheraddress = addressRef.current.value;

    if (otheraddress) {
      dataArray = await contract.display(otheraddress);
    } else {
      dataArray = await contract.display(account);
    }

    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str = dataArray.toString();
    }
  };

  return (
    <div>
      <div>
        <h1>Display:</h1>
        <input ref={addressRef} type="text" placeholder="Enter address" />
        <Button onClick={getData}>Get Data</Button>
      </div>
    </div>
  );
};

export default Display;
