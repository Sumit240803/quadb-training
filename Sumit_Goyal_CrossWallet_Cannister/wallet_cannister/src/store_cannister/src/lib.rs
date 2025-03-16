use ic_cdk::{call, export_candid};
use candid::Principal;
use ic_cdk::api::call::RejectionCode;

#[ic_cdk::update]
async fn buy_item(wallet_canister_id: String, price: u64) -> String {
    // Try to parse Principal safely
    let wallet = match Principal::from_text(&wallet_canister_id) {
        Ok(principal) => principal,
        Err(_) => return "Invalid wallet canister ID".to_string(),
    };

    // No need to convert price (it is already u64)
    let result: Result<(), (RejectionCode, String)> = call(wallet, "withdraw", (price,)).await;

    match result {
        Ok(_) => "Purchase Successful".to_string(),
        Err((code, msg)) => format!("Purchase Failed: {:?} - {}", code, msg),
    }
}

export_candid!();
