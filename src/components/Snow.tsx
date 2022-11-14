import React, { useEffect } from "react";
import Snowfall from "react-snowfall";
import snowflake from "../images/snowflake.webp";

const snowflakeImg = document.createElement("img");
snowflakeImg.src = snowflake;

export default function Snow({ children }) {
  return (
    <>
      {children}
      <Snowfall
        images={[snowflakeImg]}
        radius={[10, 10]}
        style={{ opacity: 0.4, zIndex: -1 }}
      />
    </>
  );
}
