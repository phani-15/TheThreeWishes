import { BrowserRouter,Routes,Route } from 'react-router-dom'
import WelcomePage from './Pages/WelcomePage'
import LoginPage from './Pages/LoginPage'
import Round1Page from './Pages/Round1Page'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage/>} />
           <Route path="/login" element={<LoginPage/>} />
           <Route path="/round1" element={<Round1Page/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
