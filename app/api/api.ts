import axios from 'axios';
import {
  Transaction,
  TransactionResults,
  MempoolTransaction,
  AccountBalance,
} from '@blockstack/stacks-blockchain-sidecar-types';

const api = 'https://sidecar.staging.blockstack.xyz/sidecar';

async function getAddressBalance(address: string) {
  return axios.get<AccountBalance>(api + `/v1/address/${address}/balances`);
}

async function getAddressTransactions(address: string) {
  return axios.get<TransactionResults>(api + `/v1/address/${address}/transactions`);
}

async function getTxDetails(txid: string) {
  return axios.get<Transaction | MempoolTransaction>(api + `/v1/tx/${txid}`);
}

export const Api = {
  getAddressBalance,
  getAddressTransactions,
  getTxDetails,
};
