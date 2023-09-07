import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import TimesheetsScreen from './screens/TimesheetsScreen'
function App() {
    return (
        <Router>
            <Header />
            <main className="py-3">
                <Container>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} exact />
                        <Route path="/timesheets/:id" element={<TimesheetsScreen />} exact />
                    </Routes>
                </Container>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
