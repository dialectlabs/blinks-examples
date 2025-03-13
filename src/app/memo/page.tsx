'use client';

import "@dialectlabs/blinks/index.css";
import {
  Blink,
  useBlink,
  useBlinksRegistryInterval,
} from "@dialectlabs/blinks";
import { useBlinkSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";


export default function MemoBlinkPage() {
  // URL of your endpoint (blink provider)
  const blinkApiUrl = "blink:http://localhost:3000/api/actions/memo";

  const { adapter } = useBlinkSolanaWalletAdapter(
    "https://api.devnet.solana.com"
  );

  const { blink, isLoading } = useBlink({ url: blinkApiUrl });

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Memo Blink</h1>
      <div className="max-w-md mx-auto">
        <Blink adapter={adapter} blink={blink!} securityLevel='all' />
      </div>
    </div>
  )
}