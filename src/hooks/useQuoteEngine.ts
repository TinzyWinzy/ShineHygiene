import { useCallback, useMemo, useReducer } from 'react'
import type { Vertical } from '../types'
import { calculateQuote, defaultQuoteState, quoteReducer } from '../domain/quoteState'

export function useQuoteEngine(initial: Vertical = 'commercial') {
  const [state, dispatch] = useReducer(quoteReducer, initial, defaultQuoteState)
  const quote = useMemo(() => calculateQuote(state), [state])

  const setVertical = useCallback(
    (vertical: Vertical) => dispatch({ type: 'setVertical', vertical }),
    [],
  )

  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  return { state, dispatch, setVertical, reset, quote }
}
