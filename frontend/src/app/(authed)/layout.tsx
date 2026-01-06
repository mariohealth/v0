import { AuthGuard } from '@/components/auth/AuthGuard';

export default function AuthedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthGuard>{children}</AuthGuard>;
}
