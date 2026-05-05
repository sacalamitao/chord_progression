import { StyleSheet, Text, View } from 'react-native'

const dateOptions = [
  { day: 'Mon', date: '12' },
  { day: 'Tue', date: '13' },
  { day: 'Wed', date: '14', active: true },
  { day: 'Thu', date: '15' },
  { day: 'Fri', date: '16' },
]

export function EventsDateSelector() {
  return (
    <View style={styles.container}>
      {dateOptions.map((item) => (
        <View key={`${item.day}-${item.date}`} style={[styles.dateChip, item.active && styles.activeDateChip]}>
          <Text style={[styles.dayText, item.active && styles.activeDayText]}>{item.day}</Text>
          <Text style={[styles.dateText, item.active && styles.activeDateText]}>{item.date}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 23 },
  dateChip: { width: 58, height: 78, borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#1F2937', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 18, elevation: 2 },
  activeDateChip: { backgroundColor: '#111111' },
  dayText: { color: '#8B8F96', fontSize: 12, fontWeight: '700', lineHeight: 15, marginBottom: 8 },
  activeDayText: { color: '#FFFFFF' },
  dateText: { color: '#171717', fontSize: 22, fontWeight: '900', lineHeight: 26 },
  activeDateText: { color: '#FFFFFF' },
})