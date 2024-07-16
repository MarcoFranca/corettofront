import styles from "@/app/components/common/Header/DashboardSidebar/styles.module.css";
import Image from "next/image";
import ArrowImage from "../../../../../../public/assets/arrow.png";
import {useRouter} from "next/navigation";


export default function Cell(cell: any) {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <button onClick={() => handleNavigation(cell.url)} className={styles.cell}>
            <Image
                src={cell.image}
                alt={cell.alt}
                className={styles.iconImage}
            />
            {cell.text}
            <Image
                src={ArrowImage}
                alt="arrow"
                className={styles.arrowImage}
            />
        </button>
    )
}