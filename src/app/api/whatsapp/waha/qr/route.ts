import { createClient } from '@/lib/supabase/server'
import { getWahaQrCode } from '@/lib/whatsapp/waha-api'
import { decrypt } from '@/lib/whatsapp/encryption'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!profile?.account_id) {
      return new Response('Forbidden', { status: 403 })
    }

    const { data: config, error: configError } = await supabase
      .from('whatsapp_config')
      .select('*')
      .eq('account_id', profile.account_id)
      .maybeSingle()

    if (configError || !config || config.provider !== 'waha') {
      return new Response('WAHA not configured', { status: 400 })
    }

    const wahaConfig = {
      waha_url: config.waha_url,
      waha_session: config.waha_session,
      waha_api_key: config.waha_api_key ? decrypt(config.waha_api_key) : null,
    }

    const wahaRes = await getWahaQrCode(wahaConfig)
    const contentType = wahaRes.headers.get('content-type') || 'image/png'
    const body = await wahaRes.arrayBuffer()

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (err: any) {
    console.error('[waha/qr] error:', err)
    return new Response(err.message || 'Internal server error', { status: 500 })
  }
}
