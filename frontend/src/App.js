import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import TimesheetsScreen from './screens/TimesheetsScreen'
import TimesheetScreen from "./screens/TimesheetScreen";
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
function App() {
    return (
        <Router>
            <Header />
            <main className="py-3">
                <Container>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} exact />
                        <Route path="/timesheets/" element={<TimesheetsScreen />} />
                        <Route path="/timesheets/:id/" element={<TimesheetScreen />} />
                        <Route path="/login/" element={<LoginScreen />} />
                        <Route path="/register/" element={<RegisterScreen />} />
                        <Route path="/profile" element={<ProfileScreen />} />
                    </Routes>
                </Container>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
