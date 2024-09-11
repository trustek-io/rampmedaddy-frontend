import { PasskeyKit, PasskeyServer, SACClient } from "passkey-kit";
import { Account, Keypair, SorobanRpc, StrKey } from "@stellar/stellar-sdk"
import { Buffer } from "buffer";
import { WebAuthn } from "@darkedges/capacitor-native-webauthn";
import { basicNodeSigner } from "@stellar/stellar-sdk/lib/contract";

const VITE_factoryContractId = "CCPLERXCJZB7LX2VOSOCBNRN754FRLHI6Y2AVOQBA5L7C2ZJX5RFVVET"
const VITE_nativeContractId = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
const VITE_networkPassphrase = "Test SDF Network ; September 2015"
const VITE_rpcUrl = "https://soroban-testnet.stellar.org"
const VITE_launchtubeUrl = "https://launchtube.sdf-ecosystem.workers.dev"
const VITE_launchtubeJwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlMWM1YzA0N2RjYTA4MmEwNGRkNzdkNWY3NDE3ZTk5ZDhhZmI2NmZmZWM5ZTBiMmI4ODhkZDQ4NDMxOGI4YzAwIiwiZXhwIjoxNzMzMjc4OTc2LCJjcmVkaXRzIjoxMDAwMDAwMDAwLCJpYXQiOjE3MjYwMjEzNzZ9.GqBhFpkEylGLzOpJsFQhceY6snJmMJdh-2oB3J5dJm0"
const VITE_mercuryUrl = "https://api.mercurydata.app"
const VITE_mercuryJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZ29vZ2xlb2F1dGgyMTAwNzY1MTcwNTcxNDQ5NTIzNDgzIiwiZXhwIjoxNzI3NTQzNDM2LCJ1c2VyX2lkIjoxMywidXNlcm5hbWUiOiJ0eWxlckBzdGVsbGFyLm9yZyIsImlhdCI6MTcyNDk1MTQzNSwiYXVkIjoicG9zdGdyYXBoaWxlIiwiaXNzIjoicG9zdGdyYXBoaWxlIn0.gqTyJJbq47PZti0T94kUqTJm5QgrDbNFA7pSs2o-E1k"

export const rpc = new SorobanRpc.Server(VITE_rpcUrl);

export const mockPubkey = StrKey.encodeEd25519PublicKey(Buffer.alloc(32))
export const mockSource = new Account(mockPubkey, '0')

export const fundKeypair = new Promise<Keypair>(async (resolve) => {
  const now = new Date();

  now.setMinutes(0, 0, 0);

  const nowData = new TextEncoder().encode(now.getTime().toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', nowData);
  const keypair = Keypair.fromRawEd25519Seed(Buffer.from(hashBuffer))

  rpc
    .requestAirdrop(keypair.publicKey())
    .catch(() => { })

  resolve(keypair)
})
export const fundPubkey = (await fundKeypair).publicKey()
export const fundSigner = basicNodeSigner(await fundKeypair, VITE_networkPassphrase)

export const account = new PasskeyKit({
  rpcUrl: VITE_rpcUrl,
  networkPassphrase: VITE_networkPassphrase,
  factoryContractId: VITE_factoryContractId,
  WebAuthn
});
export const server = new PasskeyServer({
  rpcUrl: VITE_rpcUrl,
  launchtubeUrl: VITE_launchtubeUrl,
  launchtubeJwt: VITE_launchtubeJwt,
  mercuryUrl: VITE_mercuryUrl,
  mercuryJwt: VITE_mercuryJwt,
});

export const sac = new SACClient({
  rpcUrl: VITE_rpcUrl,
  networkPassphrase: VITE_networkPassphrase,
});
export const native = sac.getSACClient(VITE_nativeContractId)