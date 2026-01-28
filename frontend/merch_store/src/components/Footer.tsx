const Footer = () => {
  return (
    <footer className="border-t-2 border-border bg-secondary/30 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SuiMerch</h3>
            <p className="text-sm text-muted-foreground">
              Decentralized merch store powered by Sui blockchain and Walrus storage.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Tech Stack</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-mono">
              <li>→ Sui Move Smart Contracts</li>
              <li>→ Walrus Decentralized Storage</li>
              <li>→ Receipt NFTs</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://sui.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Sui Network
                </a>
              </li>
              <li>
                <a 
                  href="https://walrus.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Walrus
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground font-mono">
          Powered by suinetwork • 2026
        </div>
      </div>
    </footer>
  );
};

export default Footer;
