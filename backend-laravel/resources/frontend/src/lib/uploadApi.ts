import { API_BASE_URL } from '@/lib/api';

export async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData, // No Content-Type header needed, browser sets it
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Upload Error:', error);
        return null;
    }
}
