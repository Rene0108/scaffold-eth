const fs = require("fs");
const path = require("path");
const { Contract, getDefaultProvider } = require("ethers");

const CONTRACT_REGISTRY = "ContractRegistry";
const PROVIDER_RPC = "http://63.34.190.209:8545";
const chainId = "35442";
const network = "Q DevNet";

const possibleDirectorys = [
  "../system-contracts/build",
  "../q-dex/artifacts",
  "../q-dex-utils/artifacts",
];

// Funkcija vraća glavni Contract Registry
const getContractRegistry = async (name, address, provider) => {
  // console.log("address --> " + address);
  const realProvider = await getDefaultProvider(provider);
  // console.log("realProvider --> " + realProvider);
  const contractABI = await getContractABI(name);
  // console.log("contractABI --> " + contractABI);
  return new Contract(address, contractABI, realProvider);
};

// Funkcija vraća ABI za dani contract
const getContractABI = (contractName) => {
  let ABIfound = false;
  for (const directory of possibleDirectorys) {
    try {
      walkDir(contractName, directory);
    } catch (BreakException) {
      const requestedContract = require(`./${BreakException.message}`);
      ABIfound = true;
      return requestedContract.abi;
    }
  }
  if (!ABIfound)
    console.log(
      "#####################################",
      "ABI not found",
      "#####################################"
    );
};

// Rekurzivna funkcija koja traži "ContractRegistry.json" file
const walkDir = (contractName, dir) => {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    // console.log(dirPath);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(contractName, dirPath);
    } else if (f === `${contractName}.json`) {
      throw {
        name: "BreakException",
        message: path.join(dir, f),
      };
    }
  });
};

// Funkcija vraća polje objekata [key, value] koji predstavljaju contracte
const getAvailableContracts = async (contractRegistry) => {
  const availableContracts = await contractRegistry.getContracts();
  return availableContracts;
};

// Funkcija vraća contracte koje je odabrao korisnik u potrebnom formatu
const getChosenContractsWithABI = async (contracts, availableContracts) => {
  const contractsToDeploy = [];
  // console.log(availableContracts);
  for (const contract of contracts) {
    let contractMatched = false;
    for (const entry of availableContracts) {
      let contractEntry = {};
      if (
        (contract.key && entry.key === contract.key) ||
        (contract.addr && entry.addr === contract.addr)
      ) {
        contractMatched = true;

        // Ako nije unesen frontendName onda ispisi defaultni name
        if (!contract.frontendName) contract.frontendName = contract.name;
        contractEntry = {
          name: contract.frontendName,
          address: entry.addr,
          abi: getContractABI(contract.name),
        };
        contractsToDeploy.push(contractEntry);
        break;
      }
    }
    if (!contractMatched) {
      console.log("Contract key or address mismatch or doesn't exist.");
      contractEntry = {
        name: contract.frontendName,
        address: "0x0000000000000000000000000000000000000000",
        abi: getContractABI(contract.name),
      };
      contractsToDeploy.push(contractEntry);
    }
  }
  // console.log(contractsToDeploy);
  return contractsToDeploy;
};

// MAIN FUNKCIJA
(async () => {
  const chosenContracts = require("./choseContract.json");
  if (!chosenContracts) console.log("File 'choseContract.json' doesn't exist.");
  // console.log(chosenContracts);

  const CONTRACT_REGISTRY_ADDRESS = chosenContracts.shift().contractRegistry;
  if (!CONTRACT_REGISTRY_ADDRESS)
    console.log(
      "ContractRegistry address not defined in file 'choseContract.json'."
    );
  // console.log("CONTRACT_REGISTRY_ADDRESS --> " + CONTRACT_REGISTRY_ADDRESS);

  const contractRegistry = await getContractRegistry(
    CONTRACT_REGISTRY,
    CONTRACT_REGISTRY_ADDRESS,
    PROVIDER_RPC
  );
  // console.log(contractRegistry);

  let availableContracts = await getAvailableContracts(contractRegistry);
  let help = { key: "contractRegistry", addr: CONTRACT_REGISTRY_ADDRESS };
  availableContracts = [...availableContracts, help];
  //console.log(availableContracts);

  const userDefinedContractsWithABI = await getChosenContractsWithABI(
    chosenContracts,
    availableContracts
  );
  // console.log(userDefinedContractsWithABI);

  const field = [];
  for (const contract of userDefinedContractsWithABI) {
    const obj = {
      [contract.name]: {
        address: contract.address,
        abi: contract.abi,
      },
    };
    field.push(obj);
  }

  const arrayToObject = Object.assign({}, ...field);
  const data = {
    [chainId]: {
      [network]: {
        name: network,
        chainId: chainId,
        contracts: arrayToObject,
      },
    },
  };

  fs.writeFile(
    "./packages/react-app/src/contracts/hardhat_contracts.json",
    JSON.stringify(data),
    function (err, result) {
      if (err) console.log("Error", err);
    }
  );
})();
