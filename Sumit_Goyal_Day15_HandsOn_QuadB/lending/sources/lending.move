module 0xc6aa93bf284dcb72e597e1be9f1df3035f0f3ef676e9a465d580dd665bcf5bca::lending {
    use std::signer;
    use std::vector;
    use std::timestamp;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    // Error codes
    const ENOT_ADMIN: u64 = 1;
    const ELOAN_NOT_FOUND: u64 = 2;
    const EINSUFFICIENT_POOL_FUNDS: u64 = 3;

    /// Struct to track a user's loan
    struct Loan has store, drop {
        amount: u64,
        interest_rate: u64, // Annual percentage rate (e.g., 5 = 5%)
        start_time: u64,
    }

    struct Loans has key {
        active_loans: vector<Loan>,
    }

    /// Lending pool resource
    struct LendingPool has key {
        coins: coin::Coin<AptosCoin>,
    }

    /// Initialize user loan tracking
    public fun init_user(account: &signer) {
        move_to(account, Loans {
            active_loans: vector::empty<Loan>(),
        });
    }

    /// Initialize lending pool (admin only)
    public entry fun init_pool(admin: &signer) {
        assert!(signer::address_of(admin) == @lending_admin, ENOT_ADMIN);
        
        let initial_coins = coin::withdraw<AptosCoin>(admin, 100000000); // Initial pool funding
        move_to(admin, LendingPool { coins: initial_coins });
    }

    /// Take a loan from the pool
    public entry fun take_loan(
        user: &signer,
        amount: u64,
        interest_rate: u64,
    ) acquires LendingPool, Loans {
        let pool = borrow_global_mut<LendingPool>(@lending_admin);
        assert!(coin::value(&pool.coins) >= amount, EINSUFFICIENT_POOL_FUNDS);

        // Create new loan record
        let new_loan = Loan {
            amount,
            interest_rate,
            start_time: timestamp::now_seconds(),
        };

        // Update user's loan records
        let user_address = signer::address_of(user);
        if (!exists<Loans>(user_address)) {
            move_to(user, Loans { active_loans: vector::empty() });
        };
        
        let loans = borrow_global_mut<Loans>(user_address);
        vector::push_back(&mut loans.active_loans, new_loan);

        // Transfer funds from pool to user
        let loan_coins = coin::extract(&mut pool.coins, amount);
        coin::deposit(user_address, loan_coins);
    }

    /// Repay a loan
    public entry fun repay_loan(
    user: &signer,
    loan_index: u64,
) acquires LendingPool, Loans {
    let user_address = signer::address_of(user);
    let loans = borrow_global_mut<Loans>(user_address);
    
    assert!(loan_index < vector::length(&loans.active_loans), ELOAN_NOT_FOUND);
    let loan = vector::borrow(&loans.active_loans, loan_index);

    // Calculate interest
    let current_time = timestamp::now_seconds();
    let duration_seconds = current_time - loan.start_time;
    let annual_interest = loan.amount * loan.interest_rate / 100;
    
    // Corrected interest calculation
    let interest = ((annual_interest as u128) * 
                  (duration_seconds as u128)) / 
                  (31536000 as u128);  // 365*24*3600 = 31,536,000
    
    let total_due = loan.amount + (interest as u64);

    // Process payment
    let payment_coins = coin::withdraw<AptosCoin>(user, total_due);
    let pool = borrow_global_mut<LendingPool>(@lending_admin);
    coin::merge(&mut pool.coins, payment_coins);

    // Remove the loan
    vector::remove(&mut loans.active_loans, loan_index);
}

    // Helper function to get pool balance
    public fun get_pool_balance(): u64 acquires LendingPool {
        let pool = borrow_global<LendingPool>(@lending_admin);
        coin::value(&pool.coins)
    }
}