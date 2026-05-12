import { useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors } from '../../../shared/theme/colors'
import { CreateKeyModal, type CreateKeyFormValues } from '../components/create-key-modal'
import { KeyMappingCard } from '../components/key-mapping-card'
import { useKeys } from '../hooks/use-keys'

const initialFormValues: CreateKeyFormValues = {
  name: '',
  degreeChords: {
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
  },
}

export function KeysPage() {
  const { keys, loading, error, createKey } = useKeys()
  const [searchTerm, setSearchTerm] = useState('')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [createSubmitting, setCreateSubmitting] = useState(false)
  const [createValidationError, setCreateValidationError] = useState<string | null>(null)
  const [createValues, setCreateValues] = useState<CreateKeyFormValues>(initialFormValues)

  const filteredKeys = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    if (!normalized) return keys

    return keys.filter((item) => {
      const degreeValues = Object.values(item.degree_chords ?? {}).join(' ').toLowerCase()
      const searchableText = `${item.name} ${degreeValues}`.toLowerCase()
      return searchableText.includes(normalized)
    })
  }, [keys, searchTerm])

  const openCreateModal = () => {
    setCreateModalVisible(true)
    setCreateValidationError(null)
  }

  const closeCreateModal = () => {
    if (createSubmitting) return
    setCreateModalVisible(false)
    setCreateValidationError(null)
    setCreateValues(initialFormValues)
  }

  const updateDegree = (degree: string, value: string) => {
    setCreateValues((current) => ({
      ...current,
      degreeChords: {
        ...current.degreeChords,
        [degree]: value,
      },
    }))
  }

  const submitCreate = async () => {
    setCreateSubmitting(true)
    setCreateValidationError(null)

    try {
      await createKey({
        name: createValues.name,
        degreeChords: createValues.degreeChords,
      })
      closeCreateModal()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to create key mapping'
      setCreateValidationError(message)
    } finally {
      setCreateSubmitting(false)
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Keys</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Add key mapping" hitSlop={8} onPress={openCreateModal}>
            <Text style={styles.searchIcon}>＋</Text>
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            accessibilityLabel="Search key definitions"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Search key definitions..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Key Mappings</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.textPrimary} />
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.listWrap}>
          {filteredKeys.map((item) => (
            <KeyMappingCard key={item.id} item={{ id: item.id, name: item.name, degreeChords: item.degree_chords ?? {} }} />
          ))}
        </View>

        {!loading && !error && filteredKeys.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No keys found</Text>
            <Text style={styles.emptyText}>Try another search term or create a new key mapping.</Text>
          </View>
        ) : null}

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>Define keys here to automatically translate numbers like “1” or “4” into chords during live sets.</Text>
        </View>
      </ScrollView>

      <CreateKeyModal
        visible={createModalVisible}
        values={createValues}
        submitting={createSubmitting}
        validationError={createValidationError}
        onChangeName={(value) => setCreateValues((current) => ({ ...current, name: value }))}
        onChangeDegreeChord={updateDegree}
        onSubmit={submitCreate}
        onClose={closeCreateModal}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 110 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.textPrimary, fontFamily: 'Inter_800ExtraBold', fontSize: 30 },
  searchIcon: { color: colors.textSecondary, fontFamily: 'Inter_700Bold', fontSize: 20 },
  searchWrap: { marginTop: 12 },
  searchInput: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.textPrimary, fontFamily: 'Inter_600SemiBold', fontSize: 14, paddingHorizontal: 14, paddingVertical: 12 },
  sectionHeader: { marginTop: 16, marginBottom: 10 },
  sectionTitle: { color: colors.textSecondary, fontFamily: 'Inter_700Bold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  loadingWrap: { paddingVertical: 14 },
  errorText: { color: colors.danger, fontFamily: 'Inter_600SemiBold', fontSize: 13, marginBottom: 10 },
  listWrap: { gap: 12 },
  emptyWrap: { borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 20 },
  emptyTitle: { color: colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 16, marginBottom: 4 },
  emptyText: { color: colors.textSecondary, fontFamily: 'Inter_500Medium', fontSize: 13, textAlign: 'center' },
  tipBox: { marginTop: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 12 },
  tipText: { color: colors.textMuted, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
})
