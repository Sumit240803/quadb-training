export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : IDL.Text });
  return IDL.Service({ 'get_canister_id' : IDL.Func([], [Result], []) });
};
export const init = ({ IDL }) => { return []; };
