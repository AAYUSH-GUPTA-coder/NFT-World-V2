import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import Web3Modal from "web3modal";
import { abi, MARKET_PLACE_ADDRESS } from "../constants";

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const [nfts, setNfts] = useState({ name: "", description: "" });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const { image, price } = formInput;

  useEffect(() => {
    fetchNFT();
  }, [id]);

  async function fetchNFT() {
    if (!tokenURI) return;
    const meta = await axios.get(tokenURI);
    // update formInput image. price will be updated by user at the time of selling
    updateFormInput((state) => ({ ...state, image: meta.data.image }));

    // fetch details of NFT

    let item = {
      name: meta.data.name,
      description: meta.data.description,
    };
    setNfts(item);
  }

  async function listNFTForSale() {
    // if user do not put price of NFT it will not be listed
    if (!price) return;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(MARKET_PLACE_ADDRESS, abi, signer);

    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    // send transcation to place NFT in marketplace. Seller send metadata of NFT. Spend Gasfee along with listingPrice.
    let transaction = await contract.resellToken(id, priceFormatted, {
      value: listingPrice,
    });
    await transaction.wait();

    router.push("/");
  }

  return (
    <div className="flex justify-center py-40">
      <div className="w-1/2 flex flex-col pb-12" style={{ width: "350px" }}>
        <input
          placeholder="Asset Price in Matic"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <div
          className="border shadow rounded-xl overflow-hidden"
          style={{ width: "350px", marginTop: "25px" }}
        >
          {image && <img className="rounded mt-4" width="350" src={image} />}
          <div className="p-4 bg-black">
            <p
              className="text-5x1 font-italic text-white"
              style={{ color: "pink", fontSize: "50px" }}
            >
              {nfts.name}
            </p>
            <br />
            <p className="text-2x1 font-bold text-white">{nfts.description}</p>
          </div>
        </div>
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
