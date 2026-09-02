import React from "react";
import styled from "styled-components";

const Card = styled.div`
  width: 330px;
  height: 520px;
  background-color: ${({ theme }) => theme.card};
  border-radius: 10px;
  box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  padding: 26px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.4s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 40px 4px rgba(0, 0, 0, 0.6);
    filter: brightness(1.05);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: ${({ theme }) => theme.white};
  border-radius: 10px;
  box-shadow: 0 0 16px 2px rgba(0, 0, 0, 0.3);
`;

const Tags = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const Details = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0px 2px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
`;

const Date = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary + 80};
`;

const Description = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
`;

const Members = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

const Avatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  margin-left: -10px;
  background-color: ${({ theme }) => theme.white};
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  border: 3px solid ${({ theme }) => theme.card};
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
`;

const Button = styled.a`
  flex: 1;
  padding: 10px 0;
  background: ${({ theme }) => theme.primary + '33'};
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  text-align: center;
  border-radius: 8px;
  text-decoration: none;
  transition: 0.3s ease;
  border: 1px solid white;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const Tag = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.primary + '15'};
  padding: 2px 8px;
  border-radius: 10px;
`;

const ProjectCard = ({ project }) => {
  return (
    <Card>
      <Image src={project.image} />

      <Tags>
        {project.tags?.map((tag, index) => (
          <Tag key={index}>{tag}</Tag>
        ))}
      </Tags>

      <Details>
        <Title>{project.title}</Title>
        <Date>{project.date}</Date>
        <Description>{project.description}</Description>
      </Details>

      {/* Adding a flexible spacer if member isn't used anymore */}
      <div style={{ flex: 1 }}></div>

      <ButtonWrapper>
        {project.github && <Button href={project.github} target="_blank">View Code</Button>}
        {project.webapp && <Button href={project.webapp} target="_blank">View Live</Button>}
      </ButtonWrapper>
    </Card>
  );
};

export default ProjectCard;
