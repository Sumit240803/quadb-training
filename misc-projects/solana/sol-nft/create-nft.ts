import {
    createNft,
    fetchDigitalAsset,
    mplTokenMetadata,
  } from "@metaplex-foundation/mpl-token-metadata";
  
  import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
  } from "@solana-developers/helpers";
  
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
  
  import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
  import {
    generateSigner,
    keypairIdentity,
    percentAmount,
    publicKey,
  } from "@metaplex-foundation/umi";
  
  const connection = new Connection(clusterApiUrl("devnet"));
  
  const user = await getKeypairFromFile();
  
  await airdropIfRequired(
    connection,
    user.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
  );
  
  console.log("Loaded user", user.publicKey.toBase58());
  
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  
  const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
  umi.use(keypairIdentity(umiUser));
  
  console.log("Set up Umi instance for user");


  const collectionAddress = publicKey("7zZnrK9VZQECnzeyb9jNUeW7HsTDu7jgPTw3bSdPpC4V")

  console.log(`Creating NFT...`)
  const mint = generateSigner(umi);
  const transaction = await createNft(umi,{
    mint,
    name : "My NFT",
    uri : "https://moccasin-wonderful-pike-595.mypinata.cloud/ipfs/bafkreiazpakxtxnq3u523cz6uartwssbotpncfvesrybmk2n5etiqsy7zy",
    sellerFeeBasisPoints : percentAmount(0),
    collection :{
        key : collectionAddress,
        verified : false
    }
  })

  await transaction.sendAndConfirm(umi,{
    confirm :{
        commitment : "finalized"
    }
  })

  const created = await fetchDigitalAsset(umi,mint.publicKey)

  console.log(
    `🖼️ Created NFT! Address is ${getExplorerLink(
      "address",
      created.mint.publicKey,
      "devnet"
    )}`
  );