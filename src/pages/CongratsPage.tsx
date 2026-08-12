import { useNavigate } from 'react-router-dom'
import './CongratsPage.css'

function CongratsPage() {
  const navigate = useNavigate()

  return (
    <div className="congrats-page">
      <div className="congrats-page__hearts" aria-hidden="true">
        <span>💍</span>
        <span>🎉</span>
        <span>❤️</span>
        <span>🥂</span>
        <span>🎊</span>
      </div>

      <p className="congrats-page__eyebrow">Gratulerer med bryllupet</p>
      <h1 className="congrats-page__title">
        Tor-Øyvind <span className="congrats-page__amp">&amp;</span> Victoria
      </h1>
      <p className="congrats-page__subtitle">
        Vi takker for et fantastisk bryllup! Vi ønsker dere alt godt på veien videre sammen!
      </p>

      <button
        className="congrats-page__button"
        onClick={() => navigate('/gave')}
      >
        Motta gave 🎁
      </button>
    </div>
  )
}

export default CongratsPage
