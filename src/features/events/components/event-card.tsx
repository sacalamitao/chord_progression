import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native'
import { colors } from '../../../shared/theme/colors'

export type EventCardViewModel = {
  id: string
  title: string
  subtitle: string
  dateLabel: string
  timeLabel: string
  accentColor: string
  manageable?: boolean
}

type EventCardProps = {
  event: EventCardViewModel
  onPress?: () => void
  actionsVisible: boolean
  onToggleActions: () => void
  onCloseActions: () => void
  onEdit: () => void
  onDelete: () => void
}

export function EventCard({ event, onPress, actionsVisible, onToggleActions, onCloseActions, onEdit, onDelete }: EventCardProps) {
  const [dateDay, dateNumber = ''] = event.dateLabel.split(' ')
  const stopPropagation = (event: GestureResponderEvent) => event.stopPropagation()

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.cardHeader, { backgroundColor: event.accentColor }]}> 
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeDay}>{dateDay}</Text>
          <Text style={styles.dateBadgeNumber}>{dateNumber.replace(',', '') || '—'}</Text>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.headerMeta}>{event.timeLabel}</Text>
        </View>

        {event.manageable ? (
          <View style={styles.actionsWrap}>
            {actionsVisible ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close event actions menu"
                style={styles.actionsBackdrop}
                onPress={(event) => {
                  stopPropagation(event)
                  onCloseActions()
                }}
              />
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open actions for ${event.title}`}
              hitSlop={10}
              style={styles.moreButton}
              onPress={(event) => {
                stopPropagation(event)
                onToggleActions()
              }}
            >
              <Text style={styles.moreIcon}>⋯</Text>
            </Pressable>

            {actionsVisible ? (
              <View style={styles.actionsMenu}>
                <Pressable
                  accessibilityRole="button"
                  style={styles.actionItem}
                  onPress={(event) => {
                    stopPropagation(event)
                    onEdit()
                  }}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </Pressable>
                <View style={styles.actionDivider} />
                <Pressable
                  accessibilityRole="button"
                  style={styles.actionItem}
                  onPress={(event) => {
                    stopPropagation(event)
                    onDelete()
                  }}
                >
                  <Text style={styles.deleteActionText}>Delete</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.subtitle}>{event.subtitle}</Text>

        <View style={styles.footerRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaIcon}>◷</Text>
            <Text style={styles.metaText}>{event.timeLabel}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusDot}>•</Text>
            <Text style={styles.statusText}>Scheduled</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { minHeight: 174, borderRadius: 30, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, overflow: 'visible', shadowColor: colors.shadow, shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.26, shadowRadius: 24, elevation: 5 },
  cardHeader: { minHeight: 96, borderTopLeftRadius: 30, borderTopRightRadius: 30, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  dateBadge: { width: 62, height: 68, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', marginRight: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.26)' },
  dateBadgeDay: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', lineHeight: 15, marginBottom: 5, opacity: 0.92 },
  dateBadgeNumber: { color: '#FFFFFF', fontSize: 25, fontWeight: '900', lineHeight: 29, letterSpacing: -0.8 },
  headerContent: { flex: 1 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', lineHeight: 25, letterSpacing: -0.35 },
  headerMeta: { color: 'rgba(255,255,255,0.84)', fontSize: 12, fontWeight: '800', lineHeight: 15, marginTop: 5 },
  body: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 17 },
  moreButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  moreIcon: { color: '#FFFFFF', fontSize: 27, lineHeight: 21, marginTop: -4 },
  actionsWrap: { position: 'relative' },
  actionsBackdrop: { position: 'absolute', top: -260, right: -24, bottom: -260, left: -360, zIndex: 8 },
  actionsMenu: { position: 'absolute', right: 0, top: 42, width: 126, borderRadius: 16, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, paddingVertical: 6, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 18, elevation: 8, zIndex: 10 },
  actionItem: { paddingHorizontal: 14, paddingVertical: 10 },
  actionText: { color: colors.textPrimary, fontSize: 14, fontWeight: '800' },
  deleteActionText: { color: colors.danger, fontSize: 14, fontWeight: '800' },
  actionDivider: { height: 1, backgroundColor: colors.border },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, fontWeight: '700' },
  footerRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 15 },
  metaPill: { borderRadius: 999, backgroundColor: colors.surfaceMuted, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, paddingVertical: 7 },
  metaIcon: { color: colors.textMuted, fontSize: 11, lineHeight: 13, marginRight: 5 },
  metaText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', lineHeight: 13 },
  statusPill: { borderRadius: 999, backgroundColor: 'rgba(29,185,84,0.16)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, paddingVertical: 7 },
  statusDot: { color: colors.accent, fontSize: 16, lineHeight: 13, marginRight: 4 },
  statusText: { color: colors.accent, fontSize: 11, fontWeight: '800', lineHeight: 13 },
})
