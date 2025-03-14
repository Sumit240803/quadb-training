export const idlFactory = ({ IDL }) => {
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const DepositToCyclesLedgerResult = IDL.Record({
    'balance' : IDL.Nat,
    'block_index' : IDL.Nat,
    'cycles' : IDL.Nat,
  });
  return IDL.Service({
    'redeem_to_cycles_ledger' : IDL.Func(
        [IDL.Text, Account],
        [DepositToCyclesLedgerResult],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
