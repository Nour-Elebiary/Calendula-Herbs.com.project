'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Settings, Phone, Globe, Mail, MapPin, Clock, Code,
  Plus, Trash2, Pencil, Check, X, Loader2, AlertCircle,
  ToggleLeft, ToggleRight, GripVertical, Save, Eye, EyeOff,
  HelpCircle, ChevronUp, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

type Plugin = {
  id: string
  name: string
  code: string
  position: 'HEAD' | 'BODY_END' | 'FOOTER_FIXED' | 'CHAT_WIDGET'
  isActive: boolean
  order: number
}

type ContactSettings = {
  managingEmails: string[]
  mapAddress: string | null
  mapLat: number | null
  mapLng: number | null
  phones: string[]
  publicEmails: string[]
  businessHours: string | null
  autoReplySubject: string | null
  autoReplyMessage: string | null
  formEnabled: boolean
}

const POSITION_LABELS: Record<string, string> = {
  HEAD: 'Head (Analytics, Fonts)',
  BODY_END: 'Body End (Scripts)',
  FOOTER_FIXED: 'Footer Fixed (Widgets)',
  CHAT_WIDGET: 'Chat Widget',
}

const GENERAL_KEYS = [
  { key: 'site_name', label: 'Site Name', placeholder: 'Calendula Herbs' },
  { key: 'site_tagline', label: 'Tagline', placeholder: 'Premium Organic Herbs Exporter' },
  { key: 'meta_description', label: 'Default Meta Description', placeholder: 'SEO description...', multiline: true },
  { key: 'company_founded', label: 'Founded Year', placeholder: '2005' },
  { key: 'social_linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/...' },
  { key: 'social_facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
  { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
  { key: 'social_twitter', label: 'Twitter / X URL', placeholder: 'https://x.com/...' },
  { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+1234567890' },
  { key: 'primary_color', label: 'Primary Color (CSS)', placeholder: '#2d7a3a' },
]

// ─── Tab: General Settings ────────────────────────────────────────────────────

function GeneralTab() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { setValues(d.settings || {}); setLoading(false) })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (res.ok) toast.success('Settings saved')
      else toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-neutral-800 flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" /> General Information
        </h2>
        {GENERAL_KEYS.map(({ key, label, placeholder, multiline }) => (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={`setting-${key}`}>{label}</Label>
            {multiline ? (
              <Textarea
                id={`setting-${key}`}
                rows={3}
                placeholder={placeholder}
                value={values[key] || ''}
                onChange={e => setValues(prev => ({ ...prev, [key]: e.target.value }))}
              />
            ) : (
              <Input
                id={`setting-${key}`}
                placeholder={placeholder}
                value={values[key] || ''}
                onChange={e => setValues(prev => ({ ...prev, [key]: e.target.value }))}
              />
            )}
          </div>
        ))}
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Save General Settings
      </Button>
    </div>
  )
}

// ─── Tab: Contact Settings ────────────────────────────────────────────────────

