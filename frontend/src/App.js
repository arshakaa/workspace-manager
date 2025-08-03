import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import AppRouter from './routes/AppRouter';

function App() {
    return (
        <ChakraProvider>
            <Router>
                <AppRouter />
            </Router>
        </ChakraProvider>
    );
}

export default App;
