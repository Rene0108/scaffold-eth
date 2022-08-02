import React from "react";
import ContractTitle from "./ContractTitle";
import Tokens from "./Tokens";
import AddLiquidityForm from "./AddLiquidityForm";
import RemoveLiquidityForm from "./RemoveLiquidityForm";
import SwapForm from "./SwapForm";
import styled from "styled-components";

const ContainerWithFunctions = styled("div")`
  display: grid;
  column-gap: 50px;
  grid-template-columns: 50% 50%;
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

const BottomMargin = styled("div")`
  padding-bottom: 200px;
`;

const Router = props => {
  const { tokens, contract, userSigner, contractConfig, localChainId, address, factory } = props;

  // console.log("################################# ROUTER", contract);

  return (
    <BottomMargin>
      <ContractTitle title="Router" />
      <hr />
      <ContainerWithFunctions>
        <Tokens tokens={tokens} />
        <FunctionContainer>
          <FunctionTitle>Add Liquidity :</FunctionTitle>
          <AddLiquidityForm
            contract={contract}
            userSigner={userSigner}
            contractConfig={contractConfig}
            localChainId={localChainId}
            address={address}
          />
        </FunctionContainer>
      </ContainerWithFunctions>
      <ContainerWithFunctions>
        <FunctionContainer>
          <FunctionTitle>Swap :</FunctionTitle>
          <SwapForm
            contract={contract}
            userSigner={userSigner}
            contractConfig={contractConfig}
            localChainId={localChainId}
            address={address}
            factory={factory}
          />
        </FunctionContainer>
        <FunctionContainer>
          <FunctionTitle>Remove Liquidity :</FunctionTitle>
          <RemoveLiquidityForm
            contract={contract}
            userSigner={userSigner}
            contractConfig={contractConfig}
            localChainId={localChainId}
            address={address}
            factory={factory}
          />
        </FunctionContainer>
      </ContainerWithFunctions>
    </BottomMargin>
  );
};

export default Router;
