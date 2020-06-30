import React from 'react';
import { useStore } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import routes from './constants/routes.json';
import { Home } from './pages/home/home';
import { selectKeysSlice } from './store/keys/keys.reducer';
import { SignIn } from './pages/sign-in/sign-in';
import {
  Welcome,
  CreateWallet,
  RestoreWallet,
  GeneratingSecret,
  SecretKey,
  SaveKey,
  VerifyKey,
  SetPassword,
} from './pages/onboarding';

export const routerConfig = [
  {
    path: routes.HOME,
    component: Home,
  },
  {
    path: routes.SIGN_IN,
    component: SignIn,
  },
  {
    path: routes.WELCOME,
    component: Welcome,
  },
  {
    path: routes.CREATE,
    component: CreateWallet,
  },
  {
    path: routes.RESTORE,
    component: RestoreWallet,
  },
  {
    path: routes.GENERATING,
    component: GeneratingSecret,
  },
  {
    path: routes.SECRET_KEY,
    component: SecretKey,
  },
  {
    path: routes.SAVE_KEY,
    component: SaveKey,
  },
  {
    path: routes.VERIFY_KEY,
    component: VerifyKey,
  },
  {
    path: routes.SET_PASSWORD,
    component: SetPassword,
  },
  {
    path: routes.SET_PASSWORD,
    component: SetPassword,
  },
];

const getAppStartingRoute = (salt?: string) => (!!salt ? routes.SIGN_IN : routes.WELCOME);

export function Routes() {
  // `useStore` required as we only want the value on initial render
  const store = useStore();
  const { salt } = selectKeysSlice(store.getState());
  return (
    <>
      <Switch>
        {routerConfig.map((route, i) => (
          <Route key={i} exact {...route} />
        ))}
      </Switch>
      <Redirect exact from="/" to={getAppStartingRoute(salt)} />
    </>
  );
}
