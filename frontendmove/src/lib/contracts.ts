// Contract addresses for the merch store
// Update these after deploying your contract to testnet/mainnet

export const MERCH_STORE_CONFIG = {
  // Package ID - deployed contract address (mint_nft module)
  PACKAGE_ID: '0x03e14bd2ee2297cd08774e5b22616e1e672a138978d6517b5d4997252ddddfec',
  
  // Store object ID - the shared Store object
  STORE_ID: '0xeaf7cd8427d20fd4eb7b7d8ce384d75c6aa2c63c2ec2b6534978f7d13339f3ad', // Shared Store Object
  
  // Product object IDs - map product IDs to their on-chain object IDs
  PRODUCTS: {
    1: '0x...', // Walrus Pattern Puffer Hoodie
    2: '0x...', // Walrus Logo Tracksuit
    3: '0x...', // SUI Stake Jersey
    4: '0x...', // SUI Droplet Polo Shirt
    5: '0x...', // SUI Basketball Jersey #7
    6: '0x...', // LOFI Yeti Jersey
  } as Record<number, string>,
};

// Module names in the contract
export const MODULE_NAME = 'store';
export const NFT_MODULE_NAME = 'mint_nft';

// Entry function names
export const FUNCTIONS = {
  PURCHASE: 'purchase',
  CREATE_STORE: 'create_store',
  ADD_PRODUCT: 'add_product',
  UPDATE_STOCK: 'update_stock',
  MINT_RECEIPT_NFT: 'mint_receipt_nft',
} as const;
