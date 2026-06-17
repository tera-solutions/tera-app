import { Image, View } from 'react-native';

import SubjectCard from './SubjectCard';
import { styles } from './style';

const DATA = [
	{
		title: 'Toán',
		color: '#3BA7FF',
		image: require('@tera/assets/app/element_45.png'),
	},
	{
		title: 'Tiếng Việt',
		color: '#FFD43B',
		image: require('@tera/assets/app/element_44.png'),
	},
	{
		title: 'Tiếng Anh',
		color: '#FFB74D',
		image: require('@tera/assets/app/element_37.png'),
	},
	{
		title: 'Khoa học',
		color: '#81D96B',
		image: require('@tera/assets/app/element_36.png'),
	},
	{
		title: 'Trò chơi',
		color: '#FF7EB6',
		image: require('@tera/assets/app/element_41.png'),
	},
	{
		title: 'Âm nhạc',
		color: '#A77DFF',
		image: require('@tera/assets/app/element_40.png'),
	},
	{
		title: 'Khám phá',
		color: '#4DD0E1',
		image: require('@tera/assets/app/element_35.png'),
	},
	{
		title: 'Thử thách',
		color: '#FF6B6B',
		image: require('@tera/assets/app/element_34.png'),
	},
];

export default function SubjectGrid() {
	return (
		<View style={styles.subjectGrid}>
			{DATA.map(item => (
				<SubjectCard
					key={item.title}
					title={item.title}
					color={item.color}
					image={item.image}
				/>
			))}
		</View>
	);
}