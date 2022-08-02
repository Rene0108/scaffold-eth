import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Pair from "./Pair";
import ContractTitle from "./ContractTitle";

const Container = styled("div")`
  fontsize: 24px;
  display: grid;
  grid-template-columns: 50% 50%;
`;

const DropdownMenu = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-item: center;
  height: 100%;
`;

const MenuTitle = styled("span")`
  padding: 20px;
`;

const SelectedToken = styled("div")`
  position: relative;
  padding: 20px;
  padding-left: 0px;
  color: black;
`;

const SubmitButton = styled("Button")`
  width: 100px;
  height: 40px;
  color: white;
  background-color: green;
  cursor: pointer;
`;

const DivPaddingBottom = styled("div")`
  padding-bottom: 200px;
`;

const ChosePair = props => {
  const { tokens, userSigner, contractConfig, localChainId, address, factory, contractRegistry } = props;

  const [token1_address, setToken1_address] = useState(tokens[0]);
  const [token2_address, setToken2_address] = useState(tokens[0]);
  const [poolAddress, setPoolAddress] = useState();
  const [showPair, setShowPair] = useState(false);
  // console.log("###########################", showPair);

  const HandleChangeToken1 = event => {
    setToken1_address(event.target.value);
  };

  const handleChangeToken2 = event => {
    setToken2_address(event.target.value);
  };

  const activate = () => {
    setShowPair(true);
  };

  const getPoolAddress = async () => {
    setPoolAddress(await factory.getPair(token1_address, token2_address));
  };
  getPoolAddress();

  useEffect(() => {}, [token1_address, token2_address, showPair, poolAddress]);

  return (
    <>
      <ContractTitle title="Pair" />
      <Container>
        <DropdownMenu style={{ justifyContent: "right" }}>
          <MenuTitle>TOKEN 1</MenuTitle>
          <SelectedToken>
            <select style={{ width: 160 }} token1={token1_address} onChange={HandleChangeToken1}>
              {tokens &&
                tokens.map(address => {
                  return <option token1={address}>{address}</option>;
                })}
            </select>
          </SelectedToken>
        </DropdownMenu>
        <DropdownMenu style={{ justifyContent: "left" }}>
          <MenuTitle>TOKEN 2</MenuTitle>
          <SelectedToken>
            <select style={{ width: 160 }} token2={token2_address} onChange={handleChangeToken2}>
              {tokens &&
                tokens.map(address => {
                  return <option token2={address}>{address}</option>;
                })}
            </select>
          </SelectedToken>
        </DropdownMenu>
      </Container>
      <div>
        <SubmitButton onClick={activate} variant="success">
          FIND POOL
        </SubmitButton>{" "}
      </div>
      {showPair ? (
        <DivPaddingBottom>
          <Pair
            userSigner={userSigner}
            contractConfig={contractConfig}
            localChainId={localChainId}
            address={address}
            factory={factory}
            contractRegistry={contractRegistry}
            poolAddress={poolAddress}
          />
        </DivPaddingBottom>
      ) : (
        <></>
      )}
    </>
  );
};

export default ChosePair;
