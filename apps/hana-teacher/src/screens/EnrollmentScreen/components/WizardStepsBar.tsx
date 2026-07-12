import React, { Fragment } from 'react';
import { View } from 'react-native';
import { Icon, Text, TouchableRipple } from 'react-native-paper';

import { styles } from '../styles';

interface WizardStepsBarProps {
  steps: string[];
  currentStep: number;
  completedSteps: number[];
  onStepPress: (step: number) => void;
}

const WizardStepsBar = ({ steps, currentStep, completedSteps, onStepPress }: WizardStepsBarProps) => (
  <View style={[styles.card, { paddingBottom: 8 }]}>
    <View style={styles.stepperRow}>
      {steps.map((label, index) => {
        const step = index + 1;
        const isDone = completedSteps.includes(step);
        const isActive = step === currentStep;
        const clickable = isDone || isActive;

        return (
          <Fragment key={label}>
            <TouchableRipple
              disabled={!clickable}
              onPress={() => onStepPress(step)}
              style={{ alignItems: 'center', width: 56 }}
            >
              <View style={{ alignItems: 'center' }}>
                <View
                  style={[
                    styles.stepDot,
                    isActive && styles.stepDotActive,
                    isDone && !isActive && styles.stepDotDone,
                  ]}
                >
                  {isDone && !isActive ? (
                    <Icon source="check" size={14} color="#16A34A" />
                  ) : (
                    <Text
                      style={[
                        styles.stepDotText,
                        isActive && styles.stepDotTextActive,
                        isDone && !isActive && styles.stepDotTextDone,
                      ]}
                    >
                      {step}
                    </Text>
                  )}
                </View>
                <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]} numberOfLines={1}>
                  {label}
                </Text>
              </View>
            </TouchableRipple>
            {index < steps.length - 1 && (
              <View style={[styles.stepConnector, isDone && styles.stepConnectorDone]} />
            )}
          </Fragment>
        );
      })}
    </View>
  </View>
);

export default WizardStepsBar;
