import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from './styles';

import AchievementHeader from './components/AchievementHeader';
import OverviewSection from './components/OverviewSection';
import AchievementSummaryCard from './components/AchievementSummaryCard';
import AchievementTabBar from './components/AchievementTabBar';
import SearchFilterBar from './components/SearchFilterBar';
import AchievementCategoryCard from './components/AchievementCategoryCard';
import StudentRankingCard from './components/StudentRankingCard';
import CertificateCard from './components/CertificateCard';
import { CATEGORIES, CERTIFICATES, STUDENTS, SUMMARY_DATA } from './data';

export default function AchievementScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0066cc" />

      <AchievementHeader
        title="Thành tích & chứng nhận"
        notificationCount={12}
      />
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Tổng quan</Text>
        <View style={styles.summaryContainer}>
          {SUMMARY_DATA.map((item) => (
            <AchievementSummaryCard key={item.id} {...item} />
          ))}
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Tab & Search */}
        <AchievementTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <SearchFilterBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Danh sách thành tích nổi bật */}
        <OverviewSection title="Thành tích nổi bật" hasSeeAll>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementList}
          >
            {CATEGORIES.map((cat) => (
              <AchievementCategoryCard key={cat.id} {...cat} />
            ))}
          </ScrollView>
        </OverviewSection>

        {/* Bảng xếp hạng Học viên tiêu biểu */}
        <OverviewSection title="Học viên tiêu biểu" hasSeeAll>
          <View style={styles.rankingContainer}>
            {STUDENTS.map((student, index) => (
              <View key={student.id}>
                <StudentRankingCard
                  rank={student.rank}
                  name={student.name}
                  className={student.class}
                  score={student.score}
                  tags={student.tags}
                  avatar={student.avatar}
                />
                {index < STUDENTS.length - 1 && (
                  <View style={styles.rankingDivider} />
                )}
              </View>
            ))}
          </View>
        </OverviewSection>

        {/* Danh sách chứng nhận mới nhất */}
        <OverviewSection title="Chứng nhận mới nhất" hasSeeAll>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.certificateList}
          >
            {CERTIFICATES.map((cert) => (
              <CertificateCard key={cert.id} {...cert} />
            ))}
          </ScrollView>
        </OverviewSection>
        <View style={styles.overviewNotice}>
          <Icon source="information" size={20} color="#0066cc" />
          <Text style={styles.overviewNoticeText}>
            Ghi nhận sự cố gắng và tiến bộ của học viên trong học tập.
          </Text>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={styles.overviewNoticeLink}>Xem hướng dẫn</Text>
            <Icon source="chevron-right" size={14} color="#0066cc" />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}
