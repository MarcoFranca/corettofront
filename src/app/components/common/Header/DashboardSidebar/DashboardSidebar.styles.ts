import styled from "styled-components";

export const Sidebar = styled.aside`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 250px;
    height: 100vh;
    padding: 1.5rem;
    background-color: rgb(5, 26, 53);
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 9;
`;

export const ProfileSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 2rem;
    margin-bottom: 2rem;
`;

export const LogoWrapper = styled.div`
    width: 150px;
    height: auto;
    margin-bottom: 1rem;
`;

export const UserImageWrapper = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 1rem;
`;

export const UserInfo = styled.p`
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
`;

export const NavMenu = styled.nav`
    width: 100%;
`;

export const NavItem = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px;
    border: none;
    background: none;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: 0.3s;
    border-radius: 8px;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
        background-color: rgba(255, 255, 255, 0.2);
        font-weight: bold;
        border-left: 4px solid #ffc107;
        padding-left: 12px;
    }

    &:hover svg {
        transform: scale(1.1);
        transition: 0.3s ease-in-out;
    }
`;

export const Icon = styled.span`
    font-size: 1.2rem;
    transition: transform 0.3s ease-in-out;
`;

export const LogoutButton = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px;
    border: none;
    background: none;
    color: #ff4d4d;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    border-radius: 8px;
    margin-top: auto;

    &:hover {
        background-color: rgba(255, 77, 77, 0.1);
    }

    &:hover ${Icon} {
        animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(-8deg); }
        50% { transform: rotate(8deg); }
        75% { transform: rotate(-3deg); }
        100% { transform: rotate(0deg); }
    }
`;

