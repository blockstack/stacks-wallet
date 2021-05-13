import React, { FC } from 'react';
import { BigNumber } from 'bignumber.js';
import dayjs from 'dayjs';

import { Box, Flex, FlexProps, Text } from '@stacks/ui';

import { Hr } from '@components/hr';

import { parseNumericalFormInput } from '@utils/form/parse-numerical-form-input';
import { stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';
import {
  StackingInfoCard,
  StackingInfoCardLabel as Label,
  StackingInfoCardRow as Row,
  StackingInfoCardGroup as Group,
  StackingInfoCardValue as Value,
  StackingInfoCardSection as Section,
} from '../../components/stacking-info-card';
import { calculateStackingBuffer } from '../../utils/calc-stacking-buffer';
import { useSelector } from 'react-redux';
import { selectPoxInfo } from '@store/stacking';
import { useCalculateFee } from '@hooks/use-calculate-fee';
import { STACKING_CONTRACT_CALL_FEE } from '@constants/index';
import { truncateMiddle } from '@utils/tx-utils';

interface StackingInfoCardProps extends FlexProps {
  cycles: number;
  duration: string;
  startDate: Date;
  blocksPerCycle: number;
  btcAddress: string;
  amount: number | string | null;
}

export const DirectStackingInfoCard: FC<StackingInfoCardProps> = props => {
  const { cycles, duration, amount, btcAddress, blocksPerCycle, startDate, ...rest } = props;

  const calcFee = useCalculateFee();
  const poxInfo = useSelector(selectPoxInfo);

  const amountToBeStacked = new BigNumber(
    stxToMicroStx(parseNumericalFormInput(amount))
  ).integerValue();

  const buffer = calculateStackingBuffer(
    amountToBeStacked,
    new BigNumber(poxInfo?.min_amount_ustx || 0)
  );

  return (
    <StackingInfoCard minHeight="84px" {...rest}>
      <Box mx={['loose', 'extra-loose']}>
        <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
          <Text textStyle="body.large.medium">You'll lock</Text>
          <Text
            fontSize="24px"
            mt="extra-tight"
            fontWeight={500}
            fontFamily="Open Sauce"
            letterSpacing="-0.02em"
          >
            {toHumanReadableStx(amountToBeStacked.toString())}
          </Text>
        </Flex>
        <Hr />
        <Group width="100%" mt="base-loose" mb="extra-loose">
          <Section>
            <Row>
              <Label explainer="This is the estimated number of reward slots you'll get. Be aware the minimum can change before the next cycle begins.">
                Reward slot
              </Label>
              <Value>xxx</Value>
            </Row>

            <Row>
              <Label>Buffer</Label>
              <Value>
                {buffer.isEqualTo(0) ? 'No buffer' : toHumanReadableStx(buffer.toString())}
              </Value>
            </Row>
          </Section>

          <Section>
            <Row>
              <Label
                explainer={`One cycle lasts ${blocksPerCycle} blocks on the Bitcoin blockchain`}
              >
                Cycles
              </Label>
              <Value>{cycles}</Value>
            </Row>

            <Row>
              <Label>Start date</Label>
              <Value>{dayjs(startDate).format('MMMM DD')}</Value>
            </Row>

            <Row>
              <Label explainer="The duration is an estimation that varies depending on the Bitcoin block time">
                Duration
              </Label>
              <Value>~{duration}</Value>
            </Row>
          </Section>

          <Section>
            <Row>
              <Label>Bitcoin address</Label>
              <Value>{btcAddress ? truncateMiddle(btcAddress) : '—'}</Value>
            </Row>
          </Section>

          <Section>
            <Row>
              <Label>Fee</Label>
              <Value>{toHumanReadableStx(calcFee(STACKING_CONTRACT_CALL_FEE).toString())}</Value>
            </Row>
          </Section>
        </Group>
      </Box>
    </StackingInfoCard>
  );
};
