import React, { useState, useEffect } from "react";
import ContractTitle from "./ContractTitle";
import styled from "styled-components";

const ParametersContainer = styled("div")`
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-item: left;
  margin-top: 10px;
`;

const Parameter = styled("span")`
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 10px;
  border: 1px #808080;
  border-top-style: solid;
`;

const BorderedDIV = styled("div")`
  margin: 40px;
  display: flex;
  flex-direction: column;
`;

const CopyButton = styled("button")`
  background-color: #212121;
  cursor: pointer;
  padding: 0px;
  border: none;
  margin-left: 5px;
`;

const Tokens = props => {
  const { tokens } = props;
  const [map, setMap] = useState();

  // Create a Map
  const parameters = new Map();

  useEffect(() => {}, [map]);

  async function getParameters() {
    for (const token of tokens) {
      const name = await token.name();
      const symbol = await token.symbol();
      const address = token?.address;
      const value = {
        text: name + " (" + symbol + ") ",
        addr: address.substring(1, 10) + "...",
      };
      parameters.set(token, value);
    }
    setMap(parameters);
  }
  getParameters();

  const copyAddress = Value => {
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(Value);
  };

  let array = [];

  map?.forEach((value, key) => {
    // console.log("###################################", key, key.length);
    array.push(
      <Parameter>
        <span>{value.text}</span>
        <div>
          <span>{value.addr}</span>
          <CopyButton onClick={copyAddress(value.addr)}>📄</CopyButton>
        </div>
      </Parameter>,
    );
  });

  return (
    <BorderedDIV>
      <ContractTitle title="TOKENS" />
      <ParametersContainer>{array}</ParametersContainer>
    </BorderedDIV>
  );
};

export default Tokens;
