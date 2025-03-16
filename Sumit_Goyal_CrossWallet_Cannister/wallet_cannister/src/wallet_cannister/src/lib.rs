use ic_cdk::export_candid;
use std::cell::RefCell;

thread_local! {
    static BALANCE: RefCell<u64> = RefCell::new(100);
}

#[ic_cdk::query]
fn get_balance() -> u64 {
    BALANCE.with(|b| *b.borrow())
}

#[ic_cdk::update]
fn deposit(amount: u64) {
    BALANCE.with(|b| *b.borrow_mut() += amount);
}

#[ic_cdk::update]
fn withdraw(amount: u64) -> Result<(), String> {
    BALANCE.with(|b| {
        let mut balance = b.borrow_mut();
        if *balance >= amount {
            *balance -= amount;
            Ok(())
        } else {
            Err("Insufficient Funds".to_string())
        }
    })
}

export_candid!();
