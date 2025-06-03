import React from "react";


export const chatStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%"
};

export const msgRow: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 12
};

export const sidebarStyle: React.CSSProperties = {
    width: 230,
    background: "#f8fafc",
    borderRight: "1px solid #eee",
    height: "100%",
    overflow: "auto",
    padding: 10
};

export const userMsg: React.CSSProperties = {
    background: "#e0e7ef",
    padding: 12,
    borderRadius: 12,
    maxWidth: "70%"
};

export const assistantMsg: React.CSSProperties = {
    background: "#fff",
    padding: 12,
    borderRadius: 12,
    maxWidth: "70%",
    border: "1px solid #e0e7ef"
};