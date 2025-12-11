import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import styles from './Dashboard.module.css';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

// Konfigurasi animasi container (untuk stagger children)
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

// Konfigurasi animasi item (kartu)
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
    return (
        <AuthenticatedLayout header="Dashboard Overview">
            <Head title="Dashboard" />

            {/* Statistik Cards Grid dengan Animasi Stagger */}
            <motion.div 
                className={styles.statsGrid}
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Card 1 */}
                <motion.div variants={itemVariants} className={`${styles.card} ${styles.cardPrimary}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={styles.cardTitle}>Total Users</div>
                            <div className={styles.cardValue}>1,240</div>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                            <Icon icon="heroicons:users" width="24" height="24" />
                        </div>
                    </div>
                </motion.div>

                {/* Card 2 */}
                <motion.div variants={itemVariants} className={`${styles.card} ${styles.cardSuccess}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={styles.cardTitle}>Revenue</div>
                            <div className={styles.cardValue}>$84,200</div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                            <Icon icon="heroicons:currency-dollar" width="24" height="24" />
                        </div>
                    </div>
                </motion.div>

                {/* Card 3 */}
                <motion.div variants={itemVariants} className={`${styles.card} ${styles.cardWarning}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={styles.cardTitle}>Pending Issues</div>
                            <div className={styles.cardValue}>23</div>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-full text-amber-600">
                            <Icon icon="heroicons:exclamation-triangle" width="24" height="24" />
                        </div>
                    </div>
                </motion.div>

                {/* Card 4 */}
                <motion.div variants={itemVariants} className={`${styles.card} ${styles.cardDanger}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={styles.cardTitle}>Errors</div>
                            <div className={styles.cardValue}>5</div>
                        </div>
                        <div className="p-3 bg-red-50 rounded-full text-red-600">
                            <Icon icon="heroicons:x-circle" width="24" height="24" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Konten Tambahan dengan Animasi Fade In */}
            <motion.div 
                className={styles.sectionContainer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex items-center mb-4">
                    <Icon icon="heroicons:clock" className="text-gray-400 mr-2" width="20" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Aktivitas Terbaru
                    </h3>
                </div>
                
                <div className="border-t border-gray-200">
                    <div className="py-4 text-gray-600 flex items-start gap-3">
                        <div className="mt-1">
                            <Icon icon="heroicons:check-badge" className="text-green-500" width="20" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Instalasi Berhasil</p>
                            <p className="text-sm">Modul <strong>Futurisme Admin</strong> berhasil diinstal dan dikonfigurasi.</p>
                            <p className="text-xs text-gray-400 mt-1">Baru saja</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}