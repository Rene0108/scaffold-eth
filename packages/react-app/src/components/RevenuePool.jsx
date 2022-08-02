import React, { useState, useEffect } from "react";
import ContractTitle from "./ContractTitle";
import SwapLPForIndTokForm from "./SwapLPForIndTokForm";
import SwapTokenForQ from "./SwapTokenForQ";
import Tokens from "./Tokens";
import styled from "styled-components";

const LineContainer = styled("div")`
  display: grid;
  grid-template-columns: 50% 50%;
  margin: 10px;
  border: 1px #808080;
  border-top-style: solid;
`;

const TransferButton = styled("Button")`
  font-size: 14px;
  width: 100px;
  height: 40px;
  color: white;
  border-color: white;
  background-color: #212121;
  cursor: pointer;
`;

const RefreshButton = styled("Button")`
  margin-left: 40px;
  width: 35px;
  height: 35px;
  color: white;
  border-color: black;
  background-color: blue;
  cursor: pointer;
`;

const Text = styled("div")`
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

const FunctionContainer = styled("div")`
  margin: 15px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
  text-align: center;
`;

const FunctionTitle = styled("span")`
  font-size: 20px;
  font-weight: bold;
  display: flex;
  padding-top: 15px;
  padding-bottom: 5px;
`;

const OverallContainer = styled("div")`
  display: grid;
  column-gap: 50px;
  grid-template-columns: 50% 50%;
  padding-right: 10%;
`;

const ContainerWithFunctions = styled("div")`
  display: grid;
  row-gap: 50px;
  grid-template-rows: 50% 50%;
`;

const BottomMargin = styled("div")`
  padding-bottom: 200px;
`;

const RevenuePool = props => {
  const { tokens, contract, userSigner, contractConfig, localChainId, address } = props;
  const [flatFee, setFlatFee] = useState();

  // console.log("######################################## REVENUE POOL", contract);

  useEffect(() => {}, [flatFee]);

  async function getFlatFee() {
    if (contract) {
      const value = await contract.flatFee();
      setFlatFee(value / 10 ** 18);
    }
  }
  getFlatFee();

  const transferQfunction = () => {
    contract ? contract.transferQ() : alert("Instance of RevenuePool contract not found. ");
  };

  return (
    <BottomMargin>
      <ContractTitle title="Revenue Pool" />
      <div className="FunctionContainer">
        <div className="FlatFee">
          <LineContainer>
            <Text>Flat Fee</Text>
            <Text>
              {flatFee}
              <RefreshButton>↻</RefreshButton>
            </Text>
          </LineContainer>
        </div>
        <div className="TransferQ">
          <LineContainer>
            <Text>Transfer Q</Text>
            <Text>
              <TransferButton onClick={transferQfunction}>SEND 💸</TransferButton>
            </Text>
          </LineContainer>
        </div>
        <OverallContainer>
          <ContainerWithFunctions>
            <FunctionContainer>
              <FunctionTitle>Swap LP for Individual Tokens :</FunctionTitle>
              <SwapLPForIndTokForm
                contract={contract}
                userSigner={userSigner}
                contractConfig={contractConfig}
                localChainId={localChainId}
                address={address}
              />
            </FunctionContainer>
            <FunctionContainer>
              <FunctionTitle>Swap Tokens for Q :</FunctionTitle>
              <SwapTokenForQ
                contract={contract}
                userSigner={userSigner}
                contractConfig={contractConfig}
                localChainId={localChainId}
                address={address}
              />
            </FunctionContainer>
          </ContainerWithFunctions>
          <Tokens tokens={tokens} />
        </OverallContainer>
      </div>
    </BottomMargin>
  );
};

export default RevenuePool;
