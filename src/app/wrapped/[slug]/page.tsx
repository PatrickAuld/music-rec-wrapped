import { notFound } from 'next/navigation';
import data from '../../../data.json';
import { WrappedData } from '../../../types';
import WrappedViewer from '../../../components/WrappedViewer';
import { slugify } from '../../../utils/slugify';

const wrappedData = data as unknown as WrappedData;

function findUserBySlug(slug: string): { name: string; user: typeof wrappedData.users[string] } | null {
  for (const [name, user] of Object.entries(wrappedData.users)) {
    if (slugify(name) === slug) {
      return { name, user };
    }
  }
  return null;
}

// Generate static params for all users
export function generateStaticParams() {
  return Object.keys(wrappedData.users).map((name) => ({
    slug: slugify(name),
  }));
}

// Generate metadata for the page
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { card?: string };
}) {
  const { slug } = params;
  const result = findUserBySlug(slug);

  if (!result) {
    return { title: 'Not Found' };
  }

  const cardParam = Number.parseInt(searchParams?.card ?? '', 10);
  const cardIndex = Number.isFinite(cardParam) ? Math.max(1, Math.min(cardParam, result.user.cards.length)) : 1;
  const imageUrl = `/wrapped/${slug}/opengraph-image?card=${cardIndex}`;
  const title = `${result.name}'s Music Rec Wrapped`;
  const description = `${result.name} sent ${result.user.messages} messages and shared ${result.user.music_links} songs in Music Rec`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl],
      url: `https://music-rec-wrapped.vercel.app/wrapped/${slug}?card=${cardIndex}`,
      siteName: 'Music Rec Wrapped',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function WrappedPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { card?: string };
}) {
  const { slug } = params;
  const result = findUserBySlug(slug);

  if (!result) {
    notFound();
  }

  const initialCard = Number.parseInt(searchParams?.card ?? '', 10);
  const initialCardIndex = Number.isFinite(initialCard) ? Math.max(0, Math.min(result.user.cards.length - 1, initialCard - 1)) : 0;

  return (
    <WrappedViewer
      user={result.user}
      userName={result.name}
      initialCardIndex={initialCardIndex}
    />
  );
}
