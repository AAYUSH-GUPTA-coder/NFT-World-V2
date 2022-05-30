import { ethers } from "ethers";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { abi, MARKET_PLACE_ADDRESS } from "../constants";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [loadingState, setLoadingState] = useState("not-loaded");
  // useEffect(() => {
  //   loadNFTs();
  // }, []);

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_URL
    );
    const contract = new ethers.Contract(MARKET_PLACE_ADDRESS, abi, provider);
    const data = await contract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        // returns the price, value in ETHER. i.e 0.01 ether
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(MARKET_PLACE_ADDRESS, abi, signer);

    /* user will be prompted to pay the asking price to complete the transaction */

    // parseUnits("1.0", "ether") === { BigNumber: "1000000000000000000" }
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);

    // If user is not connected to the Rinkeby network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      // throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getProviderOrSigner();
      loadNFTs();
    }
  }, [walletConnected]);

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-40 text-3xl">No items in marketplace</h1>;
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "2600px" }}>
        <div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4"
          style={{ marginTop: "60px" }}
        >
          {nfts.map((nft, i) => (
            <div key={i} className="card ">
              <div className="card-header">
                <img src={nft.image} alt="rover" />
              </div>
              <div className="card-body">
                <span className="tag tag-teal">{nft.name}</span>
                <h4 style={{ marginTop: "23px" }}>{nft.description}</h4>

                <div className="user">
                  {/* <img src="download1.jpg" alt="user" /> */}
                  <button className="neon btn1" onClick={() => buyNft(nft)}>
                    Buy
                  </button>
                  <div className="user-info">
                    <h3 className="text text2">Price</h3>
                    <h3 className="text2">{nft.price} MATIC</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
