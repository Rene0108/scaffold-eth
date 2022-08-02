import React, { useState } from "react";
import { useContractLoader } from "eth-hooks";
import styled from "styled-components";

const InputContainer = styled("div")`
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
  text-align: center;
  width: 400px;
  border: 1px solid;
`;

const SendButton = styled("Button")`
  font-size: 14px;
  width: 80px;
  height: 30px;
  color: white;
  border-color: white;
  background-color: #212121;
  cursor: pointer;
`;

const InputText = styled("label")`
  display: flex;
  justify-content: space-between;
  text-align: left;
`;

const Input = styled("input")`
  margin: 5px;
  color: white;
  background-color: #212121;
  border: 1px solid white;
  text-align: left;
`;

const Param = styled("span")`
  text-align: left;
  padding: 5px;
`;

const DivForCenter = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const MultiplyButton = styled("button")`
  background-color: #212121;
  cursor: pointer;
  padding: 0px;
  border: none;
  margin-left: 5px;
`;

const SwapLPForIndTokForm = props => {
  const { contract, userSigner, contractConfig, localChainId, address } = props;
  const [amountAMin, setAmountAMin] = useState();
  const [amountBMin, setAmountBMin] = useState();
  const [poolAddress, setPoolAddress] = useState();

  const handleSubmit = event => {
    event.preventDefault();
  };

  const contractLPtoken = useContractLoader(
    userSigner,
    {
      ...contractConfig,
      customAddresses: {
        WQ: poolAddress,
      },
    },
    localChainId,
  )?.WQ;

  const addZeros = func => {
    switch (func) {
      case "AMin":
        setAmountAMin(amountAMin * 10 ** 18);
        break;
      case "BMin":
        setAmountBMin(amountBMin * 10 ** 18);
        break;
      default:
        break;
    }
  };

  const swap = async () => {
    const LPamount = await contractLPtoken.balanceOf(address);
    await contractLPtoken.approve(contract.address, LPamount);
    await contract.swapLPTokenForIndividualTokens(poolAddress, amountAMin, amountBMin);
    alert("Function swapLPTokenForIndividualTokens deployed!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <DivForCenter>
        <InputContainer>
          <InputText>
            <Param>Amount A min :</Param>
            <div>
              <Input type="number" value={amountAMin} onChange={e => setAmountAMin(e.target.value)} />
              <MultiplyButton onClick={() => addZeros("AMin")}>🚀</MultiplyButton>
            </div>
          </InputText>
          <InputText>
            <Param>Amount B min :</Param>
            <div>
              <Input type="number" value={amountBMin} onChange={e => setAmountBMin(e.target.value)} />
              <MultiplyButton onClick={() => addZeros("BMin")}>🚀</MultiplyButton>
            </div>
          </InputText>
          <InputText>
            <Param>Pool address :</Param>
            <Input type="text" value={poolAddress} onChange={e => setPoolAddress(e.target.value)} />
          </InputText>
          <SendButton onClick={swap}> SEND💸</SendButton>
        </InputContainer>
      </DivForCenter>
    </form>
  );
};

export default SwapLPForIndTokForm;
