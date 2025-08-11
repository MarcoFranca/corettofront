'use client'
import { LegalActions, LegalContainer, LegalContent } from "../terms_of_service/Legal.styles";
import privacyHtml from "@/app/legal/text/privacy_v1";

export default function Page() {
    const onPrint = () => window.print();
    return (
        <LegalContainer>
            <LegalActions>
                <button onClick={onPrint}>Imprimir</button>
            </LegalActions>
            <LegalContent dangerouslySetInnerHTML={{ __html: privacyHtml }} />
        </LegalContainer>
    );
}
