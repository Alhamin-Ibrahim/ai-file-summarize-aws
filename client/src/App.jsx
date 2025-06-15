import {Box} from '@chakra-ui/react'
import {Route, Routes} from 'react-router-dom'

import InputForm from './pages/InputForm'
import ViewSummary from './pages/ViewSummary'

function App() {

  return (
    <Box minH={"100vh"} bg={'gray.100'}>
      <Routes>
      <Route path='/' element={<InputForm/>} />
      <Route path='/summary' element={<ViewSummary/>} />
    </Routes>
    </Box>
  )
}

export default App
