import Web3Modal from "web3modal" 
import {ethers} from "ethers"

let web3Modal = null;
let provider = null;
let signer = null;

async function connect(){

    web3Modal = new Web3Modal({
        network: "ganache",
        cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    provider = new ethers.providers.Web3Provider(connection);
    
    signer = await provider.getSigner();
}

export function connectWeb3(){

    if(signer != null){
        return signer;
    }

    (async () => await connect())();

    return signer;
}