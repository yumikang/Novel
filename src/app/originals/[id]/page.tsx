'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { getOriginalWork } from '@/lib/store'; // Removed
import { OriginalWork } from '@/lib/types';
import { OriginalDetailView } from '@/components/original/original-detail-view';
import { Loader2 } from 'lucide-react';

export default function OriginalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [work, setWork] = useState<OriginalWork | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWork = async () => {
            if (params.id) {
                const id = Array.isArray(params.id) ? params.id[0] : params.id;
                try {
                    const res = await fetch(`/api/originals/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setWork(data);
                    } else {
                        alert('원작을 찾을 수 없습니다.');
                        router.push('/originals');
                    }
                } catch (e) {
                    console.error(e);
                    alert('오류가 발생했습니다.');
                    router.push('/originals');
                }
                setLoading(false);
            }
        };

        fetchWork();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!work) return null;

    return <OriginalDetailView work={work} />;
}
