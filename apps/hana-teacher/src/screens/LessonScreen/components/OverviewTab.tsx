import React from 'react';
import { StatsSummary } from './StatsSummary';
import { LessonObjectives } from './LessonObjectives';
import { MaterialList } from './MaterialList';
import { ActivityList } from './ActivityList';
import { LessonStats } from '../types';

interface Props {
  stats: LessonStats;
}

export const OverviewTab = ({ stats }: Props) => (
  <>
    <StatsSummary stats={stats} />
    <LessonObjectives />
    <MaterialList />
    <ActivityList />
  </>
);
