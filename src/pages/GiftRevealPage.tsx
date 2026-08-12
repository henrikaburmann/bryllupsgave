import './GiftRevealPage.css'

function GiftRevealPage() {
  return (
    <div className="gift-reveal">
      <div className="gift-reveal__hearts" aria-hidden="true">
        {['❤️', '🎉', '💍', '🥂', '🎊'].map((emoji, i) => (
          <span key={i} className="gift-reveal__heart" style={{ animationDelay: `${i * 200}ms` }}>
            {emoji}
          </span>
        ))}
      </div>

      <h1 className="gift-reveal__title">Gratulerer! 🎊</h1>

      <p className="gift-reveal__text">
        Gratulerer med vel gjennomført oppgave og bryllup!
      </p>

      <div className="gift-reveal__instruction">
        <p className="gift-reveal__instruction-label">For å inkassere gaven:</p>
        <p className="gift-reveal__instruction-body">
          Tekst Henrik med deres favoritt<br />
          Rosenborgspiller gjennom tidene
        </p>
      </div>
    </div>
  )
}

export default GiftRevealPage
