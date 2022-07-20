import {
  useAddress,
  useMetamask,
  useNetwork,
  useNetworkMismatch,
  useEdition,
} from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import QuizContainer from "../components/QuizContainer";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  // Helpful thirdweb hooks to connect and manage the wallet from metamask.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  // Fetch the NFT collection from thirdweb via it's contract address.
  const nftCollection = useEdition();
  // Replace this with your NFT Collection contract address

  // This function calls a Next JS API route that mints an NFT with signature-based minting.
  // We send in the address of the current user, and the text they entered as part of the request.
  const mintWithSignature = async () => {
    if (!address) {
      connectWithMetamask();
      return;
    }

    if (isOnWrongNetwork) {
      switchNetwork?.(ChainId.Goerli);
      return;
    }

    try {
      // Make a request to /api/server
      const signedPayloadReq = await fetch(`/api/server`, {
        method: "POST",
        body: JSON.stringify({
          address: address, // Address of the current user
        }),
      });

      console.log("Received Signed payload", signedPayloadReq);

      // Grab the JSON from the response
      const json = await signedPayloadReq.json();

      console.log("Json:", json);

      // If the request failed, we'll show an error.
      if (!signedPayloadReq.ok) {
        alert(json.error);
        return;
      }

      // If the request succeeded, we'll get the signed payload from the response.
      // The API should come back with a JSON object containing a field called signedPayload.
      // This line of code will parse the response and store it in a variable called signedPayload.
      const signedPayload = json.signedPayload;

      // Now we can call signature.mint and pass in the signed payload that we received from the server.
      // This means we provided a signature for the user to mint an NFT with.
      const nft = await nftCollection?.signature.mint(signedPayload);

      console.log("Successfully minted NFT with signature", nft);

      alert("Successfully minted NFT with signature");

      return nft;
    } catch (e) {
      console.error("An error occurred trying to mint the NFT:", e);
    }
  };

  return (
    <>
      {/* Content */}
      <div className={styles.container}>
        {/* Top Section */}
        <h1 className={styles.h1}>Earn NFTs by Passing a Quiz!</h1>
        <p>
          This example uses{" "}
          <a href="https://portal.thirdweb.com/advanced-features/on-demand-minting">
            signature-based minting
          </a>{" "}
          to reward users with an NFT for getting quiz answers correct.
        </p>
        <hr className={styles.divider} />

        {/* Quiz */}
        <div className={styles.collectionContainer}>
          <QuizContainer />
        </div>
      </div>
    </>
  );
};

export default Home;
