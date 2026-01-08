type ContextShape = {
  zip?: string | null;
  carrier?: string | null;
  note?: string;
};

export function logSearchContext(source: string, context: ContextShape) {
  if (process.env.NODE_ENV === 'production') return;
  // Lightweight dev-only console log for manual verification
  // eslint-disable-next-line no-console
  console.info(`[search-context:${source}]`, {
    zip: context.zip || null,
    carrier: context.carrier || null,
    note: context.note,
  });
}

