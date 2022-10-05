import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import React from "react";
import styles from "./styles/Home.module.css";
import Image from "next/image";
import Logo from "../public/logo.png"

export default function Header() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div>
          <a
            href="https://thirdweb.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={Logo} alt="Thirdweb Logo" width={135} />
          </a>
        </div>
      </div>
      <div className={styles.right}>
        {address ? (
          <>
            <a
              className={styles.secondaryButton}
              onClick={() => disconnectWallet()}
            >
              Disconnect Wallet
            </a>
            <p style={{ marginLeft: 8, marginRight: 8, color: "grey" }}>|</p>
            <p>{address.slice(0, 6).concat("...").concat(address.slice(-4))}</p>
          </>
        ) : (
          <a
            className={styles.mainButton}
            onClick={() => connectWithMetamask()}
          >
            Connect Wallet
          </a>
        )}
      </div>
    </div>
  );
}
