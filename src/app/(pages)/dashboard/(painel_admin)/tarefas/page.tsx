'use client';

import styles from './styles.module.css';
import LeadBoard from "@/app/components/leadBoard/LeadBoard";
import DashboardLayout from "@/app/components/layouts/DashboardLayout";
import TaskList from "@/app/components/todo/TaskList";

const LeadPage = () => {

    return (
                <TaskList />
    );
};

export default LeadPage;
