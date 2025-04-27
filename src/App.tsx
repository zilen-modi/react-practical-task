import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { ClientProvider } from './contexts/ClientContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CssBaseline } from '@mui/material';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ClientProvider>
          <CssBaseline />
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
              </Routes>
            </Layout>
          </Router>
        </ClientProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
