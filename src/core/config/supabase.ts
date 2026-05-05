import 'react-native-url-polyfill/auto'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kfrysxezqsupuoydbamt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcnlzeGV6cXN1cHVveWRiYW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjE0ODgsImV4cCI6MjA5MzQzNzQ4OH0.cO8Um8Lk1RZtOxKL2W6F60apR6yaKpVdd9VqMaaNC-k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
})
