#[allow(lint(public_entry))]
module merch_store::store;

use std::string::{Self, String};
use sui::coin::{Self, Coin};
use sui::display;
use sui::event;
use sui::package;
use sui::sui::SUI;

// ====== Error Codes ======
const ENotAdmin: u64 = 1;
const EInsufficientStock: u64 = 2;
const EInsufficientPayment: u64 = 3;
const EInvalidDeliveryInfo: u64 = 5;
const EInvalidEmailFormat: u64 = 6;

/// One-Time Witness for the module
public struct STORE has drop {}

/// Delivery information for orders
public struct DeliveryInfo has store, copy, drop {
    recipient_name: String,
    address_line_1: String,
    address_line_2: String,
    city: String,
    postal_code: String,
    country: String,
    email: String,
    phone: String,
}

/// The main store object, owned by the admin
public struct Store has key {
    id: UID,
    admin: address,
    product_count: u64,
}

/// Individual product with Walrus metadata reference
public struct Product has key, store {
    id: UID,
    name: String,
    price: u64, // Price in MIST (1 SUI = 1_000_000_000 MIST)
    stock: u64,
    walrus_blob_id: String, // Walrus blob ID for product image/metadata
    product_id: u64,
}

/// Receipt NFT minted to buyer on successful purchase
public struct Receipt has key, store {
    id: UID,
    product_name: String,
    product_id: u64,
    price_paid: u64,
    buyer: address,
    walrus_blob_id: String, // Reference to product metadata
    delivery_info: Option<DeliveryInfo>,
    checkout_timestamp: u64,
}

// ====== Events ======

public struct StoreCreated has copy, drop {
    store_id: ID,
    admin: address,
}

public struct ProductAdded has copy, drop {
    product_id: u64,
    name: String,
    price: u64,
    stock: u64,
}

public struct ProductPurchased has copy, drop {
    product_id: u64,
    buyer: address,
    price: u64,
    receipt_id: ID,
}

public struct CheckoutCompleted has copy, drop {
    product_id: u64,
    buyer: address,
    receipt_id: ID,
    delivery_city: String,
    delivery_country: String,
    timestamp: u64,
}

// ====== Admin Functions ======

fun init(otw: STORE, ctx: &mut TxContext) {
    let keys = vector[
        string::utf8(b"name"),
        string::utf8(b"link"),
        string::utf8(b"image_url"),
        string::utf8(b"description"),
        string::utf8(b"project_url"),
        string::utf8(b"creator"),
    ];

    let values = vector[
        string::utf8(b"{product_name}"),
        string::utf8(b"https://sui-merch.vercel.app/products/{product_id}"),
        string::utf8(b"https://publisher.walrus-testnet.walrus.site/v1/blobs/{walrus_blob_id}"),
        string::utf8(b"Official receipt for {product_name} from SuiMerch Store"),
        string::utf8(b"https://sui-merch.vercel.app"),
        string::utf8(b"SuiMerch Store"),
    ];

    let publisher = package::claim(otw, ctx);
    let mut display = display::new_with_fields<Receipt>(
        &publisher,
        keys,
        values,
        ctx,
    );

    display::update_version(&mut display);

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());
}

/// Initialize the merch store (called once by admin)
public entry fun create_store(ctx: &mut TxContext) {
    let store = Store {
        id: object::new(ctx),
        admin: ctx.sender(),
        product_count: 0,
    };

    event::emit(StoreCreated {
        store_id: object::id(&store),
        admin: ctx.sender(),
    });

    transfer::share_object(store);
}

/// Add a new product to the store (admin only)
/// walrus_blob_id should be the Walrus storage reference uploaded offchain
public entry fun add_product(
    store: &mut Store,
    name: vector<u8>,
    price: u64,
    stock: u64,
    walrus_blob_id: vector<u8>,
    ctx: &mut TxContext,
) {
    assert!(ctx.sender() == store.admin, ENotAdmin);

    store.product_count = store.product_count + 1;

    let product = Product {
        id: object::new(ctx),
        name: string::utf8(name),
        price,
        stock,
        walrus_blob_id: string::utf8(walrus_blob_id),
        product_id: store.product_count,
    };

    event::emit(ProductAdded {
        product_id: store.product_count,
        name: product.name,
        price,
        stock,
    });

    transfer::public_share_object(product);
}

/// Update product stock (admin only)
public entry fun update_stock(
    store: &Store,
    product: &mut Product,
    new_stock: u64,
    ctx: &TxContext,
) {
    assert!(ctx.sender() == store.admin, ENotAdmin);
    product.stock = new_stock;
}

// ====== User Functions ======

