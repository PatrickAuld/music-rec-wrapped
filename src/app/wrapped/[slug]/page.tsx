import { notFound } from 'next/navigation';
import data from '../../../data.json';
import { WrappedData } from '../../../types';
import WrappedViewer from '../../../components/WrappedViewer';

const wrappedData = data as unknown as WrappedData;

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

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
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = findUserBySlug(slug);

  if (!result) {
    return { title: 'Not Found' };
  }

  return {
    title: `${result.name}'s Music Rec Wrapped`,
    description: `${result.name} sent ${result.user.messages} messages and shared ${result.user.music_links} songs in Music Rec`,
  };
}

export default async function WrappedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = findUserBySlug(slug);

  if (!result) {
    notFound();
  }

  return <WrappedViewer user={result.user} userName={result.name} />;
}
