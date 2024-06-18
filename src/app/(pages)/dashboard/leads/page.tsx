import LeadBoard from "@/app/components/leadBoard/LeadBoard";
import styles from "@/app/(pages)/dashboard/styles.module.css";
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import DashboardHeader from "@/app/components/common/Header/NavBarDashboard";
import React from "react";

export default function Leads (){
    return(
        <>
            <div className={styles.dashboardLayout}>
                <DashboardSidebar/>
                <div className={styles.canva}>
                    <DashboardHeader/>
                    <main className={styles.mainContent}>
                        <LeadBoard/>
                    </main>
                </div>
            </div>
        </>
    )
}