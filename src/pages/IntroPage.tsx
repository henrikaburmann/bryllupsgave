import { useNavigate } from 'react-router-dom'
import './IntroPage.css'

function IntroPage() {
  const navigate = useNavigate()

  return (
    <div className="intro-page">
      <p className="intro-page__eyebrow">Før dere kan motta gaven</p>
      <h1 className="intro-page__title">For å motta gaven må dere først gjennom noen øvelser</h1>
      <p className="intro-page__subtitle">
        Dere skal gjennom 5 morsomme øvelser sammen. For hver øvelse dere klarer, fylles skattekisten
        litt mer opp!
      </p>
      <button className="intro-page__button" onClick={() => navigate('/spill/1')}>
        Vi er klare!
      </button>
    </div>
  )
}

export default IntroPage
