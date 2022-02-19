import React, { useState, useEffect } from "react";
import axios from "axios";
import App from "../../App";
import Spinner from "react-spinkit";


const url = "https://chicago-concert-api.herokuapp.com/concerts";

function AppContainer() {
  const [data, setData] = useState("");
  useEffect(() => {
    console.log("fetching data");
    fetchData().then((res) => {
      setData(res);
    });
  }, []);

  async function fetchData() {
    try {
      const res = await axios(url);
      const json = await res.data;

      return json;
    } catch (err) {
      console.log("Error: " + err);
    }
  }
  if (data != "") {
    return <App data={data} />;
  } else {
    return (
      <div className="spinner">
        <Spinner
        fadeIn="none"
          style={{
            transform: "translate(-50%, -50%)",
            top: "50%",
            position: "absolute",
            left: "50%",
          }}
          name="double-bound"
        />
      </div>
    );
  }
}

export default AppContainer;
