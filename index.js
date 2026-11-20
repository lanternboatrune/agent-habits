/**
 * agent-habits —— 调整 AI 的工作习性。
 *
 * 设置项都是分档滑块（0..N），宿主把档位翻译成系统提示规则，并按壁钟时间
 * 注入播报/停顿提醒。设置存在插件目录的 state.json，下一轮对话生效。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'agent-habits'

export const inject = ['systemPrompt']

const HERE = path.dirname(fileURLToPath(import.meta.url))
const STATE_FILE = path.join(HERE, 'state.json')
const SECTION_NAME = 'user:agent-habits'
const BRIDGE_PATH = '/api/agent-habits'
const MAX_BODY_BYTES = 64 * 1024

const DEFAULTS = Object.freeze({
  enabled: true,
  reportLevel: 2,
  pauseLevel: 0,
  keyNodeLevel: 2,
  thinkingLevel: 1,
  askLevel: 1,
  detailLevel: 1,
  toolPace: 1,
})

/** 档位 -> 分钟数；0 档表示“不设定时间隔”。 */
const REPORT_MINUTES = [0, 30, 10, 5, 2]
const PAUSE_MINUTES = [0, 30, 10, 5, 2]

const LEVEL_MAX = {
  reportLevel: 4,
  pauseLevel: 4,
  keyNodeLevel: 2,
  thinkingLevel: 2,
  askLevel: 2,
  detailLevel: 2,
  toolPace: 2,
}

function normalizeLevel(value, key) {
  const max = LEVEL_MAX[key]
  return Number.isFinite(value) ? Math.min(max, Math.max(0, Math.trunc(value))) : DEFAULTS[key]
}

function normalize(input) {
  const src = input && typeof input === 'object' ? input : {}
  const next = {
    enabled: typeof src.enabled === 'boolean' ? src.enabled : DEFAULTS.enabled,
  }
  for (const key of Object.keys(LEVEL_MAX)) {
    next[key] = normalizeLevel(src[key], key)
  }
  return next
}

function readState() {
  try {
    return normalize(JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')))
  } catch {
    return { ...DEFAULTS }
  }
}

function writeState(next) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(next, null, 2) + '\n', 'utf8')
  } catch {
    // 只读安装目录等场景：内存里仍然生效，下次启动回退到默认值。
  }
}

/** 把档位翻译成系统提示里的一段规则；关闭时返回空串（段落不占位）。 */
function buildRules(state) {
  if (!state.enabled) return ''
  const rules = []

  const reportMin = REPORT_MINUTES[state.reportLevel]
  if (reportMin > 0) {
    rules.push(
      `每过约 ${reportMin} 分钟至少发一条 1–3 句正文通报：刚做了什么、得到什么结论、下一步做什么。按实际花掉的时间估算，不要用推理步数。`,
    )
  } else {
    rules.push('不做定时播报；只在停顿点、阶段完成或切换方向时，用 1–3 句说明进展与下一步。')
  }

  const pauseMin = PAUSE_MINUTES[state.pauseLevel]
  if (pauseMin > 0) {
    rules.push(
      `每过约 ${pauseMin} 分钟停一次：用 1–3 句汇报当前进展与剩余工作，然后停住等用户回复。不要弹提问框、不要问「要不要继续」。`,
    )
  } else {
    rules.push('不设定时间隔停顿；只在关键节点或阶段完成时停。')
  }

  if (state.keyNodeLevel === 2) {
    rules.push(
      '在开始重要任务前必须停：先用 1–3 句说明准备做什么、影响范围与风险，然后停住等用户确认再动手。重要任务包括多步改动、会改文件/装东西/对外发布、不可逆操作、阶段完成或准备换方向。不要用提问框。',
    )
  } else if (state.keyNodeLevel === 1) {
    rules.push(
      '遇到重要任务或不可逆操作前，先用一句话说明要做什么和风险，然后继续，不必等回复。',
    )
  }

  if (state.thinkingLevel === 0) {
    rules.push('先动手：优先小步执行、快速拿到可见结果，减少长时间的纯内部规划。')
  } else if (state.thinkingLevel === 1) {
    rules.push('平衡：能靠一次工具调用或小步验证确认的事直接做；高风险、不可逆或信息不足时才先想清楚再动手。')
  } else {
    rules.push('先想清楚：动手前先梳理步骤、依赖与风险，再开始执行。')
  }

  if (state.askLevel === 0) {
    rules.push('不主动提问：信息不足时按最合理的假设推进，并在正文里说明所用假设。')
  } else if (state.askLevel === 1) {
    rules.push('信息不足且会影响结果时，先停下说明缺少什么、你准备怎么做；能用一句话说清就不弹提问框。')
  } else {
    rules.push('不确定时主动提问：一次问清，给出可选项并标出推荐项。')
  }

  if (state.detailLevel === 0) {
    rules.push('回答结论先行：先给结果和下一步，背景与推导能省则省。')
  } else if (state.detailLevel === 1) {
    rules.push('回答保持中等篇幅：结论、关键依据、风险各点到为止。')
  } else {
    rules.push('回答可以详细：给出依据、权衡和失败时的替代方案。')
  }

  if (state.toolPace === 0) {
    rules.push('小步快验：每次改动后立即验证，确认无误再做下一步。')
  } else if (state.toolPace === 1) {
    rules.push('执行节奏平衡：相关操作可以合并，但保留中间验证点。')
  } else {
    rules.push('批量执行：把同类的只读或低风险操作合并，减少来回打断，最后统一验证。')
  }

  rules.push('用户跳过问题或没有明确回答时，不要用默认假设闷头继续；至少先说明你准备按什么假设推进。')
  return ['## 工作节奏（用户设定，优先于其他默认习惯）', ...rules.map((line, index) => `${index + 1}. ${line}`)].join('\n')
}

