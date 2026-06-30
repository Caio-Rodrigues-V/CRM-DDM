import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'

export async function GET() {
  try {
    const supabase = await createClient()
    const admin = supabaseAdmin()

    // 1. Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated in browser session' }, { status: 401 })
    }

    // 2. Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    // 3. Count tables using admin (bypassing RLS)
    const { count: contactsCount } = await admin.from('contacts').select('*', { count: 'exact', head: true })
    const { count: convsCount } = await admin.from('conversations').select('*', { count: 'exact', head: true })
    const { count: msgsCount } = await admin.from('messages').select('*', { count: 'exact', head: true })
    const { count: configCount } = await admin.from('whatsapp_config').select('*', { count: 'exact', head: true })

    // 4. Fetch the configs and first few conversations
    const { data: configs } = await admin.from('whatsapp_config').select('*')
    const { data: conversations } = await admin.from('conversations').select('*')
    const { data: contacts } = await admin.from('contacts').select('*')

    return NextResponse.json({
      auth: {
        userId: user.id,
        email: user.email,
        profileAccountId: profile?.account_id,
        profileRole: profile?.account_role
      },
      counts: {
        contacts: contactsCount,
        conversations: convsCount,
        messages: msgsCount,
        whatsapp_config: configCount
      },
      configs: configs || [],
      conversations: conversations || [],
      contacts: contacts || []
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
