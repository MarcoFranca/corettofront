'use client';
import styled from 'styled-components';
import Link from 'next/link';

export const LPWrapper = styled.main`
    background: ${({theme}) => theme.colors.background};
    color: ${({theme}) => theme.colors.text};
`;

export const Section = styled.section<{ $alt?: boolean }>`
    padding: 56px 18px;
    background: ${({ $alt }) => ($alt ? '#ffffff' : 'transparent')};

    @media (min-width: 1024px) {
        padding: 88px 24px;
    }
`;

export const Container = styled.div`
    max-width: 1120px;
    margin: 0 auto;
`;

export const HeaderBar = styled.header`
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(255,255,255,0.9);
    backdrop-filter: saturate(180%) blur(8px);
    border-bottom: 1px solid #e5e7eb;

    .wrap {
        max-width: 1120px;
        margin: 0 auto;
        padding: 10px 18px;
        display: flex;
        align-items: center;
        gap: 16px;
        justify-content: space-between;
    }
    .brand {
        display: flex; align-items: center; gap: 10px;
        font-weight: 800; color: ${({theme}) => theme.colors.primary}; letter-spacing: .2px;
    }
    .nav { display: none; }
    @media (min-width: 992px) { .nav { display: flex; gap: 16px; } }
`;

export const NavLink = styled(Link)`
    color: ${({theme}) => theme.colors.muted};
    text-decoration: none;
    font-size: 14px;
    &:hover { color: ${({theme}) => theme.colors.primary}; }
`;

export const HeroGrid = styled.div`
    display: grid;
    gap: 24px;
    align-items: center;

    @media (min-width: 992px) {
        grid-template-columns: 1.2fr 1fr;
        gap: 48px;
    }
`;

export const Title = styled.h1`
    font-size: 36px;
    line-height: 1.15;
    margin: 0 0 10px;
    color: ${({theme}) => theme.colors.primary};

    @media (min-width: 768px) { font-size: 44px; }
`;

export const Subtitle = styled.p`
    font-size: 18px;
    color: ${({theme}) => theme.colors.muted};
    margin: 0 0 14px;
`;

export const BadgeRow = styled.div`
    display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0 6px;
    span {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; padding: 6px 10px; border-radius: 999px;
        background: #f1f5ff; color: ${({theme}) => theme.colors.primary};
        border: 1px solid #e3eaff;
    }
`;

export const Bullets = styled.ul`
    margin: 10px 0 0; padding-left: 18px;
    li { margin: 6px 0; }
`;

export const CtaRow = styled.div`
    display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 12px;
`;

export const ButtonPrimary = styled(Link)`
    background: ${({theme}) => theme.colors.primary};
    color: #fff; text-decoration: none;
    padding: 12px 18px; border-radius: 12px; font-weight: 700;
    &:hover { opacity: .92; }
`;

export const ButtonGhost = styled(Link)`
    border: 1px solid ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.primary}; text-decoration: none;
    padding: 12px 18px; border-radius: 12px; font-weight: 700; background: #fff;
    &:hover { background: #f6f8ff; }
`;

export const Card = styled.div`
    background: #fff; border: 1px solid #eef2f7; border-radius: 16px;
    padding: 18px; box-shadow: 0 6px 18px rgba(4,42,117,0.06);
`;

export const ProofBar = styled.div`
    display: grid; gap: 10px; grid-template-columns: repeat(2, minmax(0,1fr));
    @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
    .pill {
        background: #ffffff; border: 1px solid #eef2f7; border-radius: 12px;
        padding: 10px 12px; display: flex; align-items: center; gap: 8px;
        font-size: 13px; color: ${({theme}) => theme.colors.muted};
    }
`;

export const FeatureGrid = styled.div`
    display: grid; gap: 14px;
    @media (min-width: 992px) { grid-template-columns: repeat(3, 1fr); }
`;

export const FeatureCard = styled.div`
  background: #fff; border: 1px solid #eef2f7; border-radius: 16px; padding: 18px;
  h3 { margin: 0 0 6px; font-size: 18px; color: ${({theme}) => theme.colors.primary}; }
  p { margin: 0; color: ${({theme}) => theme.colors.muted}; }
`;

export const IconCircle = styled.span`
  width: 38px; height: 38px; border-radius: 12px; display: inline-grid; place-items: center;
  background: #f3f7ff; color: ${({theme}) => theme.colors.primary}; margin-right: 8px;
`;

export const Steps = styled.ol`
  counter-reset: step; display: grid; gap: 14px;
  @media (min-width: 992px) { grid-template-columns: repeat(3, 1fr); }
  li {
    list-style: none; background: #fff; border: 1px solid #eef2f7; border-radius: 16px; padding: 16px;
    color: ${({theme}) => theme.colors.muted};
  }
  li::before {
    counter-increment: step; content: counter(step);
    background: ${({theme}) => theme.colorsButton.primary}; color: #00333a; font-weight: 800;
    width: 34px; height: 34px; display: inline-grid; place-items: center; border-radius: 10px; margin-right: 8px;
  }
  strong { color: ${({theme}) => theme.colors.text}; }
`;

export const Testimonial = styled.blockquote`
  background: #fff; border: 1px dashed #dbe7ff; border-radius: 16px; padding: 20px;
  color: ${({theme}) => theme.colors.text};
  cite { display: block; margin-top: 8px; color: ${({theme}) => theme.colors.muted}; font-style: normal; }
`;

export const PlansGrid = styled.div`
  display: grid; gap: 16px;
  @media (min-width: 992px) { grid-template-columns: 1fr 1fr; }
`;

export const PriceCard = styled.div`
  background: #fff; border: 1px solid #eef2f7; border-radius: 16px; padding: 20px;
  .price { font-size: 34px; color: ${({theme}) => theme.colors.primary}; font-weight: 800; margin: 6px 0 10px; }
  ul { margin: 0; padding-left: 18px; color: ${({theme}) => theme.colors.muted}; }
  li { margin: 6px 0; }
`;

export const Faq = styled.div`
  details { background: #fff; border: 1px solid #eef2f7; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; }
  summary { cursor: pointer; color: ${({theme}) => theme.colors.text}; font-weight: 600; }
  p { color: ${({theme}) => theme.colors.muted}; margin: 8px 0 0; }
`;

export const Footer = styled.footer`
  border-top: 1px solid #e5e7eb; padding: 18px 18px; color: ${({theme}) => theme.colors.muted};
  a { color: ${({theme}) => theme.colors.primary}; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .links { display: flex; gap: 14px; flex-wrap: wrap; }
`;

export const MobileCtaBar = styled.div`
  position: sticky; bottom: 0; left: 0; right: 0;
  background: #fff; border-top: 1px solid #e5e7eb; padding: 10px 14px; z-index: 50;
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;

  @media (min-width: 768px) { display: none; }
`;
