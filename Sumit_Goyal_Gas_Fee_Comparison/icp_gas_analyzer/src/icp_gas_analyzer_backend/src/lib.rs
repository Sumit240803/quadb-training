use candid::Principal;
use ic_cdk::{query, update};
use ic_cdk::api::call::call;

#[update]
pub async fn simulate_transfer(canister_id: Principal)-> String{
    let before = ic_cdk::api::call::msg_cycles_available128();

    let _: Result<(),_> = call::<(),()>(canister_id,"ping",()).await;
    let after = ic_cdk::api::call::msg_cycles_available128();
    format!("Cycles Used: {}",before - after)

}

#[query]
fn hello()-> String{
    "ICP Gas Analyzer is Live!".to_string()
}