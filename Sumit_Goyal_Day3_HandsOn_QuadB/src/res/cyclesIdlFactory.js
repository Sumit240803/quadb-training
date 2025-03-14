export const idlFactory = ({ IDL }) => {
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });

  const TransferFromArgs = IDL.Record({
    'to': Account,
    'fee': IDL.Opt(IDL.Nat),
    'spender_subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from': Account,
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time': IDL.Opt(IDL.Nat64),
    'amount': IDL.Nat,
  });

  const TransferArgs = IDL.Record({
    'to': Account,
    'fee': IDL.Opt(IDL.Nat),
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time': IDL.Opt(IDL.Nat64),
    'amount': IDL.Nat,
  });


  const TransferError = IDL.Variant({
    'GenericError': IDL.Record({ 'message': IDL.Text, 'error_code': IDL.Nat }),
    'TemporarilyUnavailable': IDL.Null,
    'BadBurn': IDL.Record({ 'min_burn_amount': IDL.Nat }),
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': IDL.Nat }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'TooOld': IDL.Null,
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat }),
  });

  const TransferErrorICRC2 = IDL.Variant({
    'GenericError': IDL.Record({ 'message': IDL.Text, 'error_code': IDL.Nat }),
    'TemporarilyUnavailable': IDL.Null,
    'InsufficientAllowance': IDL.Record({ 'allowance': IDL.Nat }),
    'BadBurn': IDL.Record({ 'min_burn_amount': IDL.Nat }),
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': IDL.Nat }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'TooOld': IDL.Null,
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat }),
  });

  const TransferResult = IDL.Variant({
    'Ok': IDL.Nat,
    'Err': TransferError,
  });

  const TransferResultICRC2 = IDL.Variant({
    'Ok': IDL.Nat,
    'Err': TransferErrorICRC2,
  });

  const RejectionCode = IDL.Variant({
    'NoError': IDL.Null,
    'CanisterError': IDL.Null,
    'SysTransient': IDL.Null,
    'DestinationInvalid': IDL.Null,
    'Unknown': IDL.Null,
    'SysFatal': IDL.Null,
    'CanisterReject': IDL.Null,
  });

  const WithdrawArgs = IDL.Record({
    'to': IDL.Principal,
    'from_subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time': IDL.Opt(IDL.Nat64),
    'amount': IDL.Nat,
  });

  const FailedToWithdraw = IDL.Record({
    'rejection_code': RejectionCode,
    'fee_block': IDL.Opt(IDL.Nat),
    'rejection_reason': IDL.Text,
  });

  const WithdrawError = IDL.Variant({
    'FailedToWithdraw': FailedToWithdraw,
    'GenericError': IDL.Record({ 'message': IDL.Text, 'error_code': IDL.Nat }),
    'TemporarilyUnavailable': IDL.Null,
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': IDL.Nat }),
    'InvalidReceiver': IDL.Record({ 'receiver': IDL.Principal }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'TooOld': IDL.Null,
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat }),
  });

  const WithdrawResult = IDL.Variant({
    'Ok': IDL.Nat,
    'Err': WithdrawError,
  });

  
  return IDL.Service({
    'icrc1_balance_of' : IDL.Func([Account], [IDL.Nat], ['query']),
    'icrc1_transfer': IDL.Func([TransferArgs], [TransferResult], []),
    'icrc2_transfer_from': IDL.Func([TransferFromArgs], [TransferResultICRC2], []),
    'withdraw': IDL.Func([WithdrawArgs], [WithdrawResult], []),
  });
  
};
export const init = ({ IDL }) => { return []; };
