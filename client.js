window.__ModuleLoader__.load({
  id: '@local/agent-habits',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'agent-habits'
    const BRIDGE = '/api/agent-habits'

    const ZH = {
      meta: {
        title: 'AI 习性',
        description: '用分档滑块调汇报节奏、沟通方式与执行方式，让 AI 按你的习惯工作。',
      },
      'settings.title': 'AI 习性',
      'intro': '点击档位即保存；设置全局生效，下一轮对话开始起作用。',
      'stale': '宿主插件仍是旧版，滑块改动暂不生效。请完全退出 DSH（含托盘）再打开。',
      'enabled.label': '启用习性调整',
      'enabled.hint': '关闭后不再注入规则，也不做播报或停顿提醒。',
      'group.rhythm': '汇报节奏',
      'group.comm': '沟通方式',
      'group.exec': '执行方式',
      'report.label': '播报密度',
      'report.0': '极少',
      'report.1': '少',
      'report.2': '适中',
      'report.3': '多',
      'report.4': '很多',
      'report.desc.0': '不主动播报，只在停顿或阶段结束时说明。',
      'report.desc.1': '每约 30 分钟播报一次。',
      'report.desc.2': '每约 10 分钟播报一次。',
      'report.desc.3': '每约 5 分钟播报一次。',
      'report.desc.4': '每约 2 分钟播报一次。',
      'pause.label': '停顿频率',
      'pause.0': '不停',
      'pause.1': '少',
      'pause.2': '适中',
      'pause.3': '多',
      'pause.4': '频繁',
      'pause.desc.0': '不设定时停顿；开始重要任务前仍会按「确认时机」停下。',
      'pause.desc.1': '每约 30 分钟停一次。',
      'pause.desc.2': '每约 10 分钟停一次。',
      'pause.desc.3': '每约 5 分钟停一次。',
      'pause.desc.4': '每约 2 分钟停一次。',
      'key.label': '确认时机',
      'key.0': '关',
      'key.1': '只提示',
      'key.2': '任务前确认',
      'key.desc.0': '不做关键节点提醒。',
      'key.desc.1': '重要任务开始前提示一句，然后继续。',
      'key.desc.2': '开始重要任务前（多步改动、改文件、装东西、对外发布、不可逆操作）停下说明计划，等确认再动手，不弹提问框。',
      'ask.label': '提问风格',
      'ask.0': '不问',
      'ask.1': '关键处停',
      'ask.2': '多提问',
      'ask.desc.0': '信息不足时按最合理的假设推进，并说明假设。',
      'ask.desc.1': '只在会影响结果时停下说明，尽量不弹提问框。',
      'ask.desc.2': '不确定时主动提问，一次问清并给可选项。',
      'detail.label': '回答详略',
      'detail.0': '结论优先',
      'detail.1': '适中',
      'detail.2': '详细',
      'detail.desc.0': '先给结果和下一步，背景能省则省。',
      'detail.desc.1': '结论、关键依据、风险各点到为止。',
      'detail.desc.2': '给出依据、权衡与替代方案。',
      'think.label': '思考深度',
      'think.0': '先动手',
      'think.1': '平衡',
      'think.2': '先想清楚',
      'think.desc.0': '优先小步执行、快速拿到可见结果。',
      'think.desc.1': '能小步验证就动手，高风险操作先想清楚。',
      'think.desc.2': '动手前先梳理步骤、依赖与风险。',
      'pace.label': '执行节奏',
      'pace.0': '小步验证',
      'pace.1': '平衡',
      'pace.2': '批量执行',
      'pace.desc.0': '每次改动后立即验证，再做下一步。',
      'pace.desc.1': '相关操作可合并，保留中间验证点。',
      'pace.desc.2': '合并同类低风险操作，减少打断，最后统一验证。',
      'reset': '恢复默认',
      'saving': '保存中…',
      'saved': '已保存',
      'failed': '保存失败',
      'loading': '读取中…',
      'current': '当前：',
    }

    const EN = {
      meta: {
        title: 'Agent Habits',
        description: 'Stepped sliders for reporting rhythm, communication and execution style.',
      },
      'settings.title': 'Agent Habits',
      'intro': 'Click a stop to save; applies globally from the next turn.',
      'stale': 'The host half is still the old version; slider changes take effect only after fully quitting and reopening DSH.',
      'enabled.label': 'Enable habit tuning',
      'enabled.hint': 'When off, no rules are injected and no report or pause checks run.',
      'group.rhythm': 'Reporting rhythm',
      'group.comm': 'Communication',
      'group.exec': 'Execution',
      'report.label': 'Report density',
      'report.0': 'Rare',
      'report.1': 'Low',
      'report.2': 'Medium',
      'report.3': 'High',
      'report.4': 'Very high',
      'report.desc.0': 'No proactive reports; explain at pauses or milestones.',
      'report.desc.1': 'About every 30 minutes.',
      'report.desc.2': 'About every 10 minutes.',
      'report.desc.3': 'About every 5 minutes.',
      'report.desc.4': 'About every 2 minutes.',
      'pause.label': 'Pause frequency',
      'pause.0': 'None',
      'pause.1': 'Low',
      'pause.2': 'Medium',
      'pause.3': 'High',
      'pause.4': 'Frequent',
      'pause.desc.0': 'No timed pauses; important-task confirmation still applies.',
      'pause.desc.1': 'About every 30 minutes.',
      'pause.desc.2': 'About every 10 minutes.',
      'pause.desc.3': 'About every 5 minutes.',
      'pause.desc.4': 'About every 2 minutes.',
      'key.label': 'Confirmation timing',
      'key.0': 'Off',
      'key.1': 'Mention',
      'key.2': 'Confirm first',
      'key.desc.0': 'No key-node reminders.',
      'key.desc.1': 'Name the important task in one line, then continue.',
      'key.desc.2': 'Before starting an important task (multi-step changes, file edits, installs, publishing, irreversible work), stop with a short plan and wait for confirmation; no question box.',
      'ask.label': 'Asking style',
      'ask.0': 'Do not ask',
      'ask.1': 'Stop when critical',
      'ask.2': 'Ask often',
      'ask.desc.0': 'Proceed on the most reasonable assumption and state it.',
      'ask.desc.1': 'Stop and explain when it affects the result; avoid question boxes.',
      'ask.desc.2': 'Ask when unsure, once, with options.',
      'detail.label': 'Answer detail',
      'detail.0': 'Conclusion first',
      'detail.1': 'Balanced',
      'detail.2': 'Detailed',
      'detail.desc.0': 'Give the result and next step; skip background.',
      'detail.desc.1': 'Conclusion, key evidence, risks, briefly.',
      'detail.desc.2': 'Include evidence, tradeoffs and fallbacks.',
      'think.label': 'Thinking depth',
      'think.0': 'Act first',
      'think.1': 'Balanced',
      'think.2': 'Think first',
      'think.desc.0': 'Prefer small steps and visible results.',
      'think.desc.1': 'Act when small steps can verify; think first for risky work.',
      'think.desc.2': 'Plan steps, dependencies and risks before acting.',
      'pace.label': 'Execution pace',
      'pace.0': 'Small steps',
      'pace.1': 'Balanced',
      'pace.2': 'Batch',
      'pace.desc.0': 'Verify after each change.',
      'pace.desc.1': 'Merge related work, keep checkpoints.',
      'pace.desc.2': 'Merge low-risk work, reduce interruptions, verify at the end.',
      'reset': 'Restore defaults',
      'saving': 'Saving…',
      'saved': 'Saved',
      'failed': 'Save failed',
      'loading': 'Loading…',
      'current': 'Current: ',
    }

    const CSS = `
.ah-root { display: flex; flex-direction: column; gap: 16px; padding: 4px 0 32px; }
.ah-intro { margin: 0; font-size: 13px; line-height: 1.7; color: var(--dsw-alias-label-secondary); }
.ah-warn { margin: 0; font-size: 12.5px; line-height: 1.6; padding: 8px 10px; border-radius: 8px; color: var(--dsw-alias-state-warning-primary, #9a6b16); background: color-mix(in srgb, var(--dsw-alias-state-warning-primary, #9a6b16) 12%, transparent); }
.ah-group { display: flex; flex-direction: column; gap: 8px; }
.ah-group-title { margin: 6px 0 0; font-size: 12px; font-weight: 700; letter-spacing: .08em; color: var(--dsw-alias-label-secondary); text-transform: uppercase; }
.ah-card { display: flex; flex-direction: column; gap: 18px; padding: 16px 18px; border-radius: 10px; background: var(--dsw-alias-bg-layer-1); border: 0.5px solid var(--dsw-alias-border-l1); }
.ah-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.ah-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.ah-label { font-size: 14px; font-weight: 600; color: var(--dsw-alias-label-primary); }
.ah-hint { margin: 0; font-size: 12.5px; line-height: 1.65; color: var(--dsw-alias-label-secondary); }
.ah-toggle { width: 38px; height: 22px; border-radius: 999px; padding: 2px; flex: none; cursor: pointer; border: none; background: var(--dsw-alias-border-l1); display: inline-flex; align-items: center; }
.ah-toggle[aria-checked="true"] { background: var(--dsw-alias-brand-primary, #4f8ef7); justify-content: flex-end; }
.ah-knob { width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.2); }
.ah-toggle:disabled { opacity: .45; cursor: default; }
.ah-level { display: flex; flex-direction: column; gap: 2px; }
.ah-level-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.ah-current { flex: none; font-size: 12px; font-weight: 600; padding: 3px 9px; border-radius: 999px; color: var(--dsw-alias-brand-primary, #4f8ef7); background: color-mix(in srgb, var(--dsw-alias-brand-primary, #4f8ef7) 12%, transparent); }
.ah-range { -webkit-appearance: none; appearance: none; display: block; width: 100%; height: 24px; margin: 8px 0 2px; padding: 0; background: transparent; cursor: pointer; }
.ah-range:disabled { cursor: default; opacity: .55; }
.ah-range::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: linear-gradient(to right, var(--dsw-alias-brand-primary, #4f8ef7) 0%, var(--dsw-alias-brand-primary, #4f8ef7) var(--ah-pct), var(--dsw-alias-border-l1) var(--ah-pct), var(--dsw-alias-border-l1) 100%); }
.ah-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; margin-top: -5px; border-radius: 50%; background: #fff; border: 2px solid var(--dsw-alias-brand-primary, #4f8ef7); box-shadow: 0 1px 3px rgba(0,0,0,.2); }
.ah-range:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, #4f8ef7); outline-offset: 4px; border-radius: 999px; }
.ah-stop-labels { display: grid; gap: 2px; margin-top: 6px; }
.ah-stop-label { text-align: center; font-size: 12px; line-height: 1.4; color: var(--dsw-alias-label-secondary); cursor: pointer; padding: 2px 0; border-radius: 6px; }
.ah-stop-label:hover { color: var(--dsw-alias-label-primary); }
.ah-stop-label.on { color: var(--dsw-alias-label-primary); font-weight: 650; }
.ah-actions { display: flex; align-items: center; gap: 10px; }
.ah-btn { font: inherit; font-size: 13px; line-height: 1; padding: 8px 14px; border-radius: 8px; cursor: pointer; border: none; font-weight: 600; }
.ah-btn.ghost { background: transparent; color: var(--dsw-alias-label-secondary); }
.ah-status { font-size: 12px; color: var(--dsw-alias-label-tertiary); }
.ah-status.err { color: var(--dsw-alias-state-error-primary, #c4553f); }
`

    const LEVEL_MAX = {
      reportLevel: 4,
      pauseLevel: 4,
      keyNodeLevel: 2,
      thinkingLevel: 2,
      askLevel: 2,
      detailLevel: 2,
      toolPace: 2,
    }

    const CONFIG_DEFAULTS = {
      enabled: true,
      reportLevel: 2,
      pauseLevel: 0,
      keyNodeLevel: 2,
      thinkingLevel: 1,
      askLevel: 1,
      detailLevel: 1,
      toolPace: 1,
    }

    // 宿主还是旧版时，返回的配置里没有这些键；缺什么就沿用本地值，
    // 避免刚拖好的滑块被一次保存响应打回 0。
    function mergeConfig(prev, incoming) {
      const next = { ...CONFIG_DEFAULTS, ...(prev || {}) }
      if (incoming && typeof incoming === 'object') {
        if (typeof incoming.enabled === 'boolean') next.enabled = incoming.enabled
        for (const key of Object.keys(LEVEL_MAX)) {
          const value = Number(incoming[key])
          if (Number.isFinite(value)) next[key] = value
        }
      }
      return next
    }

    function Toggle({ checked, disabled, onChange, label }) {
      return h('button', {
        type: 'button', role: 'switch', 'aria-checked': checked ? 'true' : 'false',
        'aria-label': label, title: label, disabled: !!disabled,
        className: 'ah-toggle',
        onClick: () => onChange(!checked),
      }, h('span', { className: 'ah-knob' }))
    }

    function LevelSlider({ t, prefix, max, value, disabled, onCommit }) {
      const labels = Array.from({ length: max + 1 }, (_, i) => t(`${prefix}.${i}`))
      const [draft, setDraft] = React.useState(value)
      const draftRef = React.useRef(value)
      React.useEffect(() => {
        setDraft(value)
        draftRef.current = value
      }, [value])
      const current = Math.min(max, Math.max(0, Number.isFinite(draft) ? draft : 0))
      const pct = max === 0 ? 0 : (current / max) * 100
      const move = (next) => {
        const clamped = Math.min(max, Math.max(0, Math.trunc(next)))
        draftRef.current = clamped
        setDraft(clamped)
        return clamped
      }
      const commit = (next) => {
        const clamped = move(next)
        if (clamped !== value) onCommit(clamped)
      }
      const commitDraft = () => {
        if (draftRef.current !== value) onCommit(draftRef.current)
      }
      return h('div', { className: 'ah-level' }, [
        h('div', { key: 'head', className: 'ah-level-head' }, [
          h('span', { key: 'label', className: 'ah-label' }, t(`${prefix}.label`)),
          h('span', { key: 'current', className: 'ah-current' }, t(`${prefix}.${current}`)),
        ]),
        h('p', { key: 'desc', className: 'ah-hint' }, t(`${prefix}.desc.${current}`)),
        h('input', {
          key: 'range',
          type: 'range',
          className: 'ah-range',
          min: 0,
          max,
          step: 1,
          value: current,
          disabled: !!disabled,
          'aria-label': t(`${prefix}.label`),
          style: { '--ah-pct': `${pct}%` },
          onPointerDown: (event) => {
            try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* 忽略 */ }
          },
          onInput: (event) => move(Number(event.target.value)),
          onPointerUp: commitDraft,
          onPointerCancel: commitDraft,
          onKeyUp: (event) => {
            if (/^(Arrow|Home|End|Page)/.test(event.key)) commitDraft()
          },
          onBlur: commitDraft,
        }),
        h('div', {
          key: 'names',
          className: 'ah-stop-labels',
          style: { gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` },
        }, labels.map((text, index) => h('span', {
          key: index,
          className: 'ah-stop-label' + (index === current ? ' on' : ''),
          onClick: () => { if (!disabled) commit(index) },
        }, text))),
      ])
    }

    async function callBridge(body) {
      const res = await fetch(BRIDGE, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      let payload = null
      try { payload = await res.json() } catch { payload = null }
      if (!res.ok || !payload || payload.ok === false) {
        throw new Error((payload && payload.error) || `HTTP ${res.status}`)
      }
      return payload
    }

    function Page(props) {
      const t = typeof props.t === 'function' ? props.t : (key) => String(key)
      const [config, setConfig] = React.useState(null)
      const [status, setStatus] = React.useState('loading')
      const [error, setError] = React.useState('')
      const [staleHost, setStaleHost] = React.useState(false)

      React.useEffect(() => {
        let alive = true
        callBridge({ action: 'get' })
          .then((payload) => {
            if (!alive) return
            setConfig(mergeConfig(null, payload.config))
            setStaleHost(!(payload.config && 'reportLevel' in payload.config))
            setStatus('')
          })
          .catch((err) => {
            if (!alive) return
            setStatus('error')
            setError(String((err && err.message) || err))
          })
        return () => { alive = false }
      }, [])

      const save = React.useCallback(async (patch) => {
        setConfig((prev) => ({ ...mergeConfig(prev, null), ...patch }))
        setStatus('saving')
        try {
          const payload = await callBridge({ action: 'set', config: patch })
          setConfig((prev) => mergeConfig(prev, payload.config))
          setStaleHost(!(payload.config && 'reportLevel' in payload.config))
          setStatus('saved')
          setError('')
        } catch (err) {
          setStatus('error')
          setError(String((err && err.message) || err))
        }
      }, [])

      const reset = React.useCallback(async () => {
        setStatus('saving')
        try {
          const payload = await callBridge({ action: 'reset' })
          setConfig(mergeConfig(null, payload.config))
          setStaleHost(!(payload.config && 'reportLevel' in payload.config))
          setStatus('saved')
          setError('')
        } catch (err) {
          setStatus('error')
          setError(String((err && err.message) || err))
        }
      }, [])

      if (!config) {
        return h('div', { className: 'ah-root' }, [
          h('p', { key: 'intro', className: 'ah-intro' }, t('intro')),
          h('p', { key: 'loading', className: 'ah-intro' }, status === 'error' ? error : t('loading')),
        ])
      }

      const enabled = config.enabled
      const statusText = status === 'saving' ? t('saving') : status === 'saved' ? t('saved') : ''
      const level = (prefix, key) => {
        const raw = Number(config[key])
        const max = LEVEL_MAX[key]
        const value = Number.isFinite(raw) ? Math.min(max, Math.max(0, Math.round(raw))) : 0
        return h(LevelSlider, {
          key,
          t,
          prefix,
          max,
          value,
          disabled: !enabled,
          onCommit: (next) => save({ [key]: next }),
        })
      }

      return h('div', { className: 'ah-root' }, [
        h('p', { key: 'intro', className: 'ah-intro' }, t('intro')),
        staleHost ? h('p', { key: 'stale', className: 'ah-warn' }, t('stale')) : null,
        h('div', { key: 'master', className: 'ah-card' }, [
          h('div', { key: 'enabled', className: 'ah-toggle-row' }, [
            h('div', { key: 'text', className: 'ah-text' }, [
              h('span', { key: 'label', className: 'ah-label' }, t('enabled.label')),
              h('p', { key: 'hint', className: 'ah-hint' }, t('enabled.hint')),
            ]),
            h(Toggle, {
              key: 'toggle',
              checked: enabled,
              label: t('enabled.label'),
              onChange: (value) => save({ enabled: value }),
            }),
          ]),
        ]),
        h('div', { key: 'rhythm', className: 'ah-group' }, [
          h('p', { key: 'title', className: 'ah-group-title' }, t('group.rhythm')),
          h('div', { key: 'card', className: 'ah-card' }, [
            level('report', 'reportLevel'),
            level('pause', 'pauseLevel'),
            level('key', 'keyNodeLevel'),
          ]),
        ]),
        h('div', { key: 'comm', className: 'ah-group' }, [
          h('p', { key: 'title', className: 'ah-group-title' }, t('group.comm')),
          h('div', { key: 'card', className: 'ah-card' }, [
            level('ask', 'askLevel'),
            level('detail', 'detailLevel'),
          ]),
        ]),
        h('div', { key: 'exec', className: 'ah-group' }, [
          h('p', { key: 'title', className: 'ah-group-title' }, t('group.exec')),
          h('div', { key: 'card', className: 'ah-card' }, [
            level('think', 'thinkingLevel'),
            level('pace', 'toolPace'),
          ]),
        ]),
        h('div', { key: 'actions', className: 'ah-actions' }, [
          h('button', {
            key: 'reset',
            type: 'button',
            className: 'ah-btn ghost',
            disabled: status === 'saving',
            onClick: reset,
          }, t('reset')),
          statusText ? h('span', { key: 'status', className: 'ah-status' }, statusText) : null,
          status === 'error' ? h('span', { key: 'error', className: 'ah-status err' }, error) : null,
        ]),
      ])
    }

    function Icon(props) {
      const size = props && props.size ? props.size : 16
      return h('svg', {
        viewBox: '0 0 16 16',
        width: size,
        height: size,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.3,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
      }, [
        h('path', { key: 'arc', d: 'M2.7 11.2a5.8 5.8 0 1 1 10.6 0' }),
        h('path', { key: 'needle', d: 'M8 8.4l2.7-2.3' }),
        h('circle', { key: 'pivot', cx: 8, cy: 8.4, r: 1.05, fill: 'currentColor', stroke: 'none' }),
      ])
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'agent-habits:dictionaries')

        const style = document.createElement('style')
        style.id = 'agent-habits-style'
        style.textContent = CSS
        document.head.appendChild(style)
        ctx.effect(() => () => style.remove(), 'agent-habits:style')

        const t = ctx.locale.bind(NS)
        ctx.effect(() => ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'agent-habits',
          order: 45,
          label: () => t('settings.title'),
          locale: NS,
        }, Page)), 'agent-habits:settings section')

        ctx.effect(() => ctx.slots.inject('settings.section.icon', () => ctx.slots.register({
          name: 'settings.section.icon',
          id: 'agent-habits',
        }, Icon)), 'agent-habits:settings icon')
      },
    }
  },
})
