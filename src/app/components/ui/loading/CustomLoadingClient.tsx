'use client';

import React from "react";
import Lottie from "react-lottie-player";
import animationData from "@/../public/lotties/loading.json";
import { LoadingContainer, LoadingText } from "./CustomLoading.styles";

const CustomLoadingClient: React.FC = () => {
    return (
        <LoadingContainer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <Lottie
                loop
                play
                animationData={animationData}
                style={{ width: 200, height: 200 }}
            />
            <LoadingText>Preparando CorretorLab para você...</LoadingText>
        </LoadingContainer>
    );
};

export default CustomLoadingClient;
