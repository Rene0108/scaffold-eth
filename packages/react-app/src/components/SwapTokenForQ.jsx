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

const SwapTokenForQForm = props => {
  const { contract, userSigner, contractConfig, localChainId, address } = props;
  const [tokenAddress, setTokenAddress] = useState();
  const [amountWQMin, setAmountWQMin] = useState();

  const handleSubmit = event => {
    event.preventDefault();
  };

  const token = useContractLoader(
    userSigner,
    {
      ...contractConfig,
      customAddresses: {
        WQ: tokenAddress,
      },
    },
    localChainId,
  )?.WQ;

  // console.log("############################# TOKEN A CONTRACT", contractTokenA);

  const addZeros = () => {
    setAmountWQMin(amountWQMin * 10 ** 18);
  };

  const swap = async () => {
    const amount = await token.balanceOf(address);
    await token.approve(contract.address, amount);
    await contract.swapTokenForQ(tokenAddress, amountWQMin);
    alert("Function swapTokenForQ deployed!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <DivForCenter>
        <InputContainer>
          <InputText>
            <Param>token address :</Param>
            <Input type="text" value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} />
          </InputText>
          <InputText>
            <Param>amount WQ min :</Param>
            <Input type="number" value={amountWQMin} onChange={e => setAmountWQMin(e.target.value)} />
            <MultiplyButton onClick={addZeros}>🚀</MultiplyButton>
          </InputText>
          <SendButton onClick={swap}> SEND💸</SendButton>
        </InputContainer>
      </DivForCenter>
    </form>
  );
};

export default SwapTokenForQForm;
