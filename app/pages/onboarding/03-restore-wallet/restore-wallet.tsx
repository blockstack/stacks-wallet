import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { deriveRootKeychainFromMnemonic } from '@blockstack/keychain';
import { Text, Input } from '@blockstack/ui';

import routes from '../../../constants/routes.json';
import { Hr } from '../../../components/hr';
import { ErrorLabel } from '../../../components/error-label';
import { ErrorText } from '../../../components/error-text';
import { persistMnemonic } from '../../../store/keys/keys.actions';
import { safeAwait } from '../../../utils/safe-await';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
  OnboardingFooter,
  OnboardingFooterLink,
  OnboardingBackButton,
} from '../../../components/onboarding';

export const RestoreWallet: React.FC = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleMnemonicInput = (e: React.FormEvent<HTMLInputElement>) => {
    setMnemonic(e.currentTarget.value.trim());
  };

  const handleSecretKeyRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mnemonic.split(' ').length !== 24) {
      setError('The Stacks Wallet can only be used with a 24-word Secret Key');
      return;
    }
    const [error] = await safeAwait(deriveRootKeychainFromMnemonic(mnemonic));
    if (error) {
      setError('Not a valid bip39 mnemonic');
      return;
    }
    dispatch(persistMnemonic(mnemonic));
    history.push(routes.SET_PASSWORD);
  };

  return (
    <Onboarding as="form" onSubmit={handleSecretKeyRestore}>
      <OnboardingTitle>Restore your wallet</OnboardingTitle>
      <OnboardingBackButton onClick={() => history.push(routes.WELCOME)} />
      <OnboardingText>
        Restore your wallet by connecting your Ledger hardware wallet or a by entering your Secret
        Key
      </OnboardingText>
      <OnboardingButton mt="extra-loose">Continue with Ledger</OnboardingButton>

      <Hr my="extra-loose" />

      <Text textStyle="body.small.medium">Secret Key</Text>
      <Input
        onChange={handleMnemonicInput}
        as="textarea"
        mt="base-tight"
        minHeight="88px"
        placeholder="24-word Secret Key"
        style={{ resize: 'none' }}
      />
      {error && (
        <ErrorLabel>
          <ErrorText>{error}</ErrorText>
        </ErrorLabel>
      )}
      <OnboardingButton mt="loose" type="submit" mode="secondary">
        Continue with Secret Key
      </OnboardingButton>
      <OnboardingFooter>
        <OnboardingFooterLink>I have a Trezor wallet</OnboardingFooterLink>
      </OnboardingFooter>
    </Onboarding>
  );
};
