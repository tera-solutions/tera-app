import React, { useMemo, useState } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { Icon, IconButton, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { styles } from './styles';
import { DEFAULT_PRICING, STEP_LABELS } from './constants';
import type { EnrollmentClassroom, EnrollmentDraftStudent, EnrollmentPricing } from './types';
import WizardStepsBar from './components/WizardStepsBar';
import StepSelectClass from './components/StepSelectClass';
import StepPricing from './components/StepPricing';
import StepStudents from './components/StepStudents';
import StepConfirm from './components/StepConfirm';

export default function EnrollmentScreen() {
  const router = useRouter();
  const { classId } = useLocalSearchParams<{ classId?: string }>();

  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<EnrollmentClassroom | null>(null);
  const [pricing, setPricing] = useState<EnrollmentPricing>(DEFAULT_PRICING);
  const [students, setStudents] = useState<EnrollmentDraftStudent[]>([]);

  const completedSteps = useMemo(
    () => Array.from({ length: Math.max(maxStep - 1, 0) }, (_, i) => i + 1),
    [maxStep],
  );

  const advance = (target: number) => {
    setMaxStep((prev) => Math.max(prev, target));
    setStep(target);
  };
  const goToStep = (target: number) => {
    if (target <= maxStep) setStep(target);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerBackground}>
        <View style={styles.headerTopRow}>
          <IconButton
            icon={({ size, color }) => <Icon source="chevron-left" size={size} color={color} />}
            iconColor="#FFF"
            size={28}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Ghi danh học viên</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <WizardStepsBar
          steps={STEP_LABELS}
          currentStep={step}
          completedSteps={completedSteps}
          onStepPress={goToStep}
        />

        {step === 1 && (
          <StepSelectClass
            selectedClass={selectedClass}
            initialClassId={classId ? Number(classId) : undefined}
            onNext={(classroom) => {
              setSelectedClass(classroom);
              advance(2);
            }}
          />
        )}

        {step === 2 && (
          <StepPricing
            values={pricing}
            onBack={() => setStep(1)}
            onNext={(values) => {
              setPricing(values);
              advance(3);
            }}
          />
        )}

        {step === 3 && (
          <StepStudents
            classroomName={selectedClass?.name ?? ''}
            students={students}
            onChange={setStudents}
            onBack={() => setStep(2)}
            onNext={() => advance(4)}
          />
        )}

        {step === 4 && selectedClass && (
          <StepConfirm
            classroom={selectedClass}
            pricing={pricing}
            students={students}
            onBack={() => setStep(3)}
          />
        )}
      </ScrollView>
    </View>
  );
}
