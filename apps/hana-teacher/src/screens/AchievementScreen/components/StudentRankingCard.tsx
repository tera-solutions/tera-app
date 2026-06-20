import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

interface Tag {
  text: string;
  color: string;
  bg: string;
}

interface StudentProps {
  rank: number;
  name: string;
  className: string;
  score: string;
  tags: Tag[];
  avatar: string;
}

export default function StudentRankingCard({
  rank,
  name,
  className,
  score,
  tags,
  avatar,
}: StudentProps) {
  const renderRankIcon = (rankNumber: number) => {
    if (rankNumber === 1)
      return (
        <View style={styles.rankingNumber}>
          <Icon source="medal" size={26} color="#FFD700" />
        </View>
      );
    if (rankNumber === 2)
      return (
        <View style={styles.rankingNumber}>
          <Icon source="medal" size={26} color="#C0C0C0" />
        </View>
      );
    if (rankNumber === 3)
      return (
        <View style={styles.rankingNumber}>
          <Icon source="medal" size={26} color="#CD7F32" />
        </View>
      );
    return (
      <Text style={[styles.rankingNumber, { color: '#64748B' }]}>
        {rankNumber}
      </Text>
    );
  };

  return (
    <TouchableOpacity style={styles.rankingItem} activeOpacity={0.7}>
      {renderRankIcon(rank)}
      <Image source={{ uri: avatar }} style={styles.rankingAvatar} />

      <View style={styles.rankingContent}>
        <Text style={styles.rankingName}>{name}</Text>
        <Text style={styles.rankingClass}>{className}</Text>

        <View style={styles.rankingTags}>
          {tags.map((tag, idx) => (
            <View
              key={idx}
              style={[styles.rankingTag, { backgroundColor: tag.bg }]}
            >
              <Text style={[styles.rankingTagText, { color: tag.color }]}>
                {tag.text}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.rankingScoreContainer}>
        <Text style={styles.rankingScore}>{score}</Text>
        <Text style={styles.rankingScoreLabel}>/10</Text>
      </View>
      <Icon source="chevron-right" size={20} color="#94A3B8" />
    </TouchableOpacity>
  );
}