function ContactTab() {
  const [data, setData] = useState<ContactSettings>({
    managingEmails: [],
    mapAddress: '',
    mapLat: null,
    mapLng: null,
    phones: [],
    publicEmails: [],
    businessHours: '',
    autoReplySubject: '',
    autoReplyMessage: '',
    formEnabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newPhone, setNewPhone] = useState('')
  const [newPublicEmail, setNewPublicEmail] = useState('')
  const [newManagingEmail, setNewManagingEmail] = useState('')

  useEffect(() => {
    fetch('/api/admin/contact-settings')
      .then(r => r.json())
      .then(d => {
        if (d.contact) setData(d.contact)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/contact-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) toast.success('Contact settings saved')
      else toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const addToList = (key: keyof ContactSettings, val: string, setter: (v: string) => void) => {
    if (!val.trim()) return
    setData(prev => ({ ...prev, [key]: [...(prev[key] as string[]), val.trim()] }))
    setter('')
  }
  const removeFromList = (key: keyof ContactSettings, idx: number) => {
    setData(prev => ({ ...prev, [key]: (prev[key] as string[]).filter((_, i) => i !== idx) }))
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Managing (internal) emails */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-neutral-800 flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" /> Managing Emails
          <span className="text-xs text-neutral-400 font-normal ml-1">(receive form submissions)</span>
        </h2>
        <div className="flex gap-2">
          <Input
            placeholder="admin@company.com"
            value={newManagingEmail}
            onChange={e => setNewManagingEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addToList('managingEmails', newManagingEmail, setNewManagingEmail)}
          />
          <Button size="sm" onClick={() => addToList('managingEmails', newManagingEmail, setNewManagingEmail)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.managingEmails.map((em, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1 pr-1">
              {em}
              <button onClick={() => removeFromList('managingEmails', i)} className="ml-1 hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Public contact info */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-neutral-800 flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" /> Public Contact Info
        </h2>
        {/* Phones */}
        <div className="space-y-2">
          <Label>Phone Numbers</Label>
          <div className="flex gap-2">
            <Input
              placeholder="+1 234 567 890"
              value={newPhone}
              onChange={e => setNewPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addToList('phones', newPhone, setNewPhone)}
            />
            <Button size="sm" onClick={() => addToList('phones', newPhone, setNewPhone)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.phones.map((ph, i) => (
              <Badge key={i} variant="secondary" className="flex items-center gap-1 pr-1">
                {ph}
                <button onClick={() => removeFromList('phones', i)} className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        {/* Public Emails */}
        <div className="space-y-2">
          <Label>Public Emails</Label>
          <div className="flex gap-2">
            <Input
              placeholder="info@company.com"
              value={newPublicEmail}
              onChange={e => setNewPublicEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addToList('publicEmails', newPublicEmail, setNewPublicEmail)}
            />
            <Button size="sm" onClick={() => addToList('publicEmails', newPublicEmail, setNewPublicEmail)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.publicEmails.map((em, i) => (
              <Badge key={i} variant="secondary" className="flex items-center gap-1 pr-1">
                {em}
                <button onClick={() => removeFromList('publicEmails', i)} className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Map & Business Hours */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-neutral-800 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> Location & Hours
        </h2>
        <div className="space-y-1.5">
          <Label htmlFor="map-address">Map Address</Label>
          <Input
            id="map-address"
            placeholder="123 Herb Street, Morocco"
            value={data.mapAddress || ''}
            onChange={e => setData(prev => ({ ...prev, mapAddress: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="map-lat">Latitude</Label>
            <Input
              id="map-lat"
              type="number"
              step="any"
              placeholder="31.7917"
              value={data.mapLat ?? ''}
              onChange={e => setData(prev => ({ ...prev, mapLat: e.target.value ? parseFloat(e.target.value) : null }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="map-lng">Longitude</Label>
            <Input
              id="map-lng"
              type="number"
              step="any"
              placeholder="-7.0926"
              value={data.mapLng ?? ''}
              onChange={e => setData(prev => ({ ...prev, mapLng: e.target.value ? parseFloat(e.target.value) : null }))}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="biz-hours">Business Hours (JSON)</Label>
          <Textarea
            id="biz-hours"
            rows={4}
            className="font-mono text-sm"
            placeholder={'{"Mon-Fri": "9:00 AM – 6:00 PM", "Sat": "10:00 AM – 2:00 PM"}'}
            value={data.businessHours || ''}
            onChange={e => setData(prev => ({ ...prev, businessHours: e.target.value }))}
          />
        </div>
      </div>

      {/* Auto-reply */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-neutral-800 flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" /> Auto-Reply Email
        </h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="form-enabled" className="cursor-pointer">
            <span className="font-medium">Contact Form Enabled</span>
            <p className="text-xs text-neutral-400 mt-0.5">Allow visitors to submit the contact form</p>
          </Label>
          <Switch
            id="form-enabled"
            checked={data.formEnabled}
            onCheckedChange={v => setData(prev => ({ ...prev, formEnabled: v }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="auto-subject">Auto-Reply Subject</Label>
          <Input
            id="auto-subject"
            placeholder="Thank you for contacting Calendula Herbs"
            value={data.autoReplySubject || ''}
            onChange={e => setData(prev => ({ ...prev, autoReplySubject: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="auto-message">Auto-Reply Message</Label>
          <Textarea
            id="auto-message"
            rows={5}
            placeholder="Dear {name}, thank you for reaching out..."
            value={data.autoReplyMessage || ''}
            onChange={e => setData(prev => ({ ...prev, autoReplyMessage: e.target.value }))}
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Save Contact Settings
      </Button>
    </div>
  )
}

// ─── Tab: Plugins ─────────────────────────────────────────────────────────────

function PluginsTab() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPlugin, setEditingPlugin] = useState<Plugin | null>(null)

  // Form state
  const [formName, setFormName] = useState('')
  const [formCode, setFormCode] = useState('')
  const [formPosition, setFormPosition] = useState<Plugin['position']>('HEAD')
  const [formSaving, setFormSaving] = useState(false)

  const fetchPlugins = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/plugins')
    const data = await res.json()
    setPlugins(data.plugins || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchPlugins() }, [fetchPlugins])

  const openCreate = () => {
    setEditingPlugin(null)
    setFormName('')
    setFormCode('')
    setFormPosition('HEAD')
    setShowForm(true)
  }

  const openEdit = (p: Plugin) => {
    setEditingPlugin(p)
    setFormName(p.name)
    setFormCode(p.code)
    setFormPosition(p.position)
    setShowForm(true)
  }

  const handleSubmit = async () => {
    if (!formName.trim() || !formCode.trim()) {
      toast.error('Name and code are required')
      return
    }
    setFormSaving(true)
    try {
      if (editingPlugin) {
        const res = await fetch(`/api/admin/plugins/${editingPlugin.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formName, code: formCode, position: formPosition }),
        })
        if (res.ok) { toast.success('Plugin updated'); setShowForm(false); fetchPlugins() }
        else toast.error('Failed to update')
      } else {
        const res = await fetch('/api/admin/plugins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formName, code: formCode, position: formPosition }),
        })
        if (res.ok) { toast.success('Plugin created'); setShowForm(false); fetchPlugins() }
        else toast.error('Failed to create')
      }
    } finally {
      setFormSaving(false)
    }
  }

  const handleToggle = async (p: Plugin) => {
    await fetch(`/api/admin/plugins/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !p.isActive }),
    })
    fetchPlugins()
  }

  const handleDelete = async (p: Plugin) => {
    if (!confirm(`Delete plugin "${p.name}"?`)) return
    const res = await fetch(`/api/admin/plugins/${p.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Plugin deleted'); fetchPlugins() }
    else toast.error('Failed to delete')
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">Inject HTML/JavaScript code into specific page locations.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Plugin
        </Button>
      </div>

      {/* Warning */}
      <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
        <span>Only activate plugins from trusted sources. Malicious code can compromise your site.</span>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-neutral-800">{editingPlugin ? 'Edit Plugin' : 'New Plugin'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="plugin-name">Plugin Name *</Label>
              <Input id="plugin-name" placeholder="e.g. Google Analytics" value={formName} onChange={e => setFormName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="plugin-pos">Position *</Label>
              <Select value={formPosition} onValueChange={v => setFormPosition(v as Plugin['position'])}>
                <SelectTrigger id="plugin-pos"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(POSITION_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plugin-code">HTML / Script Code *</Label>
            <Textarea
              id="plugin-code"
              rows={8}
              className="font-mono text-xs"
              placeholder={'<script>\n  // your code here\n</script>'}
              value={formCode}
              onChange={e => setFormCode(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={formSaving}>
              {formSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
              {editingPlugin ? 'Update' : 'Create'}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Plugin list */}
      {plugins.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <Code className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No plugins yet. Add your first script embed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plugins.map(p => (
            <div key={p.id} className={`bg-white border rounded-xl p-4 flex items-start gap-4 ${!p.isActive ? 'opacity-60' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-neutral-900">{p.name}</span>
                  <Badge variant="secondary" className="text-xs">{POSITION_LABELS[p.position]}</Badge>
                  {p.isActive ? (
                    <Badge className="text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Inactive</Badge>
                  )}
                </div>
                <pre className="text-xs text-neutral-400 mt-2 truncate max-w-md font-mono">{p.code.slice(0, 80)}{p.code.length > 80 ? '…' : ''}</pre>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="sm" variant="ghost" onClick={() => handleToggle(p)} title={p.isActive ? 'Deactivate' : 'Activate'}>
                  {p.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(p)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Tab: FAQ Editor ───────────────────────────────────────────────────────────

function FaqTab() {
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        const raw = d.settings?.faqs
        if (raw) try { setFaqs(JSON.parse(raw)) } catch {}
        setLoading(false)
      })
  }, [])

  const addFaq = () => setFaqs(prev => [...prev, { question: '', answer: '' }])
  const removeFaq = (idx: number) => setFaqs(prev => prev.filter((_, i) => i !== idx))
  const updateFaq = (idx: number, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => prev.map((f, i) => i === idx ? { ...f, [field]: value } : f))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqs: JSON.stringify(faqs) }),
      })
      if (res.ok) toast.success('FAQ saved')
      else toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const moveUp = (idx: number) => {
    if (idx === 0) return
    setFaqs(prev => { const a = [...prev]; [a[idx-1], a[idx]] = [a[idx], a[idx-1]]; return a })
  }
  const moveDown = (idx: number) => {
    if (idx === faqs.length - 1) return
    setFaqs(prev => { const a = [...prev]; [a[idx], a[idx+1]] = [a[idx+1], a[idx]]; return a })
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">Manage FAQ questions and answers shown on the /faq page.</p>
        <Button onClick={addFaq}><Plus className="h-4 w-4 mr-2" /> Add Question</Button>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 border rounded-xl">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No FAQ items yet. Click "Add Question" to start.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">#{i + 1}</Badge>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => moveUp(i)} disabled={i === 0} title="Move up">
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => moveDown(i)} disabled={i === faqs.length - 1} title="Move down">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeFaq(i)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`faq-q-${i}`}>Question</Label>
                <Input id={`faq-q-${i}`} value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)} placeholder="e.g. What is your minimum order quantity?" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`faq-a-${i}`}>Answer</Label>
                <Textarea id={`faq-a-${i}`} rows={3} value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} placeholder="Write the answer here..." />
              </div>
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Save FAQ
      </Button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabId = 'general' | 'contact' | 'plugins' | 'faq'

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'plugins', label: 'Plugins', icon: Code },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Site Settings</h1>
        <p className="text-sm text-white/50 mt-1">Configure your website&apos;s global settings</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-gold text-gold'
                : 'border-transparent text-white/40 hover:text-white/60 hover:border-white/20'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'general' && <GeneralTab />}
      {activeTab === 'contact' && <ContactTab />}
      {activeTab === 'plugins' && <PluginsTab />}
      {activeTab === 'faq' && <FaqTab />}
    </div>
  )
}