/// Validate delivery information
fun validate_delivery_info(delivery: &DeliveryInfo) {
    assert!(string::length(&delivery.recipient_name) > 0, EInvalidDeliveryInfo);
    assert!(string::length(&delivery.address_line_1) > 0, EInvalidDeliveryInfo);
    assert!(string::length(&delivery.city) > 0, EInvalidDeliveryInfo);
    assert!(string::length(&delivery.postal_code) > 0, EInvalidDeliveryInfo);
    assert!(string::length(&delivery.country) > 0, EInvalidDeliveryInfo);
    assert!(string::length(&delivery.email) > 0, EInvalidEmailFormat);
    assert!(string::length(&delivery.phone) > 0, EInvalidDeliveryInfo);
}

/// Purchase a product with SUI
/// Decreases stock and mints a Receipt NFT to the buyer
public entry fun purchase(product: &mut Product, payment: Coin<SUI>, ctx: &mut TxContext) {
    // Verify stock availability
    assert!(product.stock > 0, EInsufficientStock);

    // Verify payment amount
    let payment_amount = coin::value(&payment);
    assert!(payment_amount >= product.price, EInsufficientPayment);

    // Decrease stock
    product.stock = product.stock - 1;

    // Create Receipt NFT for buyer
    let receipt = Receipt {
        id: object::new(ctx),
        product_name: product.name,
        product_id: product.product_id,
        price_paid: product.price,
        buyer: ctx.sender(),
        walrus_blob_id: product.walrus_blob_id,
        delivery_info: option::none(),
        checkout_timestamp: 0,
    };

    let receipt_id = object::id(&receipt);

    event::emit(ProductPurchased {
        product_id: product.product_id,
        buyer: ctx.sender(),
        price: product.price,
        receipt_id,
    });

    // Transfer payment to store admin (product object doesn't hold balance)
    // In production, you'd transfer to the store's treasury
    transfer::public_transfer(payment, @merch_store);

    // Transfer Receipt NFT to buyer
    transfer::public_transfer(receipt, ctx.sender());
}

/// Checkout with delivery information - Purchase product and add delivery details
/// This is a convenient all-in-one function for purchasing with delivery info
public entry fun checkout(
    product: &mut Product,
    payment: Coin<SUI>,
    recipient_name: vector<u8>,
    address_line_1: vector<u8>,
    address_line_2: vector<u8>,
    city: vector<u8>,
    postal_code: vector<u8>,
    country: vector<u8>,
    email: vector<u8>,
    phone: vector<u8>,
    ctx: &mut TxContext,
) {
    // Verify stock availability
    assert!(product.stock > 0, EInsufficientStock);

    // Verify payment amount
    let payment_amount = coin::value(&payment);
    assert!(payment_amount >= product.price, EInsufficientPayment);

    // Create and validate delivery info
    let delivery = DeliveryInfo {
        recipient_name: string::utf8(recipient_name),
        address_line_1: string::utf8(address_line_1),
        address_line_2: string::utf8(address_line_2),
        city: string::utf8(city),
        postal_code: string::utf8(postal_code),
        country: string::utf8(country),
        email: string::utf8(email),
        phone: string::utf8(phone),
    };

    validate_delivery_info(&delivery);

    // Decrease stock
    product.stock = product.stock - 1;

    // Create Receipt NFT with delivery info
    let receipt = Receipt {
        id: object::new(ctx),
        product_name: product.name,
        product_id: product.product_id,
        price_paid: product.price,
        buyer: ctx.sender(),
        walrus_blob_id: product.walrus_blob_id,
        delivery_info: option::some(delivery),
        checkout_timestamp: ctx.epoch(),
    };

    let receipt_id = object::id(&receipt);

    event::emit(CheckoutCompleted {
        product_id: product.product_id,
        buyer: ctx.sender(),
        receipt_id,
        delivery_city: delivery.city,
        delivery_country: delivery.country,
        timestamp: ctx.epoch(),
    });

    // Transfer payment to store admin
    transfer::public_transfer(payment, @merch_store);

    // Transfer Receipt NFT to buyer
    transfer::public_transfer(receipt, ctx.sender());
}

// ====== View Functions ======

/// Get product details
public fun get_product_info(product: &Product): (String, u64, u64, String, u64) {
    (product.name, product.price, product.stock, product.walrus_blob_id, product.product_id)
}

/// Get receipt details
public fun get_receipt_info(receipt: &Receipt): (String, u64, u64, address, String) {
    (
        receipt.product_name,
        receipt.product_id,
        receipt.price_paid,
        receipt.buyer,
        receipt.walrus_blob_id,
    )
}

/// Get delivery info from receipt
public fun get_delivery_info(receipt: &Receipt): Option<DeliveryInfo> {
    receipt.delivery_info
}

/// Get checkout timestamp
public fun get_checkout_timestamp(receipt: &Receipt): u64 {
    receipt.checkout_timestamp
}