export function apply(ctx) {
  const state = readState()

  ctx.effect(() => ctx.systemPrompt.section({
    name: SECTION_NAME,
    order: 10155,
    text: () => buildRules(state),
  }), 'agent-habits.section()')

  // 按壁钟时间计：每个会话+轮次维护上次播报/停顿的时刻。
  const clocks = new Map()

  ctx.effect(() => ctx.on('agent/pre-step', async (payload, next) => {
    const decision = await next()
    try {
      if (!state.enabled) return decision
      if (!decision || decision.kind !== 'enter') return decision
      const agent = payload && payload.agent
      const sessionId = agent && agent.id ? String(agent.id) : ''
      if (!sessionId) return decision
      const turn = payload && payload.turn !== undefined ? String(payload.turn) : '0'
      const key = `${sessionId}\u0000${turn}`
      const now = Date.now()
      let clock = clocks.get(key)
      if (!clock) {
        clock = { lastReportAt: now, lastPauseAt: now }
        clocks.set(key, clock)
        if (clocks.size > 4) {
          for (const other of clocks.keys()) if (other !== key) clocks.delete(other)
        }
        return decision
      }

      const pauseMs = PAUSE_MINUTES[state.pauseLevel] * 60_000
      const reportMs = REPORT_MINUTES[state.reportLevel] * 60_000
      const pauseDue = pauseMs > 0 && now - clock.lastPauseAt >= pauseMs
      const reportDue = reportMs > 0 && now - clock.lastReportAt >= reportMs
      if (!pauseDue && !reportDue) return decision

      let text
      if (pauseDue) {
        clock.lastPauseAt = now
        clock.lastReportAt = now
        text = `（停顿点：这一轮已连续工作约 ${PAUSE_MINUTES[state.pauseLevel]} 分钟。用 1–3 句汇报进展与剩余工作，然后停住等用户回复；不要提问、不要问是否继续。）`
      } else {
        clock.lastReportAt = now
        text = `（播报点：距上次播报超过约 ${REPORT_MINUTES[state.reportLevel]} 分钟。用 1–3 句说明刚做了什么、结论、下一步，然后继续。）`
      }
      return {
        ...decision,
        messages: [
          {
            id: globalThis.crypto.randomUUID(),
            role: 'user',
            content: [{ type: 'text', text }],
            source: { kind: 'agent-habits', form: 'notice', summary: pauseDue ? '停顿点' : '播报点' },
          },
          ...(Array.isArray(decision.messages) ? decision.messages : []),
        ],
      }
    } catch (error) {
      ctx.logger?.warn?.(`agent-habits: pre-step skipped: ${String(error)}`)
      return decision
    }
  }), 'agent-habits.pre-step()')

  ctx.inject(['webServer'], (sctx) => {
    sctx.effect(() => sctx.webServer.register({
      kind: 'exact',
      path: BRIDGE_PATH,
      handler: async (req, res) => {
        if (!isLocalRequest(req)) {
          reply(res, 403, { ok: false, error: 'local requests only' })
          return
        }
        if (req.method !== 'POST') {
          reply(res, 405, { ok: false, error: 'POST only' })
          return
        }
        if (!isJsonRequest(req)) {
          reply(res, 415, { ok: false, error: 'application/json required' })
          return
        }
        const body = await readJsonBody(req)
        if (!body || typeof body !== 'object') {
          reply(res, 400, { ok: false, error: 'malformed JSON body' })
          return
        }
        if (body.action === 'set') {
          if (!body.config || typeof body.config !== 'object') {
            reply(res, 400, { ok: false, error: 'config object required' })
            return
          }
          Object.assign(state, normalize({ ...state, ...body.config }))
          writeState(state)
          reply(res, 200, { ok: true, config: { ...state } })
          return
        }
        if (body.action === 'reset') {
          Object.assign(state, { ...DEFAULTS })
          writeState(state)
          reply(res, 200, { ok: true, config: { ...state } })
          return
        }
        reply(res, 200, { ok: true, config: { ...state } })
      },
    }), 'agent-habits.bridge')
  })
}

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]', '::1'])

function hostnameOf(hostHeader) {
  const raw = String(hostHeader ?? '').trim().toLowerCase()
  if (!raw) return ''
  if (raw.startsWith('[')) {
    const end = raw.indexOf(']')
    return end === -1 ? raw : raw.slice(0, end + 1)
  }
  const colon = raw.lastIndexOf(':')
  return colon === -1 ? raw : raw.slice(0, colon)
}

function isLocalRequest(req) {
  if (!LOOPBACK_HOSTS.has(hostnameOf(req.headers?.host))) return false
  const origin = req.headers?.origin
  if (origin === undefined) return true
  try {
    return LOOPBACK_HOSTS.has(new URL(String(origin)).hostname.toLowerCase())
  } catch {
    return false
  }
}

function isJsonRequest(req) {
  const type = String(req.headers?.['content-type'] ?? '').toLowerCase()
  return type.startsWith('application/json')
}

function reply(res, status, body) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'referrer-policy': 'no-referrer',
  })
  res.end(JSON.stringify(body))
}

async function readJsonBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) return undefined
    chunks.push(chunk)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return undefined
  }
}
