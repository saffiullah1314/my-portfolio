import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../utils/api";
import ProjectCard from "../cards/ProjectCard";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 50px;
  padding: 0px 16px;
  position: relative;
  z-index: 1;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ToggleButtonGroup = styled.div`
  display: flex;
  border: 1.5px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  border-radius: 12px;
  font-weight: 500;
  margin: 22px 0;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ToggleButton = styled.div`
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.primary + 20};
  }
  @media (max-width: 768px) {
    padding: 6px 8px;
    border-radius: 4px;
  }
  ${({ active, theme }) =>
    active &&
    `
  background:  ${theme.primary + 20};
  `}
`;

const Divider = styled.div`
  width: 1.5px;
  background: ${({ theme }) => theme.primary};
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
`;

const ViewMoreButton = styled.button`
  margin-top: 36px;
  padding: 14px 32px;
  background: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.black};
  border: 2px solid ${({ theme }) => theme.white};
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0px 5px 15px rgba(255, 255, 255, 0.15);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 8px 25px rgba(255, 255, 255, 0.3);
    background: transparent;
    color: ${({ theme }) => theme.white};
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0px 2px 10px rgba(255, 255, 255, 0.2);
  }
`;

const Projects = () => {
  const [toggle, setToggle] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        const fetchedProjects = res.data.data;
        // Ensure machine learning projects appear first
        const sortedProjects = fetchedProjects.sort((a, b) => {
          const aIsML = a.category?.toLowerCase() === 'machine learning';
          const bIsML = b.category?.toLowerCase() === 'machine learning';
          if (aIsML && !bIsML) return -1;
          if (!aIsML && bIsML) return 1;
          return 0;
        });
        setProjects(sortedProjects);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const uniqueCategories = ["all", ...new Set(projects.map(p => p.category?.toLowerCase()).filter(Boolean))];
  
  const filteredProjects = projects.filter((item) => toggle === "all" || item.category?.toLowerCase() === toggle);
  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 3);

  return (
    <Container id="Projects">
      <Wrapper>
        <Title>Projects</Title>
        <Desc style={{ marginBottom: "40px" }}>
          I have worked on a wide range of projects. From web apps to Machine learning. Here are some of my projects.
        </Desc>

        <ToggleButtonGroup>
          {uniqueCategories.map((category, index) => (
            <React.Fragment key={category}>
              <ToggleButton 
                active={toggle === category} 
                onClick={() => { setToggle(category); setShowAll(false); }}
              >
                {category === 'all' ? 'ALL' : category.toUpperCase()}
              </ToggleButton>
              {index !== uniqueCategories.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </ToggleButtonGroup>

        <CardContainer>
          {loading ? (
            <CircularProgress />
          ) : (
            displayedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          )}
        </CardContainer>
        
        {!loading && filteredProjects.length > 3 && (
          <ViewMoreButton onClick={() => setShowAll(!showAll)}>
            {showAll ? "View Less" : "View More"}
          </ViewMoreButton>
        )}
      </Wrapper>
    </Container>
  );
};

export default Projects;
