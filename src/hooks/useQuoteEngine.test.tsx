import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useQuoteEngine } from './useQuoteEngine'
import VerticalNav from '../components/VerticalNav'
import CommercialQuote from '../components/quotes/CommercialQuote'
import HygieneMartQuote from '../components/quotes/HygieneMartQuote'

function Harness() {
  const { state, dispatch, setVertical, quote } = useQuoteEngine()

  return (
    <div>
      <VerticalNav active={state.vertical} onChange={setVertical} />
      {state.vertical === 'commercial' && (
        <CommercialQuote
          params={state.params}
          onChange={patch => dispatch({ type: 'updateCommercial', patch })}
        />
      )}
      {state.vertical === 'hygienemart' && (
        <HygieneMartQuote
          params={state.params}
          onChange={patch => dispatch({ type: 'updateHygieneMart', patch })}
        />
      )}
      <span data-testid="total">{quote.total}</span>
    </div>
  )
}

describe('useQuoteEngine vertical switching', () => {
  it('never hands the previous vertical params to the next screen', async () => {
    render(<Harness />)

    fireEvent.click(screen.getByRole('button', { name: /commercial/i }))
    expect(screen.getByText('Commercial Deep Cleaning')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /hygienemart/i }))

    expect(await screen.findByText('Wholesale cleaning supplies and equipment.')).toBeInTheDocument()
    expect(Number(screen.getByTestId('total').textContent)).toBeGreaterThan(0)
  })
})
