import { useDAppKit, useCurrentAccount } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';
import { MERCH_STORE_CONFIG, MODULE_NAME, NFT_MODULE_NAME, FUNCTIONS } from '@/lib/contracts';

import { toast } from '@/hooks/use-toast';

interface PurchaseParams {
  productId: number;
  productName: string;
  price: number;
  size: string;
  productImage: string;
  priceInMist: bigint;
}

export function usePurchase() {
  const dAppKit = useDAppKit();
  const account = useCurrentAccount();

  const purchase = async ({ productId, productName, price, size, productImage, priceInMist }: PurchaseParams) => {
    if (!account) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to make a purchase.',
        variant: 'destructive',
      });
      return null;
    }

    const productObjectId = MERCH_STORE_CONFIG.PRODUCTS[productId];
    const isDemo = !productObjectId || productObjectId === '0x...';

    try {
      const tx = new Transaction();

      // Split the exact amount of SUI needed for the purchase
      const [paymentCoin] = tx.splitCoins(tx.gas, [priceInMist]);

      if (isDemo) {
        // DEMO MODE: Transfer SUI to a mock merchant address to show a deduction in the wallet
        console.log(`Demo Mode: Sending ${priceInMist} MIST to Merchant for demonstration`);
        const DUMMY_MERCHANT = '0x5555555555555555555555555555555555555555555555555555555555555555';
        tx.transferObjects([paymentCoin], DUMMY_MERCHANT);
      } else {
        // REAL MODE: Call the smart contract
        tx.moveCall({
          target: `${MERCH_STORE_CONFIG.PACKAGE_ID}::${MODULE_NAME}::${FUNCTIONS.PURCHASE}`,
          arguments: [
            tx.object(productObjectId), // Product object
            paymentCoin, // Payment coin
            tx.pure.string(size), // Selected Size
            tx.pure.string(new Date().toISOString()), // ISO Purchase Date
          ],
        });
      }

      const result = await dAppKit.signAndExecuteTransaction({ transaction: tx });

      // Handle the transaction result structure (Standard or Wrapper)
      if (result) {
        toast({
          title: 'Purchase successful! 🎉',
          description: `Transaction submitted successfully. Your ${productName} receipt NFT will appear in your wallet shortly.`,
        });

        // Mint the receipt NFT
        try {
          const nftTx = new Transaction();
          const purchaseDate = new Date().toISOString();
          
          nftTx.moveCall({
            target: `${MERCH_STORE_CONFIG.PACKAGE_ID}::${NFT_MODULE_NAME}::${FUNCTIONS.MINT_RECEIPT_NFT}`,
            arguments: [
              nftTx.pure.string(productName),
              nftTx.pure.u64(productId),
              nftTx.pure.u64(priceInMist),
              nftTx.pure.string(size),
              nftTx.pure.string(productImage),
              nftTx.pure.string(purchaseDate),
              nftTx.pure.address(account.address),
            ],
          });

          await dAppKit.signAndExecuteTransaction({ transaction: nftTx });
          toast({
            title: 'Receipt NFT sent! 🎁',
            description: `Your ${productName} receipt NFT has been minted and sent to your wallet.`,
          });
        } catch (nftError) {
          console.error('NFT minting warning:', nftError);
          // NFT minting failed but purchase succeeded, so don't block the user
          toast({
            title: 'Purchase Complete',
            description: 'Your purchase was successful, but we had trouble minting your receipt NFT. Please try again.',
            variant: 'default',
          });
        }

        return result;
      }

      return null;
    } catch (error) {
      console.error('Purchase failed:', error);
      toast({
        title: 'Purchase failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    purchase,
    isConnected: !!account,
    account,
  };
}
