import type { Transaction, TransactionEvent } from '@blockstack/stacks-blockchain-api-types';
import BigNumber from 'bignumber.js';
import { getStxTxDirection } from './get-stx-transfer-direction';
import { isStackingTx } from './tx-utils';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';

export function sumStxTxTotal(
  address: string,
  tx: Transaction | MempoolTransaction,
  poxContractId?: string
) {
  const dir = getStxTxDirection(address, tx);
  if (tx.tx_type === 'token_transfer') {
    return new BigNumber(tx.token_transfer.amount).plus(dir === 'sent' ? tx.fee_rate : 0);
  }
  if (
    tx.tx_type === 'coinbase' ||
    tx.tx_type === 'poison_microblock' ||
    (tx.tx_type === 'contract_call' && tx.tx_status === 'pending') ||
    (tx.tx_type === 'smart_contract' && tx.tx_status === 'pending')
  ) {
    return new BigNumber(tx.fee_rate);
  }

  if (isStackingTx(tx, poxContractId) && tx.tx_result?.repr) {
    // We get the amount stacked from the tx_result
    const matcher = /\(tuple \(lock-amount\su(\d+)/;
    const matches = matcher.exec(tx.tx_result.repr);
    if (matches && matches[1]) {
      return new BigNumber(matches[1], 10);
    }
  }

  const initialValue = new BigNumber(0);
  const sumEventTransferHandler = (prev: BigNumber, current: TransactionEvent) =>
    current.event_type === 'stx_asset' && current.asset.asset_event_type === 'transfer'
      ? new BigNumber(current.asset.amount || 0).plus(prev)
      : initialValue;
  return tx.events.reduce(sumEventTransferHandler, initialValue).plus(tx.fee_rate);
}
