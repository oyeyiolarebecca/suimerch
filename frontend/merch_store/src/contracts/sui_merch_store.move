/// SuiMerch Store - A decentralized merchandise store on Sui blockchain
/// This module enables:
/// - Admin to create/manage products with Walrus blob references
/// - Users to purchase merch with SUI tokens
/// - Automatic minting of Receipt NFTs on purchase
/// 
/// Walrus uploads happen offchain; this contract stores blob_id references only.

module sui_merch::store {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;

    // ============== Error Codes ==============
    const ENotAdmin: u64 = 0;
    const EInsufficientPayment: u64 = 1;
    const EOutOfStock: u64 = 2;
    const EProductNotFound: u64 = 3;
    const EInvalidStock: u64 = 4;

    // ============== Structs ==============

    /// Admin capability - only the admin can create/modify products
    public struct AdminCap has key, store {
        id: UID,
    }

    /// The main store object holding products and revenue
    public struct Store has key {
        id: UID,
        name: vector<u8>,
        revenue: Balance<SUI>,
        product_count: u64,
    }

    /// Product listing with Walrus metadata reference
    public struct Product has key, store {
        id: UID,
        store_id: ID,
        name: vector<u8>,
        description: vector<u8>,
        price: u64,           // Price in MIST (1 SUI = 1_000_000_000 MIST)
        stock: u64,
        /// Walrus blob_id for product image/metadata (uploaded offchain)
        walrus_blob_id: vector<u8>,
        /// Optional URI for additional metadata
        metadata_uri: vector<u8>,
    }

    /// Receipt NFT - minted to buyer on successful purchase
    public struct Receipt has key, store {
        id: UID,
        product_id: ID,
        product_name: vector<u8>,
        price_paid: u64,
        buyer: address,
        timestamp: u64,
        /// Reference to product's Walrus blob for display
        walrus_blob_id: vector<u8>,
    }

    // ============== Events ==============

    public struct StoreCreated has copy, drop {
        store_id: ID,
        admin: address,
    }

    public struct ProductCreated has copy, drop {
        product_id: ID,
        store_id: ID,
        name: vector<u8>,
        price: u64,
        stock: u64,
    }

    public struct ProductPurchased has copy, drop {
        receipt_id: ID,
        product_id: ID,
        buyer: address,
        price: u64,
    }

    // ============== Init ==============

    /// Called once on module publish - creates AdminCap for deployer
    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, ctx.sender());
    }

    // ============== Admin Functions ==============

    /// Create a new store (admin only)
    public entry fun create_store(
        _admin: &AdminCap,
        name: vector<u8>,
        ctx: &mut TxContext
    ) {
        let store = Store {
            id: object::new(ctx),
            name,
            revenue: balance::zero(),
            product_count: 0,
        };
        
        let store_id = object::id(&store);
        
        event::emit(StoreCreated {
            store_id,
            admin: ctx.sender(),
        });
        
        transfer::share_object(store);
    }

    /// Create a new product (admin only)
    /// walrus_blob_id: The blob ID from Walrus for the product image
    /// metadata_uri: Optional additional metadata URI
    public entry fun create_product(
        _admin: &AdminCap,
        store: &mut Store,
        name: vector<u8>,
        description: vector<u8>,
        price: u64,
        stock: u64,
        walrus_blob_id: vector<u8>,
        metadata_uri: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(stock > 0, EInvalidStock);
        
        let product = Product {
            id: object::new(ctx),
            store_id: object::id(store),
            name,
            description,
            price,
            stock,
            walrus_blob_id,
            metadata_uri,
        };
        
        let product_id = object::id(&product);
        store.product_count = store.product_count + 1;
        
        event::emit(ProductCreated {
            product_id,
            store_id: object::id(store),
            name: product.name,
            price,
            stock,
        });
        
        transfer::share_object(product);
    }

    /// Update product stock (admin only)
    public entry fun update_stock(
        _admin: &AdminCap,
        product: &mut Product,
        new_stock: u64,
    ) {
        product.stock = new_stock;
    }

    /// Update product price (admin only)
    public entry fun update_price(
        _admin: &AdminCap,
        product: &mut Product,
        new_price: u64,
    ) {
        product.price = new_price;
    }

    /// Withdraw revenue from store (admin only)
    public entry fun withdraw_revenue(
        _admin: &AdminCap,
        store: &mut Store,
        ctx: &mut TxContext
    ) {
        let amount = store.revenue.value();
        let revenue_coin = coin::from_balance(
            store.revenue.split(amount),
            ctx
        );
        transfer::public_transfer(revenue_coin, ctx.sender());
    }

    // ============== User Functions ==============

    /// Purchase a product - pays in SUI, receives Receipt NFT
    public entry fun purchase(
        store: &mut Store,
        product: &mut Product,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        // Verify product belongs to this store
        assert!(product.store_id == object::id(store), EProductNotFound);
        
        // Check stock availability
        assert!(product.stock > 0, EOutOfStock);
        
        // Verify payment amount
        let payment_amount = payment.value();
        assert!(payment_amount >= product.price, EInsufficientPayment);
        
        // Process payment
        let mut payment_balance = payment.into_balance();
        
        // Take exact price, refund excess
        let paid = payment_balance.split(product.price);
        store.revenue.join(paid);
        
        // Refund any excess payment
        if (payment_balance.value() > 0) {
            transfer::public_transfer(
                coin::from_balance(payment_balance, ctx),
                ctx.sender()
            );
        } else {
            payment_balance.destroy_zero();
        };
        
        // Decrease stock
        product.stock = product.stock - 1;
        
        // Mint Receipt NFT to buyer
        let receipt = Receipt {
            id: object::new(ctx),
            product_id: object::id(product),
            product_name: product.name,
            price_paid: product.price,
            buyer: ctx.sender(),
            timestamp: ctx.epoch_timestamp_ms(),
            walrus_blob_id: product.walrus_blob_id,
        };
        
        let receipt_id = object::id(&receipt);
        
        event::emit(ProductPurchased {
            receipt_id,
            product_id: object::id(product),
            buyer: ctx.sender(),
            price: product.price,
        });
        
        transfer::transfer(receipt, ctx.sender());
    }

    // ============== View Functions ==============

    /// Get product details
    public fun get_product_info(product: &Product): (vector<u8>, vector<u8>, u64, u64, vector<u8>) {
        (
            product.name,
            product.description,
            product.price,
            product.stock,
            product.walrus_blob_id
        )
    }

    /// Get store revenue balance
    public fun get_store_revenue(store: &Store): u64 {
        store.revenue.value()
    }

    /// Get receipt details
    public fun get_receipt_info(receipt: &Receipt): (vector<u8>, u64, address, u64) {
        (
            receipt.product_name,
            receipt.price_paid,
            receipt.buyer,
            receipt.timestamp
        )
    }

    // ============== Test Helpers ==============
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
