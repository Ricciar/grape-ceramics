import { WPPost } from '../pages/MainPage/types';

const parseLink = (url: string): string => {
  const match = url.match(/\/product\/([^/]+)/);
  return match ? `/product/${match[1]}` : '/shop';
};

export const extractProductLink = (content: string, post: WPPost): string => {
  const strategies = [
    /<a[^>]+href=["']([^"']+)["'][^>]*>/i,
    /<div class="wp-block-button.*?><a.*?href=["']([^"']+)["'][^>]*>/i,
  ];

  const match = strategies
    .map((regex) => content.match(regex))
    .find((m): m is RegExpMatchArray => !!m && !!m[1]);

  return match ? parseLink(match[1]) : `/post/${post.slug}`;
};
