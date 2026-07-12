import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import AsyncPickerField from '@components/common/AsyncPickerField';

import { CourseService, ClassRoomService, LessonService, LevelService } from '@tera/modules/education';

import { styles } from '../styles';
import type { AssignmentCreateForm, PickerOption } from '../types';

interface ScopeSectionProps {
  form: UseFormReturn<AssignmentCreateForm>;
}

const courseToOption = (course: any): PickerOption => ({ value: course.id, label: course.name });
const classToOption = (classRoom: any): PickerOption => ({ value: classRoom.id, label: classRoom.name });
const levelToOption = (level: any): PickerOption => ({ value: level.id, label: level.level_name });
const lessonToOption = (lesson: any): PickerOption => ({
  value: lesson.id,
  label: lesson.lesson_no ? `Buổi ${lesson.lesson_no} - ${lesson.lesson_title}` : lesson.lesson_title,
});

const ScopeSection = ({ form }: ScopeSectionProps) => {
  const { control, watch, setValue } = form;
  const classRoomId = watch('class_room_id');

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="target" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Phạm vi áp dụng</Text>
      </View>
      <Text style={styles.hintText}>
        Không bắt buộc — bỏ trống để bài tập chỉ ở trạng thái nháp, chưa gán cho lớp nào.
      </Text>

      <View style={[styles.fieldGroup, { marginTop: 12 }]}>
        <Text style={styles.fieldLabel}>Khóa học</Text>
        <Controller
          control={control}
          name="course_id"
          render={({ field: { onChange, value } }) => (
            <AsyncPickerField
              title="Chọn khóa học"
              placeholder="Chọn khóa học"
              value={value}
              valueLabel={watch('course_name')}
              useList={CourseService.useCourseList}
              toOption={courseToOption}
              onSelect={(option) => {
                onChange(Number(option.value));
                setValue('course_name', option.label);
              }}
            />
          )}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Lớp áp dụng</Text>
        <Controller
          control={control}
          name="class_room_id"
          render={({ field: { onChange, value } }) => (
            <AsyncPickerField
              title="Chọn lớp học"
              placeholder="Chọn lớp học"
              value={value}
              valueLabel={watch('class_room_name')}
              useList={ClassRoomService.useClassRoomList}
              toOption={classToOption}
              onSelect={(option) => {
                onChange(Number(option.value));
                setValue('class_room_name', option.label);
                // Lesson scope no longer valid once the class changes.
                setValue('lesson_id', null);
                setValue('lesson_name', '');
              }}
            />
          )}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Bài học</Text>
        <Controller
          control={control}
          name="lesson_id"
          render={({ field: { onChange, value } }) => (
            <AsyncPickerField
              title="Chọn bài học"
              placeholder={classRoomId ? 'Chọn bài học' : 'Chọn lớp trước'}
              disabled={!classRoomId}
              value={value}
              valueLabel={watch('lesson_name')}
              useList={LessonService.useLessonList}
              toOption={lessonToOption}
              filters={classRoomId ? { class_room_id: classRoomId } : undefined}
              onSelect={(option) => {
                onChange(Number(option.value));
                setValue('lesson_name', option.label);
              }}
            />
          )}
        />
      </View>

      <View>
        <Text style={styles.fieldLabel}>Hạng thứ</Text>
        <Controller
          control={control}
          name="level_id"
          render={({ field: { onChange, value } }) => (
            <AsyncPickerField
              title="Chọn hạng thứ"
              placeholder="Chọn hạng thứ"
              value={value}
              valueLabel={watch('level_name')}
              useList={LevelService.useLevelList}
              toOption={levelToOption}
              onSelect={(option) => {
                onChange(Number(option.value));
                setValue('level_name', option.label);
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

export default ScopeSection;
