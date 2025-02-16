import { useRouter, usePathname } from "next/navigation";
import styles from "@/app/components/common/Header/DashboardSidebar/styles.module.css";
import Image from "next/image";
import ArrowImage from "../../../../../../public/assets/pages/leads/arrow.png";

export default function Cell(cell: any) {
    const router = useRouter();
    const pathname = usePathname(); // 🔥 Obtendo o caminho atual

    const handleNavigation = (path: string) => {
        // 🔹 Identifica se já estamos dentro de um cliente e mantém o `clientId`
        const match = pathname.match(/\/dashboard\/cliente\/([^/]+)/);
        const clientId = match ? match[1] : null;

        if (clientId && !path.includes("dashboard/carteira")) {
            const correctedPath = path.replace("cliente/apolice", `cliente/${clientId}`); // Corrige o caminho
            router.push(correctedPath);
        } else {
            router.push(path);
        }
    };

    return (
        <button onClick={() => handleNavigation(cell.url)} className={styles.cell}>
            <Image src={cell.image} alt={cell.alt} className={styles.iconImage} />
            {cell.text}
            <Image src={ArrowImage} alt="arrow" className={styles.arrowImage} />
        </button>
    );
}
