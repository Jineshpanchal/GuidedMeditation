import { useRouter } from 'next/router';

export default function MeditationPage() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Meditation: {slug}</h1>
      <div className="mt-4 prose">
        <p>Content for meditation will be loaded here</p>
      </div>
    </div>
  );
} 