import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit-react';
import { Wallet } from 'lucide-react';

const WalletButton = () => {
  const account = useCurrentAccount();

  return (
    <div className="wallet-button-wrapper">
      <ConnectButton 
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-foreground border border-border hover:bg-muted hover:scale-105 h-10 px-6 shadow-sm"
      />
      {account && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
          <Wallet className="w-3 h-3" />
          <span>{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
