import { ClassScheduleItem } from './components/ClassScheduleCard';

export const MORNING_CLASSES: ClassScheduleItem[] = [
  {
    id: '1',
    className: 'Starters 2A',
    lessonName: 'Unit 5 - My Toys',
    room: 'Phòng 201 - Tầng 2',
    startTime: '08:00',
    endTime: '09:30',
    studentCount: 18,
    totalStudents: 18,
    status: 'completed',
  },
  {
    id: '2',
    className: 'Movers 1A',
    lessonName: 'Reading & Vocabulary',
    room: 'Phòng 203 - Tầng 2',
    startTime: '09:45',
    endTime: '11:15',
    studentCount: 15,
    totalStudents: 18,
    status: 'upcoming',
  },
];

export const AFTERNOON_CLASSES: ClassScheduleItem[] = [
  {
    id: '3',
    className: 'Flyers 2B',
    lessonName: 'Speaking Practice',
    room: 'Phòng 301 - Tầng 3',
    startTime: '14:00',
    endTime: '15:30',
    studentCount: 20,
    totalStudents: 20,
    status: 'upcoming',
  },
];

export const EVENING_CLASSES: ClassScheduleItem[] = [
  {
    id: '4',
    className: 'KET 1A',
    lessonName: 'Grammar & Writing',
    room: 'Phòng 401 - Tầng 4',
    startTime: '18:00',
    endTime: '19:30',
    studentCount: 16,
    totalStudents: 18,
    status: 'upcoming',
  },
];
