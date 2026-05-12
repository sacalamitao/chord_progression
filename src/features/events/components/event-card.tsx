import { Pressable, StyleSheet, Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../../shared/theme/colors'

export type EventCardViewModel = {
  id: string
  title: string
  subtitle: string
  venue?: string
  dateLabel: string
  timeLabel: string
  songsCount?: number
  accentColor: string
  manageable?: boolean
}

type EventCardProps = {
  event: EventCardViewModel
  onPress?: () => void
}

export function EventCard({ event, onPress }: EventCardProps) {
  const [dateDay, dateNumber = ''] = event.dateLabel.split(' ')

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeDay}>{dateDay}</Text>
          <Text style={styles.dateBadgeNumber}>{dateNumber.replace(',', '') || '—'}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
            <View style={styles.songsPill}>
              <MaterialCommunityIcons name="music-note-outline" size={11} color="#B9BFDA" />
              <Text style={styles.songsPillText}>{event.songsCount ?? 0} Songs</Text>
            </View>
          </View>

          <View style={styles.metaLine}>
            <MaterialCommunityIcons name="map-marker-outline" size={12} color="#949AB4" />
            <Text style={styles.metaText} numberOfLines={1}>{event.venue ?? event.subtitle}</Text>
          </View>

          <View style={styles.metaLine}>
            <MaterialCommunityIcons name="clock-outline" size={12} color="#949AB4" />
            <Text style={styles.metaText}>{event.timeLabel}</Text>
          </View>
        </View>

        <MaterialCommunityIcons name="chevron-right" size={18} color="#737A98" style={styles.chevron} />

      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { minHeight: 98, borderRadius: 14, backgroundColor: '#161A2B', borderWidth: 1, borderColor: '#2B3046', overflow: 'visible', paddingHorizontal: 10, paddingVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  dateBadge: { width: 44, height: 56, borderRadius: 10, backgroundColor: '#2A1F57', alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: '#3B2D7A' },
  dateBadgeDay: { color: '#756DB8', fontSize: 10, fontFamily: 'Inter_700Bold', lineHeight: 12, marginBottom: 3, textTransform: 'uppercase' },
  dateBadgeNumber: { color: '#A48BFF', fontSize: 21, fontFamily: 'Inter_800ExtraBold', lineHeight: 23 },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { color: '#ECEFFD', fontFamily: 'Inter_700Bold', fontSize: 14, lineHeight: 17, flex: 1 },
  songsPill: { borderRadius: 999, backgroundColor: '#242A40', borderWidth: 1, borderColor: '#313955', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 3 },
  songsPillText: { color: '#B9BFDA', fontFamily: 'Inter_700Bold', fontSize: 10, lineHeight: 12 },
  metaLine: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: '#8E95B4', fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 14 },
  chevron: { marginLeft: 8 },
})
