import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [isScanning, setIsScanning] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isScanning) {
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();
            }
        } else {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }
    }, [isScanning]);

    const startScanning = () => {
        setIsScanning(true);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    const { data, setData, post, processing, errors } = useForm({
        nfc_card_no: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const nfcValue = inputRef.current?.value;
        if (!nfcValue) {
            toast.error('No NFC card detected!');
            return;
        }
        setData('nfc_card_no', nfcValue);
        post('/link-card', {
            onSuccess: () => {
                toast.success(`Card has been linked to admission number: IESM-123456`);
                console.log('NFC card scanned:', nfcValue);

                setData('nfc_card_no', '');
                if (inputRef.current) inputRef.current.value = '';
                setIsScanning(false);
            },
            onError: (errors) => {
                console.error(errors);
                toast.error(errors.nfc_card_no ?? 'Failed to link card. Please try again.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative flex aspect-video overflow-hidden rounded-xl border">
                        <CardContent className="">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input ref={inputRef} type="text" className="absolute h-0 w-0 opacity-0" autoComplete="off" />

                                <div className="flex flex-col items-center justify-center">
                                    {!isScanning ? (
                                        <Button type="button" onClick={startScanning} size="lg" className="w-full">
                                            Scan NFC Card
                                        </Button>
                                    ) : (
                                        <div className="text-center">
                                            <div className="mb-4">
                                                <video ref={videoRef} autoPlay loop muted playsInline className="mx-auto h-48 w-48">
                                                    <source src={`/assets/lottie/nfc_scan.webm`} type="video/webm" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                            <p className="text-lg font-medium">Please scan your card</p>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setIsScanning(false)}
                                                className="absolute top-2 right-2 p-2"
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Cancel</span>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
