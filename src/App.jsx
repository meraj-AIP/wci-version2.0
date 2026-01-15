import { ThemeProvider } from './context/ThemeContext'
import ARIES from './components/ARIES'

function App() {
  return (
    <ThemeProvider>
      <ARIES />
    </ThemeProvider>
  )
}

export default App
