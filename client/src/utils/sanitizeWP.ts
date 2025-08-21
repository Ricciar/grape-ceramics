import DOMPurify from 'dompurify';

export const sanitizeWP = (html: string) =>
  DOMPurify.sanitize(html, {
    ADD_TAGS: ['video', 'source', 'figure', 'figcaption'],
    ADD_ATTR: [
      'src',
      'controls',
      'autoplay',
      'muted',
      'playsinline',
      'loop',
      'poster',
      'preload',
      'type',
    ],
    ALLOW_ARIA_ATTR: true,
    ALLOW_DATA_ATTR: true,
  });
