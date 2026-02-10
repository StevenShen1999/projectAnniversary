/**
 * Parse Telegram chat HTML exports and compute per-person word/emoji stats.
 * Usage: node scripts/parse-chat-stats.js
 * Outputs JSON to stdout that can be pasted into src/data/word-emoji-stats.js
 */

import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const chatDir = join(__dirname, '..', 'chat')

// ── Stop words to filter out ──
const STOP_WORDS = new Set([
  // English
  'the','a','an','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','shall','should','may','might','must','can','could',
  'i','me','my','mine','myself','you','your','yours','yourself','he','him','his','himself',
  'she','her','hers','herself','it','its','itself','we','us','our','ours','ourselves',
  'they','them','their','theirs','themselves','what','which','who','whom','this','that',
  'these','those','am','if','or','as','of','at','by','for','with','about','against',
  'between','through','during','before','after','above','below','to','from','up','down',
  'in','out','on','off','over','under','again','further','then','once','here','there',
  'when','where','why','how','all','both','each','few','more','most','other','some',
  'such','no','nor','not','only','own','same','so','than','too','very','just','because',
  'but','and','or','yet','while','also','into','onto','upon','still','already','even',
  'much','many','well','back','now','way','get','got','like','know','think','want',
  'go','going','come','see','look','make','take','thing','things','say','said','tell',
  'told','let','yes','yeah','yea','ya','ok','okay','oh','ah','haha','hahaha','lol',
  'really','actually','right','good','one','two','don','didn','doesn','isn','wasn',
  'won','wouldn','couldn','shouldn','ve','re','ll','im','ive','dont','cant','thats',
  'its','hes','shes','theyre','youre','were','wont','didnt','doesnt','isnt','wasnt',
  'havent','hasnt','hadnt','gonna','wanna','gotta','cause','cuz','tho','though',
  // HTML artifacts & contraction remnants
  'apos','quot','amp','nbsp',
  // Common chat filler
  'lmao','omg','idk','tbh','nah','hmm','hmm','uhh','umm','bruh','bro','dude',
  'literally','basically','probably','maybe','something','someone','anything','anyone',
  'nothing','everything','everyone','somewhere','time','day','today','tomorrow','yesterday',
  'night','morning','need','feel','sure','mean','people','always','never',
  'pretty','quite','bit','lot','put','try','keep','give','made','new','little','big',
  'long','first','last','next','best','better','bad','worse','every','another',
  'could','should','would','might','will','shall','much','very','just','still','even',
  'any','least','although','since','however','because','already','almost','enough',
  'used','using','able','away','around','else','either','yet','whether','without',
  'really','anyway','sometimes','often','kind','sort','start','started','end',
  'point','part','whole','thing','things','stuff','guess','thought','thinking',
])

// ── Emoji regex (covers most common emoji ranges) ──
const EMOJI_RE = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u{2764}\u{2763}\u{2615}\u{231A}\u{23F0}-\u{23F3}\u{23E9}-\u{23EF}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

// ── Parse messages from HTML ──
function parseMessages(html) {
  const messages = []
  // Match each message div (default messages only, not service messages)
  const msgRegex = /<div class="message default clearfix(?:\s+joined)?" id="[^"]*">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g

  // We need a different approach since nested divs make regex tricky.
  // Split by message blocks instead.
  const blocks = html.split(/<div class="message default clearfix/)

  let lastSender = null

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i]
    const isJoined = block.startsWith(' joined')

    // Extract date and time from title attribute
    const dateMatch = block.match(/title="(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+UTC([+-]\d{2}:\d{2})"/)
    let date = null
    let hour = null
    if (dateMatch) {
      const [, dd, mm, yyyy, hh] = dateMatch
      date = new Date(`${yyyy}-${mm}-${dd}`)
      hour = parseInt(hh)
    }

    // Extract sender - take only the text before any HTML tags
    const nameMatch = block.match(/<div class="from_name">\s*([\s\S]*?)\s*<\/div>/)
    if (nameMatch) {
      let name = nameMatch[1].trim()
      // Strip any embedded HTML (sometimes date spans leak in)
      name = name.replace(/<[\s\S]*$/g, '').trim()
      lastSender = name
    }

    const sender = isJoined ? lastSender : (nameMatch ? lastSender : lastSender)

    // Extract text content
    const textMatch = block.match(/<div class="text">\s*([\s\S]*?)\s*<\/div>/)
    if (!textMatch || !sender || !date) continue

    let text = textMatch[1]
    // Strip HTML tags from text (links, formatting, etc.)
    text = text.replace(/<[^>]+>/g, ' ')
    // Decode HTML entities
    text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    text = text.trim()

    messages.push({ sender, text, date, hour })
  }

  return messages
}

