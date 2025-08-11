import styled from 'styled-components';

export const LegalContainer = styled.main`
    max-width: 920px;
    margin: 0 auto;
    padding: 40px 20px;
    background: #fff;
`;

export const LegalContent = styled.div`
    color: #1f2937;
    font-size: 15.5px;
    line-height: 1.75;

    h1, h2, h3 { color: #042a75; margin: 1.5em 0 .6em; font-weight: 700; }
    h1 { font-size: 28px; }
    h2 { font-size: 22px; }
    h3 { font-size: 18px; }
    p { margin: .9em 0; }

    ul, ol { margin: .8em 0 1.2em 1.25em; }
    li { margin: .35em 0; }

    a { color: #33cccc; text-decoration: none; }
    a:hover { text-decoration: underline; }

    hr { border: 0; border-top: 1px solid #e5e7eb; margin: 28px 0; }
    small { color: #6b7280; }
`;

export const LegalActions = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 16px;

    button {
        border: 1px solid #e5e7eb;
        background: #f9fafb;
        padding: 6px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
    }
    button:hover { background: #f3f4f6; }
`;
