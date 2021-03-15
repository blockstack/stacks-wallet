import React, { FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, Button, Flex, Stack, Spinner, Text } from '@blockstack/ui';

import { LedgerConnectInstructions } from '@components/ledger/ledger-connect-instructions';
import { selectAddress } from '@store/keys';
import { RootState } from '@store/index';

import { AddressDisplayer } from './address-displayer';
import { SevereWarning } from '@components/severe-warning';
import { LedgerConnectStep, usePrepareLedger } from '@hooks/use-prepare-ledger';

export const RevealStxAddressLedger: FC = () => {
  const { step, isLocked } = usePrepareLedger();
  const [address, setAddress] = useState<null | string>(null);
  const [success, setSuccess] = useState(false);
  const [pendingLedgerAction, setPendingLedgerAction] = useState<'idle' | 'pending' | 'complete'>(
    'idle'
  );

  const { address: persistedAddress } = useSelector((state: RootState) => ({
    address: selectAddress(state),
  }));

  const stepToShow = success ? LedgerConnectStep.ActionComplete : step;

  const showAddress = persistedAddress === address && address !== null;

  const verifyAddress = useCallback(async () => {
    setPendingLedgerAction('pending');
    try {
      const fromDeviceAddr = await api.ledger.showStxAddress();
      if (fromDeviceAddr && fromDeviceAddr.address) {
        setSuccess(fromDeviceAddr.address === persistedAddress);
        setAddress(fromDeviceAddr.address);
      }
      await api.ledger.requestAndConfirmStxAddress();
      setPendingLedgerAction('complete');
    } catch (e) {}
  }, [persistedAddress]);

  return (
    <Flex
      flexDirection="column"
      alignItems={showAddress ? 'unset' : 'center'}
      mb="base-tight"
      mx="extra-loose"
    >
      {address ? (
        <AddressDisplayer address={address} />
      ) : (
        <Flex flexDirection="column" mx="extra-loose" width="320px">
          <Stack spacing="base-loose">
            <Box>
              <LedgerConnectInstructions
                action="Verify address"
                step={stepToShow}
                isLocked={isLocked}
              />
            </Box>
            <Button
              mode="secondary"
              mx="extra-loose"
              isDisabled={
                step < LedgerConnectStep.ConnectedAppOpen ||
                pendingLedgerAction === 'pending' ||
                isLocked
              }
              isLoading={pendingLedgerAction === 'pending'}
              onClick={verifyAddress}
            >
              Request Ledger address
            </Button>
            <Box>
              {address !== null && address !== persistedAddress && (
                <SevereWarning mt="tight" mb="base" pr="base-loose">
                  The addresses do not match. Make sure you're using the same Ledger device with
                  which you created this wallet.
                </SevereWarning>
              )}
            </Box>
          </Stack>
        </Flex>
      )}
      <Box>
        {pendingLedgerAction === 'pending' && address && (
          <Flex mb="base">
            <Box>
              <Spinner color="ink.600" size="xs" />
            </Box>
            <Text textStyle="caption" color="ink.600" ml="tight" mt="extra-tight">
              Compare the address above to the one on the screen of your Ledger device, then select
              Approve.
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
