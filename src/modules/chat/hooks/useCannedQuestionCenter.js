import { useCallback, useEffect, useState } from 'react'
import * as cannedQuestionService from '../services/cannedQuestionService'

function extractList(res) {
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.data)) return res.data
  return []
}

// Drives the "Pesan Cepat" FAQ-lookup experience: browse/search the admin's
// canned questions, log a lookup against one (POST /ask), and review past
// lookups (GET /history). Shared by PesanCepatCard + QuickChatModal on the
// Dashboard and by the full-page ChatView, so the fetching/selection logic
// only lives in one place.
export default function useCannedQuestionCenter() {
  const [tab, setTab] = useState('lookup') // 'lookup' | 'history'

  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuestionId, setActiveQuestionId] = useState(null)

  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [historyError, setHistoryError] = useState(null)

  const [askState, setAskState] = useState('idle') // idle | saving | saved | error
  const [lastAskedAt, setLastAskedAt] = useState(null)

  const loadQuestions = useCallback(async () => {
    setLoadingQuestions(true)
    try {
      const list = extractList(await cannedQuestionService.listCannedQuestions())
      setQuestions(list)
      setActiveQuestionId((prev) => (prev && list.some((q) => q.id === prev) ? prev : (list[0]?.id ?? null)))
    } catch (err) {
      console.error('Failed to load canned questions', err)
    } finally {
      setLoadingQuestions(false)
    }
  }, [])

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true)
    setHistoryError(null)
    try {
      setHistory(extractList(await cannedQuestionService.getCannedQuestionHistory({ limit: 20 })))
    } catch (err) {
      setHistoryError(err.message || 'Gagal memuat riwayat')
    } finally {
      setLoadingHistory(false)
    }
  }, [])

  useEffect(() => {
    loadQuestions()
    // Load eagerly (not gated on the history tab being active) so the
    // Dashboard's "Pesan Cepat" preview card has a recent entry to show
    // without needing the modal open first.
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadQuestions])

  const filteredQuestions = questions.filter((q) => {
    if (!searchQuery.trim()) return true
    const needle = searchQuery.trim().toLowerCase()
    return q.question.toLowerCase().includes(needle) || q.category?.toLowerCase().includes(needle)
  })

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) ?? null

  const selectQuestion = (id) => {
    setActiveQuestionId(id)
    setAskState('idle')
  }

  const askActiveQuestion = async () => {
    if (!activeQuestion) return
    setAskState('saving')
    try {
      const result = await cannedQuestionService.askCannedQuestion({ cannedQuestionId: activeQuestion.id })
      setAskState('saved')
      setLastAskedAt(result?.askedAt ?? new Date().toISOString())
      loadHistory()
    } catch (err) {
      console.error('Failed to log canned question lookup', err)
      setAskState('error')
    }
  }

  return {
    tab,
    setTab,
    questions: filteredQuestions,
    totalQuestionsCount: questions.length,
    loadingQuestions,
    searchQuery,
    setSearchQuery,
    activeQuestionId,
    selectQuestion,
    activeQuestion,
    askState,
    lastAskedAt,
    askActiveQuestion,
    history,
    loadingHistory,
    historyError,
  }
}
