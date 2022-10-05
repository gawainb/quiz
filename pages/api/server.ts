import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function server(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // De-structure the arguments we passed in out of the request body
    const { address, nftName, imagePath } = JSON.parse(req.body);

    // You'll need to add your private key in a .env.local file in the root of your project
    // !!!!! NOTE !!!!! NEVER LEAK YOUR PRIVATE KEY to anyone!
    if (!process.env.PRIVATE_KEY) {
      throw new Error("You're missing PRIVATE_KEY in your .env.local file.");
    }

    // Initialize the Thirdweb SDK on the serverside
    const sdk = ThirdwebSDK.fromPrivateKey(
      // Your wallet private key (read it in from .env.local file)
      process.env.PRIVATE_KEY as string,
      "mumbai"
    );

    // Load the NFT Collection via it's contract address using the SDK
    const editionContract = sdk.getEdition(
      // Replace this with your NFT Collection contract address
      "0x032A9020143Bd4200aC02a08F567a8251A532Aaf"
    );

    // Generate the signature for the page NFT
    const signedPayload = await editionContract.signature.generateFromTokenId({
      quantity: 1,
      tokenId: 0,
      to: address,
    });

    // Return back the signedPayload to the client.
    res.status(200).json(signedPayload);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: `Server error ${e}` });
  }
}
