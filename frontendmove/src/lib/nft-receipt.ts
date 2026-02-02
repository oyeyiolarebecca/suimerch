import { Transaction } from '@mysten/sui/transactions';
import { MERCH_STORE_CONFIG, NFT_MODULE_NAME, FUNCTIONS } from '@/lib/contracts';

export interface ReceiptNFTData {
  productId: number;
  productName: string;
  price: number;
  size: string;
  productImage: string;
  purchaseDate: string;
  transactionId?: string;
}

/**
 * Creates a transaction to mint a receipt NFT using the dedicated mint_nft module
 */
export function createReceiptNFTTransaction(
  recipientAddress: string,
  receiptData: ReceiptNFTData
): Transaction {
  const tx = new Transaction();

  // Call the mint_receipt function in the mint_nft module
  tx.moveCall({
    target: `${MERCH_STORE_CONFIG.PACKAGE_ID}::${NFT_MODULE_NAME}::${FUNCTIONS.MINT_RECEIPT}`,
    arguments: [
      tx.pure.string(receiptData.productName),
      tx.pure.u64(receiptData.productId),
      tx.pure.u64(Math.floor(receiptData.price * 1_000_000_000)), // Convert to MIST
      tx.pure.string(receiptData.size),
      tx.pure.string(receiptData.productImage),
      tx.pure.string(receiptData.purchaseDate),
      tx.pure.address(recipientAddress),
    ],
  });

  return tx;
}

/**
 * Formats receipt data for display
 */
export function formatReceiptData(data: ReceiptNFTData): string {
  return `
Product: ${data.productName}
Price: ${data.price} SUI
Size: ${data.size}
Date: ${data.purchaseDate}
Transaction ID: ${data.transactionId || 'Pending...'}
  `.trim();
}
