import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../../App';
import { setSimulateStorageUnavailable } from '../../services/storage';

/**
 * 3D Card System (CDR-002) — the "cartes archivistiques volumétriques".
 * These tests lock the interaction contract: a deck of cards, a turn-over
 * triggered by the investigator's choice, and a reverse face that stays
 * reachable for assistive technologies.
 */
describe('3D Card System — volumetric archival cards', () => {
  beforeEach(() => {
    localStorage.clear();
    setSimulateStorageUnavailable(false);
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    setSimulateStorageUnavailable(false);
  });

  it('Renders the three research trails as a 3D deck of turn-over cards', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('start-investigation-cta'));
    await user.click(screen.getByTestId('proceed-to-bridge-btn'));

    const deck = screen.getByTestId('research-questions-deck');
    expect(deck).toBeInTheDocument();
    expect(deck.querySelectorAll('.deck-3d__slot')).toHaveLength(3);
    expect(deck.querySelectorAll('.card-3d')).toHaveLength(3);
    expect(deck.querySelectorAll('.card-3d__face')).toHaveLength(6);

    // Nothing is turned over before a choice is made.
    expect(deck.querySelectorAll('.card-3d.is-flipped')).toHaveLength(0);
  });

  it('Turns the chosen trail card over and brings it to the front of the deck', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('start-investigation-cta'));
    await user.click(screen.getByTestId('proceed-to-bridge-btn'));

    const deck = screen.getByTestId('research-questions-deck');
    await user.click(screen.getByTestId('select-question-Q001'));

    const cards = deck.querySelectorAll('.card-3d');
    expect(cards[0].classList.contains('is-flipped')).toBe(true);
    expect(cards[1].classList.contains('is-flipped')).toBe(false);

    // The chosen card is the one lifted in front of the deck.
    const activeSlot = deck.querySelector('.deck-3d__slot.is-active');
    expect(activeSlot).not.toBeNull();
    expect(activeSlot?.querySelector('.card-3d')).toBe(cards[0]);
  });

  it('Keeps the reverse face of a card reachable by assistive technologies', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('start-investigation-cta'));
    await user.click(screen.getByTestId('proceed-to-bridge-btn'));
    await user.click(screen.getByTestId('select-question-Q002'));

    // The feedback region lives on the back face but stays in the a11y tree.
    const feedback = screen.getByTestId('question-feedback-Q002');
    expect(feedback).toBeInTheDocument();
    expect(feedback.closest('.card-3d__face--back')).not.toBeNull();
  });

  it('Renders the three admissible verdicts as turn-over cards keeping their radio controls', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('nav-step-S05'));

    const deck = screen.getByTestId('verdict-cards-deck');
    expect(deck).toBeInTheDocument();
    expect(deck.querySelectorAll('.card-3d')).toHaveLength(3);

    const radio = screen.getByRole('radio', {
      name: /Deux événements distincts sont plausibles/i,
    });
    expect(radio).toBeInTheDocument();

    await user.click(radio);

    const cards = deck.querySelectorAll('.card-3d');
    expect(cards[0].classList.contains('is-flipped')).toBe(true);
    expect(screen.getByTestId('conclusion-option-DISTINCT_EVENTS_PLAUSIBLE')).toBeInTheDocument();
  });

  it('Keeps the card turnover usable when reduced motion is requested', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Mouvement réduit/i }));
    expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true');

    await user.click(screen.getByTestId('start-investigation-cta'));
    await user.click(screen.getByTestId('proceed-to-bridge-btn'));
    await user.click(screen.getByTestId('select-question-Q001'));

    const deck = screen.getByTestId('research-questions-deck');
    expect(deck.querySelectorAll('.card-3d.is-flipped')).toHaveLength(1);
  });
});
