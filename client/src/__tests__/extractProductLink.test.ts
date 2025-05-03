import { extractProductLink } from '../utils/extractProductLink';

describe('extractProductLink', () => {
  const fakePost = {
    id: 1,
    title: { rendered: '' },
    content: { rendered: '' },
    excerpt: { rendered: '' },
    slug: 'min-test-post',
    featured_media: 0,
    date: '2023-10-01T12:00:00',
    link: 'https://example.com/min-test-post',
    _links: {
      self: [{ href: 'https://example.com/wp-json/wp/v2/posts/1' }],
      'wp:featuredmedia': [
        { href: 'https://example.com/wp-json/wp/v2/media/0' },
      ],
    },
  };

  it('returnerar produktlänk från <a>-tagg', () => {
    const content = '<a href="/product/mugg-keramik">Se produkt</a>';
    expect(extractProductLink(content, fakePost)).toBe('/product/mugg-keramik');
  });

  it('returnerar produktlänk från wp-block-button', () => {
    const content =
      '<div class="wp-block-button"><a href="/product/vacker-vas">Köp nu</a></div>';
    expect(extractProductLink(content, fakePost)).toBe('/product/vacker-vas');
  });

  it('returnerar /shop för vanlig icke-produktlänk', () => {
    const content = '<a href="https://example.com/om-oss">Läs mer</a>';
    expect(extractProductLink(content, fakePost)).toBe('/shop');
  });

  it('returnerar /shop för wp-block-button med icke-produktlänk', () => {
    const content =
      '<div class="wp-block-button"><a href="/kontakt">Kontakta oss</a></div>';
    expect(extractProductLink(content, fakePost)).toBe('/shop');
  });

  it('returnerar /post/slug om ingen länk hittas alls', () => {
    const content = '<p>Inget här, bara text.</p>';
    expect(extractProductLink(content, fakePost)).toBe('/post/min-test-post');
  });
});
