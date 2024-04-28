import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Columns from "./components/Columns";


const MidSection = styled.div`
  padding: 1rem;
  box-sizing: border-box;

  height: 100vh;
  overflow-x: auto;
  display: flex;
  gap: 0.5rem;
  flex-grow: 1;
  .round {
    border-radius: 50%;
    width: 15px;
    height: 15px;
    border: 1px solid;
    /* background-color: #d8ffd8; */
  }
  .card{
    min-width: 350px;
  }
  .add{
    height: 40px;
    width: 40px;
    padding: 0.5rem;
    min-width: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;


function Task() {
  const [data, setData] = useState(localStorage.getItem("savedData") ? JSON.parse(localStorage.getItem("savedData")) : [])


  useEffect(() => {
    localStorage.setItem("savedData", JSON.stringify(data))
  },[data])

  return (
      <MidSection >
          <Columns data={data} setData={setData} />
      </MidSection>
  );
}

export default Task;
