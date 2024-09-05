"use client"
import React from 'react';
import SimpleNavBar from "@/app/components/common/Header/SimpleNavBar";
import styles from './styles.module.css';

export default function PlanosPage() {
    return (
        <div className={styles.container}>
            <SimpleNavBar />
            {/*<h1>Escolha seu plano</h1>*/}
            <div className={styles.planosContainer}>
                <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
                <stripe-pricing-table pricing-table-id="prctbl_1PtYxURpwSFVPEXY7fb1Htp2"
                                      publishable-key="pk_live_51PYSP5RpwSFVPEXY49LkLi20REHEX6iePoY9g0THJovQ4kSuCvCMsiX9ggO5tTENmWYLr6SwjLDZ5CWYACnCLtyb00VXcBgHsq">
                </stripe-pricing-table>
            </div>
        </div>
    );
}
