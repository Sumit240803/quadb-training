use candid::{CandidType, Deserialize};
use std::collections::HashMap;
use std::cell::RefCell;

#[derive(Default, CandidType, Deserialize)]
struct Voting {
    votes: HashMap<String, u64>,
}

// Store state in thread-local storage
thread_local! {
    static STATE: RefCell<Voting> = RefCell::new(Voting::default());
}

// Update method to cast a vote
#[ic_cdk::update]
fn vote(option: String) {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        let count = state.votes.entry(option).or_insert(0);
        *count += 1;
    });
}

// Query method to get results
#[ic_cdk::query]
fn get_results() -> HashMap<String, u64> {
    STATE.with(|state| state.borrow().votes.clone())
}

// Export Candid interface
ic_cdk::export_candid!();
