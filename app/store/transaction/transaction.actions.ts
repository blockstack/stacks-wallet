import { createAction } from '@reduxjs/toolkit';
import { safeAwait } from '@blockstack/ui';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';
import BigNumber from 'bignumber.js';
import { broadcastTransaction, StacksTransaction } from '@blockstack/stacks-transactions';

import { Api } from '../../api/api';
import { stacksNetwork } from '../../environment';
import { safelyFormatHexTxid } from '../../utils/safe-handle-txid';
import { addPendingTransaction } from '../pending-transaction';
import { Dispatch } from '../index';
import { homeActions } from '../home/home.reducer';

export const pendingTransactionSuccessful = createAction<Transaction>(
  'transactions/pending-transaction-successful'
);

const fetchTxName = 'transactions/fetch-transactions';
export const fetchTransactions = createAction(fetchTxName);
export const fetchTransactionsDone = createAction<Transaction[]>(fetchTxName + '-done');
export const fetchTransactionsFail = createAction(fetchTxName + '-fail');

export function getAddressTransactions(address: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchTransactions());
    const [error, response] = await safeAwait(Api.getAddressTransactions(address));
    if (error) {
      dispatch(fetchTransactionsFail());
      return;
    }
    if (response) {
      const transactions = response.data.results;
      dispatch(fetchTransactionsDone(transactions));
    }
  };
}

export const broadcastTx = createAction('transactions/broadcast-transactions');
export const broadcastTxDone = createAction('transactions/broadcast-transactions-done');
export const broadcastTxFail = createAction('transactions/broadcast-transactions-fail');

interface BroadcastStxTransactionArgs {
  signedTx: StacksTransaction;
  amount: BigNumber;
}

export function broadcastStxTransaction({ signedTx, amount }: BroadcastStxTransactionArgs) {
  return async (dispatch: Dispatch) => {
    const [error, blockchainResponse] = await safeAwait(
      broadcastTransaction(signedTx, stacksNetwork)
    );

    if (error || !blockchainResponse) return null;
    if (typeof blockchainResponse !== 'string') {
      // setError for ui
      return;
    }
    dispatch(homeActions.closeTxModal());
    dispatch(
      addPendingTransaction({
        txId: safelyFormatHexTxid(blockchainResponse),
        amount: amount.toString(),
        time: +new Date(),
      })
    );
    return blockchainResponse;
  };
}
