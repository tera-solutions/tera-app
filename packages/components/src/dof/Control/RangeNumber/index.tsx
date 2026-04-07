import { messageValidate } from '@tera/commons/constants/message';
import { FormTeraItem } from '@tera/components/dof/FormTera';
import { FormTeraItemProps } from '@tera/components/dof/FormTera/FormTeraItem';
import { useTeraForm } from '@tera/components/dof/FormTera/TeraFormContext';
import customTwMerge, { tw } from 'tailwind-merge.config';
import { InputNumberProps } from 'tera-dls';
import InputNumber from '../InputNumber';
import { useCallback, useEffect } from 'react';
import _ from 'lodash';
interface IProps {
  startFormName: string;
  endFormName: string;
  startFormItemProps?: FormTeraItemProps;
  endFormItemProps?: FormTeraItemProps;
  startInputProps?: InputNumberProps;
  endInputProps?: InputNumberProps;
  wrapperClassName?: string;
  startRuleMessageError?: string;
  endRuleMessageError?: string;
  startMaxNumberRuleProps?: any;
  endMinNumberRuleProps?: any;
}
const RangeNumber = (props: IProps) => {
  const {
    startFormName = 'start',
    endFormName = 'end',
    startFormItemProps = {},
    endFormItemProps = {},
    startInputProps = {},
    endInputProps = {},
    wrapperClassName,
    startRuleMessageError,
    endRuleMessageError,
    startMaxNumberRuleProps = {},
    endMinNumberRuleProps = {},
  } = props;
  const { form } = useTeraForm();

  const { rules: startRules = [], ...restStartFormItemProps } =
    startFormItemProps;
  const { rules: endRules = [], ...restEndFormItemProps } = endFormItemProps;

  const startFormNameWatching = form?.watch(startFormName);
  const endFormNameWatching = form?.watch(endFormName);

  const triggerAll = useCallback(
    _.debounce((startData, endData) => {
      if (startData && endData && form) {
        form?.trigger(startFormName);
        form?.trigger(endFormName);
      }
    }, 100),
    [form],
  );

  useEffect(() => {
    triggerAll(startFormNameWatching, endFormNameWatching);
  }, [startFormNameWatching, endFormNameWatching, triggerAll]);

  return (
    <div className={tw(customTwMerge('flex gap-2.5', wrapperClassName))}>
      <FormTeraItem
        name={startFormName}
        rules={[
          {
            maxNumber: {
              key: endFormName,
              message: startRuleMessageError ?? messageValidate.from_Number,
              ...startMaxNumberRuleProps,
            },
          },
          ...startRules,
        ]}
        {...restStartFormItemProps}
      >
        <InputNumber placeholder="Vui lòng nhập" {...startInputProps} />
      </FormTeraItem>
      <FormTeraItem
        name={endFormName}
        rules={[
          {
            minNumber: {
              key: startFormName,
              message: endRuleMessageError ?? messageValidate.to_number,
              ...endMinNumberRuleProps,
            },
          },
          ...endRules,
        ]}
        {...restEndFormItemProps}
      >
        <InputNumber placeholder="Vui lòng nhập" {...endInputProps} />
      </FormTeraItem>
    </div>
  );
};

export default RangeNumber;
