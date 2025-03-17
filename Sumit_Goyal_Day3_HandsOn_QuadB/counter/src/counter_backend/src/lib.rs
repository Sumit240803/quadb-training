use candid::candid_method;
use ic_cdk::storage;
use std::cell::RefCell;

thread_local! {
    static COUNTER: RefCell<u64> = RefCell::new(0);
}

#[ic_cdk::update]
#[candid_method(update)]
pub fn increment() -> u64 {
    COUNTER.with(|counter| {
        let mut count = counter.borrow_mut();
        *count += 1;
        *count
    })
}

#[ic_cdk::query]
#[candid_method(query)]
pub fn get_count() -> u64 {
    COUNTER.with(|counter| *counter.borrow())
}

#[ic_cdk::pre_upgrade]
pub fn pre_upgrade() {
    let count = COUNTER.with(|counter| *counter.borrow());
    storage::stable_save((count,)).expect("Failed to save counter state");
}

#[ic_cdk::post_upgrade]
pub fn post_upgrade() {
    let count: Option<(u64,)> = storage::stable_restore().ok();
    if let Some((saved_count,)) = count {
        COUNTER.with(|counter| *counter.borrow_mut() = saved_count);
    }
}
