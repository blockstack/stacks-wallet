import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Input } from '@blockstack/ui';

import { Onboarding, OnboardingTitle, OnboardingButton } from '../../components/onboarding';
import { ErrorLabel } from '../../components/error-label';
import { ErrorText } from '../../components/error-text';
import { decryptWallet, selectKeysSlice } from '../../store/keys';

export const SignIn: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  // const [password, setPassword] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>('980aa096dd224bd69685583b363de2be');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const keysState = useSelector(selectKeysSlice);

  const handlePasswordInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pass = e.currentTarget.value;
    setPassword(pass);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (!password) return;
    dispatch(decryptWallet({ password, history }));
  };

  return (
    <Onboarding as="form" onSubmit={handleSubmit}>
      <OnboardingTitle>Enter your password</OnboardingTitle>
      <Input autoFocus type="password" mt="extra-loose" onChange={handlePasswordInput} />
      {hasSubmitted && keysState.decryptionError && (
        <ErrorLabel>
          <ErrorText>Password entered is incorrect</ErrorText>
        </ErrorLabel>
      )}
      <OnboardingButton type="submit" mt="loose" isLoading={keysState.decrypting}>
        Continue
      </OnboardingButton>
    </Onboarding>
  );
};
