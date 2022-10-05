import React, { useState } from "react";
import QuizQuestion from "./QuizQuestion";
import styles from "../styles/Home.module.css";
import {
  ChainId,
  useAddress,
  useEdition,
  useMetamask,
  useWalletConnect,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const questions = [
  {
    question: "Question 1",
    text: "What are NFTs?",
    options: ["Non-Fungible Tokens", "Network File Transfer", "No Free Ticket"],
    answerIndex: 0,
  },
  {
    question: "Question 2",
    text: "Can you make money from owning NFTs?",
    options: ["Yes", "Sometimes", "No"],
    answerIndex: 1,
  },
  {
    question: "Question 3",
    text: "What can you not do with an NFT?",
    options: ["Buy real estate", "Transfer", "Burn", "Delete"],
    answerIndex: 3,
  },
];

export default function QuizContainer() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const [, switchNetwork] = useNetwork();
  const isOnWrongNetwork = useNetworkMismatch();

  const [questionNumber, setQuestionNumber] = useState(0);
  const [failed, setFailed] = useState(false);

  const editionContract = useEdition(
    "0x032A9020143Bd4200aC02a08F567a8251A532Aaf"
  );

  // This function calls a Next JS API route that mints an NFT with signature-based minting.
  // We send in the address of the current user, and the text they entered as part of the request.
  const mintWithSignature = async () => {
    if (!address) {
      connectWithMetamask();
      return;
    }

    if (isOnWrongNetwork) {
      switchNetwork && switchNetwork(ChainId.Mumbai);
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
      const mintSignature = await signedPayloadReq.json();

      const nft = await editionContract?.signature.mint(mintSignature);

      console.log(nft);

      // If the minting was successful, we'll display a success message.
      if (nft) {
        alert("Successfully minted NFT!");
      }
    } catch (e) {
      console.error("An error occurred trying to mint the NFT:", e);
    }
  };

  if (failed) {
    return (
      <div className={styles.quizContainer}>
        <h1>You failed!</h1>
        <button
          onClick={() => {
            setQuestionNumber(0);
            setFailed(false);
          }}
          className={styles.mainButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (questionNumber >= questions.length) {
    return (
      <div className={styles.quizContainer}>
        <h1>Quiz Complete!</h1>
        <div style={{ marginTop: 24 }}>
          {address ? (
            <a className={styles.mainButton} onClick={mintWithSignature}>
              Mint NFT
            </a>
          ) : (
            <a className={styles.mainButton} onClick={connectWithMetamask}>
              Connect Wallet
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizQuestionContainer}>
      <QuizQuestion
        title={questions[questionNumber].question}
        text={questions[questionNumber].text}
        options={questions[questionNumber].options}
        answerIndex={questions[questionNumber].answerIndex}
        setCorrect={() => setQuestionNumber(questionNumber + 1)}
        setFailed={setFailed}
      />
    </div>
  );
}
