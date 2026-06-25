'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

// ----- Types mirroring the backend GET /api/user/confirmation-settings -----
type RuleValue = boolean | null
type TriState = 'default' | 'always' | 'never'

interface ActionOption { value: string; label: string }
interface ToolInfo { name: string; label: string; category: string; shipped_default: boolean }
interface ServiceInfo { key: string; label: string; tools: ToolInfo[] }
interface Descriptor {
  key: string
  title: string
  describe: string
  word: { label: string; default: string; min_len: number; max_len: number; pattern: string }
  actions: ActionOption[]
  loosen_requires_confirm_for: string[]
}
interface ConfigPayload {
  descriptor: Descriptor
  default_word: string
  services: ServiceInfo[]
  current: { word: string | null; rules: Record<string, RuleValue> }
}

// A rule that's present+true => always; present+false => never; absent => default.
function triFromRule(v: RuleValue | undefined): TriState {
  if (v === true) return 'always'
  if (v === false) return 'never'
  return 'default'
}
function ruleFromTri(t: TriState): RuleValue {
  if (t === 'always') return true
  if (t === 'never') return false
  return null // null => clear override on the backend
}

function TriToggle({
  value,
  onChange,
  disabled,
}: {
  value: TriState
  onChange: (t: TriState) => void
  disabled?: boolean
}) {
  const opts: { t: TriState; label: string }[] = [
    { t: 'default', label: 'Default' },
    { t: 'always', label: 'Always confirm' },
    { t: 'never', label: 'Never confirm' },
  ]
  return (
    <div className="inline-flex rounded-md border border-border overflow-hidden text-xs">
      {opts.map((o) => (
        <button
          key={o.t}
          type="button"
          disabled={disabled}
          onClick={() => onChange(o.t)}
          className={
            'px-2.5 py-1 transition-colors disabled:opacity-50 ' +
            (value === o.t
              ? o.t === 'never'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:bg-muted')
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function ConfirmationSettingsClient() {
  const [config, setConfig] = useState<ConfigPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [wordInput, setWordInput] = useState('')
  const [openServices, setOpenServices] = useState<Record<string, boolean>>({})
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [toolQuery, setToolQuery] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/confirmation-settings', { cache: 'no-store' })
      if (!res.ok) throw new Error((await res.json())?.detail || 'Failed to load')
      const data: ConfigPayload = await res.json()
      setConfig(data)
      setWordInput(data.current.word || data.default_word)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const rules = config?.current.rules ?? {}

  // Persist a partial update and refresh local state from the response.
  const save = useCallback(
    async (body: { word?: string; rules?: Record<string, RuleValue> }, key: string) => {
      setSavingKey(key)
      try {
        const res = await fetch('/api/user/confirmation-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.detail || 'Failed to save')
        setConfig((prev) => (prev ? { ...prev, current: data.current } : prev))
        toast.success('Saved')
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to save')
        // reload to resync UI with server truth on failure
        load()
      } finally {
        setSavingKey(null)
      }
    },
    [load],
  )

  const setRule = useCallback(
    (ruleKey: string, tri: TriState, opts?: { destructive?: boolean }) => {
      if (opts?.destructive && tri === 'never') {
        const ok = window.confirm(
          'Turning off confirmation for a send/delete action means it can run without ' +
            'asking you first. Are you sure?',
        )
        if (!ok) return
      }
      save({ rules: { [ruleKey]: ruleFromTri(tri) } }, ruleKey)
    },
    [save],
  )

  const saveWord = useCallback(() => {
    const w = wordInput.trim().toLowerCase()
    if (!w) return
    save({ word: w }, 'word')
  }, [wordInput, save])

  const allTools = useMemo(() => {
    if (!config) return []
    return config.services.flatMap((s) =>
      s.tools.map((t) => ({ ...t, serviceKey: s.key, serviceLabel: s.label })),
    )
  }, [config])

  const filteredTools = useMemo(() => {
    const q = toolQuery.trim().toLowerCase()
    if (!q) return allTools
    return allTools.filter(
      (t) => t.name.toLowerCase().includes(q) || t.serviceLabel.toLowerCase().includes(q),
    )
  }, [allTools, toolQuery])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    )
  }
  if (!config) return null

  const destructiveActions = new Set(config.descriptor.loosen_requires_confirm_for)

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{config.descriptor.title}</h1>
        <p className="text-muted-foreground">{config.descriptor.describe}</p>
      </div>

      {/* Confirmation word */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-1">Confirmation word</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Your message must include this word to run a confirmation-gated action. Default is
          “{config.default_word}”.
        </p>
        <div className="flex items-center gap-3">
          <Input
            value={wordInput}
            maxLength={config.descriptor.word.max_len}
            onChange={(e) => setWordInput(e.target.value)}
            className="max-w-xs"
            placeholder={config.default_word}
          />
          <Button onClick={saveWord} disabled={savingKey === 'word'}>
            {savingKey === 'word' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
          </Button>
        </div>
      </div>

      {/* By action type — the primary lever */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-1">By action type</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Applies across every service. More specific settings below override these.
        </p>
        <div className="space-y-3">
          {config.descriptor.actions.map((a) => {
            const key = `action:${a.value}`
            return (
              <div key={key} className="flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">{a.label}</span>
                <TriToggle
                  value={triFromRule(rules[key])}
                  disabled={savingKey === key}
                  onChange={(t) =>
                    setRule(key, t, { destructive: destructiveActions.has(a.value) })
                  }
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* By service */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-1">By service</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Overrides the action-type setting for a specific service.
        </p>
        <div className="divide-y divide-border">
          {config.services.map((s) => {
            const key = `service:${s.key}`
            const isOpen = openServices[s.key]
            return (
              <div key={s.key} className="py-2">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-foreground"
                    onClick={() => setOpenServices((p) => ({ ...p, [s.key]: !p[s.key] }))}
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {s.label}
                    <span className="text-muted-foreground">({s.tools.length})</span>
                  </button>
                  <TriToggle
                    value={triFromRule(rules[key])}
                    disabled={savingKey === key}
                    onChange={(t) => setRule(key, t)}
                  />
                </div>
                {isOpen && (
                  <div className="mt-2 ml-5 space-y-2">
                    {s.tools.map((t) => {
                      const tkey = `tool:${t.name}`
                      return (
                        <div key={t.name} className="flex items-center justify-between gap-4">
                          <span className="text-xs text-muted-foreground">
                            {t.label}{' '}
                            <span className="opacity-60">· {t.category}</span>
                          </span>
                          <TriToggle
                            value={triFromRule(rules[tkey])}
                            disabled={savingKey === tkey}
                            onChange={(tr) =>
                              setRule(tkey, tr, {
                                destructive: destructiveActions.has(t.category),
                              })
                            }
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Advanced — per tool search */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <button
          type="button"
          className="flex items-center gap-1 text-lg font-semibold text-foreground"
          onClick={() => setAdvancedOpen((v) => !v)}
        >
          {advancedOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          Advanced — per tool
        </button>
        {advancedOpen && (
          <div className="mt-4">
            <div className="relative max-w-sm mb-3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={toolQuery}
                onChange={(e) => setToolQuery(e.target.value)}
                placeholder="Search tools…"
                className="pl-8"
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTools.map((t) => {
                const tkey = `tool:${t.name}`
                return (
                  <div key={t.name} className="flex items-center justify-between gap-4">
                    <span className="text-xs text-muted-foreground">
                      {t.serviceLabel} · {t.label}{' '}
                      <span className="opacity-60">· {t.category}</span>
                    </span>
                    <TriToggle
                      value={triFromRule(rules[tkey])}
                      disabled={savingKey === tkey}
                      onChange={(tr) =>
                        setRule(tkey, tr, { destructive: destructiveActions.has(t.category) })
                      }
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
