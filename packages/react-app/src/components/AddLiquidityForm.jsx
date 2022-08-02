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

const AddLiquidityForm = props => {
  const { contract, userSigner, contractConfig, localChainId, address } = props;
  const [tokenA, setTokenA] = useState();
  const [tokenB, setTokenB] = useState();
  const [amountADesired, setAmountADesired] = useState();
  const [amountBDesired, setAmountBDesired] = useState();
  const amountAMin = 0;
  const amountBMin = 0;
  const deadline = 99999999999999;

  const handleSubmit = event => {
    event.preventDefault();
  };

  const contractTokenA = useContractLoader(
    userSigner,
    {
      ...contractConfig,
      customAddresses: {
        WQ: tokenA,
      },
    },
    localChainId,
  )?.WQ;

  const contractTokenB = useContractLoader(
    userSigner,
    {
      ...contractConfig,
      customAddresses: {
        WQ: tokenB,
      },
    },
    localChainId,
  )?.WQ;

  // console.log("############################# TOKEN A CONTRACT", contractTokenA);

  const addLiquidity = async () => {
    await contractTokenA.approve(contract.address, amountADesired);
    await contractTokenB.approve(contract.address, amountBDesired);
    await contract.addLiquidity(
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      address,
      deadline,
    );
    alert("Function addLiquidity deployed!");
  };

  const addZeros = letter => {
    if (letter === "A") {
      setAmountADesired(amountADesired * 10 ** 18);
    } else if (letter === "B") {
      setAmountBDesired(amountBDesired * 10 ** 18);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DivForCenter>
        <InputContainer>
          <InputText>
            <Param>tokenA :</Param>
            <Input type="text" value={tokenA} onChange={e => setTokenA(e.target.value)} />
          </InputText>
          <InputText>
            <Param>tokenB :</Param>
            <Input type="text" value={tokenB} onChange={e => setTokenB(e.target.value)} />
          </InputText>
          <InputText>
            <Param>amountADesired :</Param>
            <div>
              {" "}
              <Input type="number" value={amountADesired} onChange={e => setAmountADesired(e.target.value)} />
              <MultiplyButton onClick={() => addZeros("A")}>🚀</MultiplyButton>
            </div>
          </InputText>
          <InputText>
            <Param>amountBDesired :</Param>
            <div>
              {" "}
              <Input type="number" value={amountBDesired} onChange={e => setAmountBDesired(e.target.value)} />
              <MultiplyButton onClick={() => addZeros("B")}>🚀</MultiplyButton>
            </div>
          </InputText>
          <SendButton onClick={addLiquidity}> SEND💸</SendButton>
        </InputContainer>
      </DivForCenter>
    </form>
  );
};

export default AddLiquidityForm;
