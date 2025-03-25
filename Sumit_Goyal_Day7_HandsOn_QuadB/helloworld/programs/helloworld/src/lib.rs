use anchor_lang::prelude::*;

declare_id!("5ZXQQdpD5Uu7muN93mJ9LMMPsPQYgfCdG4A9aeWz4YQj");

#[program]
pub mod helloworld {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
