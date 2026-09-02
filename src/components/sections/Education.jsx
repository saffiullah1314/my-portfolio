import React, { useState, useEffect } from "react";
import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import styled from "styled-components";
import api from "../../utils/api";
import EducationCard from "../cards/EducationCard";
import EarthCanvas from "../canvas/Earth";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: rlative;
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

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await api.get('/education');
        setEducation(res.data.data);
      } catch (error) {
        console.error("Failed to fetch education", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

  return (
    <Container id="Education">
      <Wrapper>
        <Title>Education</Title>
        <Desc
          style={{
            marginBottom: "40px",
          }}
        >
          My education has been a journey of self-discovery and growth. My
          educational details are as follows.
        </Desc>

        <VerticalTimeline>
          {loading ? (
            <CircularProgress />
          ) : (
            education.map((edu, index) => (
              <EducationCard key={`education-${index}`} education={edu} />
            ))
          )}
        </VerticalTimeline>
        <EarthCanvas />
      </Wrapper>
    </Container>
  );
};

export default Education;