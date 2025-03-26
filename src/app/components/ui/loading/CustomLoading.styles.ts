import styled from "styled-components";
import {motion} from "framer-motion";

export const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const LoadingText = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  color: #2c3e50;
  margin-top: 20px;
`;