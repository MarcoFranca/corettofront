'use client'
import { LegalActions, LegalContainer, LegalContent } from "../terms_of_service/Legal.styles";
import dpaHtml from "@/app/legal/text/dpa_v1";

export default function Page() {
    const onPrint = () => window.print();
    return (
        <LegalContainer>
            <LegalActions>
                <button onClick={onPrint}>Imprimir</button>
            </LegalActions>
            <LegalContent dangerouslySetInnerHTML={{ __html: dpaHtml }} />
        </LegalContainer>
    );
}
