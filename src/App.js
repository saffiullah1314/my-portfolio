import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/sections/hero";
import Skills from "./components/sections/Skills";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";

import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/admin/ProtectedRoute";
import Login from "./components/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProfile from "./components/admin/AdminProfile";
import AdminSkills from "./components/admin/AdminSkills";
import AdminEducation from "./components/admin/AdminEducation";
import AdminSocial from "./components/admin/AdminSocial";
import AdminLearning from "./components/admin/AdminLearning";

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

const Wrapper = styled.div`
  padding-bottom: 100px;
  background: linear-gradient(
      38.73deg,
      rgba(204, 0, 187, 0.15) 0%,
      rgba(201, 32, 184, 0) 50%
    ),
    linear-gradient(
      141.27deg,
      rgba(0, 70, 209, 0) 50%,
      rgba(0, 70, 209, 0.15) 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <ToastContainer theme="dark" />
        <Routes>
          {/* Public Portfolio Route */}
          <Route path="/" element={
            <>
              <Navbar />
              <Body>
                <div>
                  <Hero />
                  <Wrapper>
                    <Skills />
                    <Experience />
                  </Wrapper>
                  <Projects />
                  <Wrapper>
                    <Education />
                    <Contact />
                  </Wrapper>
                  <Footer />
                </div>
              </Body>
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="education" element={<AdminEducation />} />
              <Route path="social" element={<AdminSocial />} />
              <Route path="learning" element={<AdminLearning />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;