// ── Count words and emojis ──
function countWordsAndEmojis(messages) {
  const wordCounts = {}
  const emojiCounts = {}

  for (const msg of messages) {
    const text = msg.text

    // Count emojis
    const emojis = text.match(EMOJI_RE) || []
    for (const e of emojis) {
      if (e === '\u200D' || e === '\uFE0F') continue // skip joiners
      emojiCounts[e] = (emojiCounts[e] || 0) + 1
    }

    // Count words (strip emojis first, then extract words)
    const cleaned = text.replace(EMOJI_RE, ' ').replace(/[^a-zA-Z\s]/g, ' ')
    const words = cleaned.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w))
    for (const w of words) {
      wordCounts[w] = (wordCounts[w] || 0) + 1
    }
  }

  return { wordCounts, emojiCounts }
}

function topEntry(counts) {
  let topKey = null, topCount = 0
  for (const [k, v] of Object.entries(counts)) {
    if (v > topCount) { topKey = k; topCount = v }
  }
  return { key: topKey, count: topCount }
}

function topN(counts, n = 10) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count }))
}

function getMonthKey(date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
}

function getDayKey(date) {
  return DAY_NAMES[date.getDay()]
}

// ── Main ──
function main() {
  // Read all chat files
  const files = readdirSync(chatDir)
    .filter(f => /^messages\d*\.html$/.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '1')
      const numB = parseInt(b.match(/\d+/)?.[0] || '1')
      return numA - numB
    })

  let allMessages = []
  for (const file of files) {
    const html = readFileSync(join(chatDir, file), 'utf-8')
    const msgs = parseMessages(html)
    allMessages = allMessages.concat(msgs)
    console.error(`Parsed ${file}: ${msgs.length} messages`)
  }

  console.error(`Total messages: ${allMessages.length}`)

  // Identify unique senders
  const senders = [...new Set(allMessages.map(m => m.sender))]
  console.error(`Senders: ${senders.join(', ')}`)

  // Build stats for a set of messages
  function buildStats(messages) {
    // Overall
    const { wordCounts, emojiCounts } = countWordsAndEmojis(messages)
    const topWord = topEntry(wordCounts)
    const topEmoji = topEntry(emojiCounts)

    const overall = {
      word: topWord.key || '',
      wordCount: topWord.count,
      emoji: topEmoji.key || '',
      emojiCount: topEmoji.count
    }

    // By month
    const monthGroups = {}
    for (const msg of messages) {
      const key = getMonthKey(msg.date)
      if (!monthGroups[key]) monthGroups[key] = []
      monthGroups[key].push(msg)
    }

    // Sort months chronologically
    const monthOrder = ['Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026']
    const byMonth = monthOrder
      .filter(m => monthGroups[m])
      .map(month => {
        const { wordCounts: wc, emojiCounts: ec } = countWordsAndEmojis(monthGroups[month])
        const tw = topEntry(wc)
        const te = topEntry(ec)
        return {
          month,
          word: tw.key || '', wordCount: tw.count,
          emoji: te.key || '', emojiCount: te.count,
          topWords: topN(wc), topEmojis: topN(ec)
        }
      })

    // By day of week
    const dayGroups = {}
    for (const msg of messages) {
      const key = getDayKey(msg.date)
      if (!dayGroups[key]) dayGroups[key] = []
      dayGroups[key].push(msg)
    }

    const byDay = DAY_NAMES.map(day => {
      if (!dayGroups[day]) return { day, word: '', wordCount: 0, emoji: '', emojiCount: 0, topWords: [], topEmojis: [] }
      const { wordCounts: wc, emojiCounts: ec } = countWordsAndEmojis(dayGroups[day])
      const tw = topEntry(wc)
      const te = topEntry(ec)
      return {
        day,
        word: tw.key || '', wordCount: tw.count,
        emoji: te.key || '', emojiCount: te.count,
        topWords: topN(wc), topEmojis: topN(ec)
      }
    })

    return { overall, byMonth, byDay }
  }

  // Combined
  const combined = buildStats(allMessages)

  // Per person
  const elizabethMsgs = allMessages.filter(m => m.sender.startsWith('Elizabeth'))
  const stevenMsgs = allMessages.filter(m => m.sender.startsWith('Steven'))

  console.error(`Elizabeth messages: ${elizabethMsgs.length}, Steven messages: ${stevenMsgs.length}`)

  const elizabeth = buildStats(elizabethMsgs)
  const steven = buildStats(stevenMsgs)

  const result = { combined, steven, elizabeth }

  // ── Build numeric statistics per person ──
  function buildNumericStats(messages) {
    // Word count
    let totalWords = 0
    let totalEmojis = 0
    for (const msg of messages) {
      const cleaned = msg.text.replace(EMOJI_RE, ' ').replace(/[^a-zA-Z\s]/g, ' ')
      const words = cleaned.split(/\s+/).filter(w => w.length > 0)
      totalWords += words.length
      const emojis = msg.text.match(EMOJI_RE) || []
      totalEmojis += emojis.filter(e => e !== '\u200D' && e !== '\uFE0F').length
    }

    // Late night messages (midnight to 4am, using the timestamp hour from the export)
    const lateNight = messages.filter(m => m.hour !== null && m.hour >= 0 && m.hour < 4).length

    // Record day
    const dayCounts = {}
    for (const msg of messages) {
      const key = msg.date.toISOString().slice(0, 10)
      dayCounts[key] = (dayCounts[key] || 0) + 1
    }
    let recordDate = '', recordCount = 0
    for (const [d, c] of Object.entries(dayCounts)) {
      if (c > recordCount) { recordDate = d; recordCount = c }
    }
    // Format date nicely
    const rd = new Date(recordDate)
    const recordLabel = `${MONTH_NAMES[rd.getMonth()]} ${rd.getDate()}`

    return [
      { label: 'Words exchanged', value: totalWords.toLocaleString(), icon: '💬' },
      { label: 'Late night messages', value: lateNight.toLocaleString(), icon: '🌙' },
      { label: 'Emojis sent', value: totalEmojis.toLocaleString(), icon: '😂' },
      { label: `Record day (${recordLabel})`, value: `${recordCount} msgs`, icon: '🔥' }
    ]
  }

  const numericStats = {
    combined: buildNumericStats(allMessages),
    steven: buildNumericStats(stevenMsgs),
    elizabeth: buildNumericStats(elizabethMsgs)
  }

  // ── Build heatmap + messaging stats per person ──
  function buildMessagingStats(messages) {
    const totalMessages = messages.length

    // Heatmap: count messages by day-of-week (0=Sun) and hour
    const buckets = {}
    for (const msg of messages) {
      if (msg.hour === null) continue
      const day = msg.date.getDay() // 0=Sun
      const key = `${day}-${msg.hour}`
      buckets[key] = (buckets[key] || 0) + 1
    }
    const heatmapData = []
    for (const [key, count] of Object.entries(buckets)) {
      const [day, hour] = key.split('-').map(Number)
      heatmapData.push({ hour, day, count })
    }
    heatmapData.sort((a, b) => a.day - b.day || a.hour - b.hour)

    return { totalMessages, heatmapData }
  }

  const messagingStats = {
    combined: buildMessagingStats(allMessages),
    steven: buildMessagingStats(stevenMsgs),
    elizabeth: buildMessagingStats(elizabethMsgs)
  }

  // Output as JS module
  console.log('// Auto-generated by scripts/parse-chat-stats.js')
  console.log('// Word and emoji frequency analysis from chat history')
  console.log('')
  console.log('export const wordEmojiStats = ' + JSON.stringify(result, null, 2))
  console.log('')
  console.log('export const numericStats = ' + JSON.stringify(numericStats, null, 2))
  console.log('')
  console.log('export const messagingStatsData = ' + JSON.stringify(messagingStats, null, 2))
  console.log('')
}

main()
