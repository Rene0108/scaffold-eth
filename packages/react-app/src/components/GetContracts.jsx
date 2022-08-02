const GetContracts = (contracts: Object) => {
  console.log("#######", contracts);
  return (
    <>
      {Object.keys(contracts.contracts).map(contr => {
        return <h1>{contr}</h1>;
      })}
    </>
  );
};

export default GetContracts;
