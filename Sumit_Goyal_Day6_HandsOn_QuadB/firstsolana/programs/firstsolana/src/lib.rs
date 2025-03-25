use anchor_lang::prelude::*;

declare_id!("HouhydntDvbktzYwM8e81dSU5M74nQqkivSroVKd3Esa");

#[program]
pub mod firstsolana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
