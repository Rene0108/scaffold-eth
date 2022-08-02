import React, { useState, useEffect } from "react";
import ContractTitle from "./ContractTitle";
import styled from "styled-components";

const ParametersContainer = styled("div")`
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-item: left;
  margin: 10px;
  padding-bottom: 200px;
`;

const Parameter = styled("span")`
  display: flex;
  justify-content: space-between;
  text-align: left;
  width: 500px;
  margin: 0 auto 0 auto;
  padding: 10px;
  border: 1px #808080;
  border-top-style: solid;
`;

const Value = styled("span")`
  font-weight: bold;
  padding: 10px;
`;

const Parameters = props => {
  const { contract } = props;
  const [map, setMap] = useState();

  // Create a Map
  const parameters = new Map();

  useEffect(() => {}, [map]);

  async function getParameters() {
    if (contract) {
      const keys = await contract.getUintKeys();
      // console.log("BEFORE SETKEYS FUNCTION : ", keys);
      let trueValue = "";
      for (const key of keys) {
        let value = await contract.getUint(key);
        if (key === "defi.QDEX.maxWhaleShare" || key === "defi.QDEX.maxPriceChange") {
          trueValue = value / 10 ** 24 + "%";
        } else if (key === "defi.QDEX.flatFee") {
          trueValue = value / 10 ** 18;
        } else {
          trueValue = value.toString();
        }

        parameters.set(key, trueValue);
      }
    }
    setMap(parameters);
  }
  getParameters();

  let array = [];

  map?.forEach((value, key) => {
    // console.log("###################################", key, key.length);
    let splitedKey = key.substring(10).split(/(?=[A-Z])/);
    let string = "";
    for (const str of splitedKey) {
      if (str.length === 1) string += str;
      else string += str + " ";
    }
    string = string.charAt(0).toUpperCase() + string.slice(1);
    array.push(
      <Parameter>
        <span>{string} : </span>
        <Value>{value}</Value>
      </Parameter>,
    );
  });

  return (
    <>
      <ContractTitle title="Parameters" />
      <ParametersContainer>{array}</ParametersContainer>
    </>
  );
};

export default Parameters;
