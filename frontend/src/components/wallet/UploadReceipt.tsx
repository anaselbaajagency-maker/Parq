"use client";

import { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from '../../app/[locale]/tableau-de-bord/wallet/wallet.module.css';

interface UploadReceiptProps {
    onUpload: (file: File) => void;
    isUploading: boolean;
}

export default function UploadReceipt({ onUpload, isUploading }: UploadReceiptProps) {
    const t = useTranslations('Wallet');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (isUploading) return;
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = () => {
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className={styles.uploadContainer}>
            {!file ? (
                <div
                    className={`${styles.dropZone} ${isUploading ? styles.disabled : ''}`}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <div className={styles.uploadIconCircle}>
                        <Upload size={24} />
                    </div>
                    <p className={styles.uploadText}>{t('receipt.click_to_upload')}</p>
                    <p className={styles.uploadSubtext}>JPG, PNG, PDF (Max 5MB)</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        className="hidden"
                        disabled={isUploading}
                    />
                </div>
            ) : (
                <div className="animate-fadeIn">
                    <div className={styles.filePreview}>
                        <FileText size={20} className={styles.fileIcon} />
                        <span className={styles.fileName}>{file.name}</span>
                        <button
                            onClick={() => setFile(null)}
                            className={styles.removeFileBtn}
                            disabled={isUploading}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isUploading}
                        className={`${styles.submitBtn} mt-4`}
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Envoi...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={18} />
                                {t('receipt.confirm_upload')}
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
