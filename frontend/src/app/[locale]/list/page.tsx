import { redirect } from 'next/navigation';

export default function ListPage({ params }: { params: { locale: string } }) {
    redirect(`/${params.locale}/create`);
}


