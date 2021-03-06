import React from 'react';
import { Flex, FlexProps } from '@stacks/ui';

export const OnboardingFooter: React.FC<FlexProps> = ({ children, ...props }) => {
  return (
    <Flex flex={1} flexDirection="column" justifyContent="flex-end" {...props}>
      {children}
    </Flex>
  );
};
