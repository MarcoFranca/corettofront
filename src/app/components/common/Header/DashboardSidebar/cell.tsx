import styles from "@/app/components/common/Header/DashboardSidebar/styles.module.css";
import Image from "next/image";
import ArrowImage from "../../../../../../public/assets/arrow.png";
export default function Cell(cell: any) {

    return(
        <button onClick={()=> cell.onclick(cell.campo)} className={styles.cell} >
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