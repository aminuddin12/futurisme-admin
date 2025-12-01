import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    return (
        <AuthenticatedLayout header="Dashboard Overview">
            <Head title="Dashboard" />

            {/* Statistik Cards */}
            <div className={styles.statsGrid}>
                <div className={`${styles.card} ${styles.cardPrimary}`}>
                    <div className={styles.cardTitle}>Total Users</div>
                    <div className={styles.cardValue}>1,240</div>
                </div>

                <div className={`${styles.card} ${styles.cardSuccess}`}>
                    <div className={styles.cardTitle}>Revenue</div>
                    <div className={styles.cardValue}>$84,200</div>
                </div>

                <div className={`${styles.card} ${styles.cardWarning}`}>
                    <div className={styles.cardTitle}>Pending Issues</div>
                    <div className={styles.cardValue}>23</div>
                </div>

                <div className={`${styles.card} ${styles.cardDanger}`}>
                    <div className={styles.cardTitle}>Errors</div>
                    <div className={styles.cardValue}>5</div>
                </div>
            </div>

            {/* Konten Tambahan */}
            <div className={styles.sectionContainer}>
                <h3 className="fa-text-lg fa-font-medium fa-text-gray-900 fa-mb-4">
                    Aktivitas Terbaru
                </h3>
                <div className="fa-border-t fa-border-gray-200">
                    <p className="fa-py-4 fa-text-gray-600">
                        Belum ada aktivitas yang tercatat hari ini. Modul <strong>Futurisme Admin</strong> berhasil diinstal.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
