import React from "react";
import styled from "styled-components";

const Card = styled.div`
  width: 330px;
  min-height: 500px;
  height: auto;
  background-color: ${({ theme }) => theme.card};
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  padding: 26px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.4s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
    filter: brightness(1.05);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: ${({ theme }) => theme.card_light};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
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
  gap: 6px;
  padding: 0px 2px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary || '#fff'};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
`;

const Date = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  opacity: 0.8;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 4px;
  font-size: 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
`;

const Button = styled.a`
  flex: 1;
  padding: 12px 0;
  background: ${({ theme }) => theme.white || '#fff'};
  color: ${({ theme }) => theme.black || '#000'};
  border: 2px solid ${({ theme }) => theme.white || '#fff'};
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
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
    color: ${({ theme }) => theme.white || '#fff'};
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0px 2px 10px rgba(255, 255, 255, 0.2);
  }
`;

const Tag = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary || '#fff'};
  background-color: rgba(255, 255, 255, 0.08);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
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
