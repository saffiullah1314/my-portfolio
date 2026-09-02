import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../utils/api";
import {
  FacebookRounded,
  GitHub,
  Instagram,
  LinkedIn,
} from "@mui/icons-material";

const FooterContainer = styled.div`
  width: 100%;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  z-index: 10;
  position: relative;
`;
const FooterWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  padding: 1rem;
  color: ${({ theme }) => theme.text_primary};
`;
const Logo = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.primary};
`;
const Nav = styled.ul`
  width: 100%;
  max-width: 800px;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    text-align: center;
    font-size: 12px;
  }
`;
const NavLink = styled.a`
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
const SocialMediaIcons = styled.div`
  display: flex;
  margin-top: 1rem;
`;
const SocialMediaIcon = styled.a`
  display: inline-block;
  margin: 0 1rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text_primary};
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;
const Copyright = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.soft2};
  text-align: center;
`;

const Footer = () => {
  const [socials, setSocials] = useState({
    facebook: "https://www.facebook.com/saffiullah1314/",
    github: "https://github.com/saffiullah1314",
    linkedin: "https://www.linkedin.com/in/saffi-ullah-865819339/",
    insta: "https://www.instagram.com/saffiullah1314"
  });

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await api.get('/social-links');
        const links = res.data.data;
        setSocials((prev) => {
          const newSocials = { ...prev };
          links.forEach(link => {
            if (link.platform && link.url) {
              newSocials[link.platform] = link.url;
            }
          });
          return newSocials;
        });
      } catch (err) {
        console.error("Failed to fetch social links", err);
      }
    };
    fetchSocials();
  }, []);

  return (
    <FooterContainer>
      <FooterWrapper>
        <Logo>Saffi Ullah</Logo>
        <Nav>
          <NavLink href="#About">About</NavLink>
          <NavLink href="#Skills">Skills</NavLink>
          <NavLink href="#Experience">Experience</NavLink>
          <NavLink href="#Projects">Projects</NavLink>
          <NavLink href="#Education">Education</NavLink>
        </Nav>
        <SocialMediaIcons>
          {socials.facebook && (
            <SocialMediaIcon href={socials.facebook} target="display">
              <FacebookRounded />
            </SocialMediaIcon>
          )}
          {socials.github && (
            <SocialMediaIcon href={socials.github} target="display">
              <GitHub />
            </SocialMediaIcon>          
          )}
          {socials.linkedin && (
            <SocialMediaIcon href={socials.linkedin} target="display">
              <LinkedIn />
            </SocialMediaIcon>
          )}
          {socials.insta && (
            <SocialMediaIcon href={socials.insta} target="display">
              <Instagram />
            </SocialMediaIcon>
          )}
        </SocialMediaIcons>
        <Copyright>&copy; {new Date().getFullYear()} Saffi Ullah. All rights reserved.</Copyright>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;