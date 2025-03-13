import {
  ACTIONS_CORS_HEADERS,
  BLOCKCHAIN_IDS,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  MEMO_PROGRAM_ID,
} from "@solana/actions";

import {
  PublicKey,
  TransactionMessage,
  Connection,
  TransactionInstruction,
  VersionedTransaction,
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

// CAIP-2 blockchain ID of Solana Devnet
const blockchain = BLOCKCHAIN_IDS.devnet;

// headers for actions
const headers = {
  ...ACTIONS_CORS_HEADERS,
  "x-blockchain-ids": blockchain,
  "x-action-version": "2.4",
};

export const OPTIONS = async () => {
  return new Response(null, { headers });
};

export const GET = async () => {
  const payload: ActionGetResponse = {
    title: "Our memo progam",
    icon: "https://avatars.githubusercontent.com/u/93691676?s=280&v=4",
    description: "Little notes on the blockchain",
    label: "Save memo",
    links: {
      actions: [
        {
          type: "transaction",
          href: "/api/actions/memo",
          label: "Save memo",
          parameters: [
            {
              type: "text",
              name: "memoText",
              label: "Enter your message",
              required: true,
            },
          ],
        },
      ],
    },
  };

  return Response.json(payload, { headers });
};

export const POST = async (req: Request) => {
  const body: ActionPostRequest<{ memoText: string }> = await req.json();
  const account = new PublicKey(body.account);

  const memoText = body.data!.memoText as string;

  const msg = new TransactionMessage({
    payerKey: account,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    instructions: [
      new TransactionInstruction({
        programId: new PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from(memoText, "utf-8"),
        keys: [],
      }),
    ],
  });

  const tx = new VersionedTransaction(msg.compileToV0Message());

  const response: ActionPostResponse = {
    type: "transaction",
    transaction: Buffer.from(tx.serialize()).toString("base64"),
  };

  return Response.json(response, { headers });
};
