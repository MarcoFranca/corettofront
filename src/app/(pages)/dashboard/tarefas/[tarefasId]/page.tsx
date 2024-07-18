'use client';

import styles from './styles.module.css';
import TaskDetail from "@/app/components/todo/TaskDetail";

const TaskDetailPage = () => {

    return (
        <main className={styles.dashboardLayout}>
                <TaskDetail />
        </main>
    );
};

export default TaskDetailPage;
