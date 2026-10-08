import { config, collection, singleton, fields } from '@keystatic/core';

const cloudProject = import.meta.env.PUBLIC_KEYSTATIC_CLOUD_PROJECT as string | undefined;

const img = (dir: string) =>
  ({ directory: `public/uploads/${dir}`, publicPath: `/uploads/${dir}/` }) as const;

export default config({
  storage: cloudProject ? { kind: 'cloud' } : { kind: 'local' },
  ...(cloudProject ? { cloud: { project: cloudProject } } : {}),
  ui: { brand: { name: 'Kezah Kayitesi, site editor' } },

  singletons: {
    site: singleton({
      label: 'Site settings (hero, bio, contact, headings)',
      path: 'content/site',
      format: 'json',
      schema: {
        heroEyebrow: fields.text({ label: 'Small line above the headline' }),
        heroLine1: fields.text({ label: 'Headline, line 1' }),
        heroLine2: fields.text({ label: 'Headline, line 2' }),
        heroLine3Plain: fields.text({ label: 'Headline, line 3 (plain part)' }),
        heroLine3Accent: fields.text({ label: 'Headline, line 3 (coloured part)' }),
        heroLine4: fields.text({ label: 'Headline, line 4' }),
        heroIntro: fields.text({ label: 'Paragraph under the headline', multiline: true }),
        primaryCta: fields.text({ label: 'Main button text' }),
        primaryCtaNote: fields.text({ label: 'Small note under the main button' }),
        portrait: fields.image({ label: 'Portrait photo', ...img('portrait') }),
        portraitCaption: fields.text({ label: 'Portrait caption' }),
        email: fields.text({ label: 'Public email' }),
        phone: fields.text({ label: 'Public phone (as shown)' }),
        phoneLink: fields.text({ label: 'Phone for tapping (e.g. +250781889592)' }),
        calendarUrl: fields.url({ label: 'Booking calendar link (Cal.com)' }),
        bookingTitle: fields.text({ label: 'Booking heading' }),
        bookingText: fields.text({ label: 'Booking explanation', multiline: true }),
        formEndpoint: fields.url({ label: 'Enquiry form address (Formspree). Leave empty to send by email app.' }),
        bioShort: fields.text({ label: 'Bio, About section', multiline: true }),
        bioHeading: fields.text({ label: 'Bio, one-line statement' }),
        cvPdf: fields.file({ label: 'CV (PDF)', directory: 'public/uploads/files', publicPath: '/uploads/files/' }),
        bioPdf: fields.file({ label: 'One-page bio (PDF)', directory: 'public/uploads/files', publicPath: '/uploads/files/' }),
        metaDescription: fields.text({ label: 'Search and share description', multiline: true }),
        shareImage: fields.image({ label: 'Share image (1200 by 630)', ...img('portrait') }),
        offersHeading: fields.text({ label: 'Offers heading' }),
        offersCta: fields.text({ label: 'Offers closing line' }),
        workHeading: fields.text({ label: 'Work heading' }),
        methodHeading: fields.text({ label: 'Method heading' }),
        methodIntro: fields.text({ label: 'Method intro', multiline: true }),
        whyHeading: fields.text({ label: 'Why heading' }),
        whyIntro: fields.text({ label: 'Why paragraph', multiline: true }),
        writingHeading: fields.text({ label: 'Writing heading' }),
        writingIntro: fields.text({ label: 'Writing intro' }),
        contactHeading: fields.text({ label: 'Contact heading' }),
        blindSpots: fields.array(
          fields.object({
            number: fields.text({ label: 'Number' }),
            text: fields.text({ label: 'What it means', multiline: true }),
            source: fields.text({ label: 'Source or venture' }),
          }),
          { label: 'Blind spots, measured', itemLabel: (p) => p.fields.number.value },
        ),
        methodStages: fields.array(
          fields.object({
            name: fields.text({ label: 'Stage name' }),
            what: fields.text({ label: 'What happens', multiline: true }),
            out: fields.text({ label: 'What you get', multiline: true }),
          }),
          { label: 'Method stages', itemLabel: (p) => p.fields.name.value },
        ),
        ribbonWords: fields.array(fields.text({ label: 'Word' }), { label: 'Second ribbon words', itemLabel: (p) => p.value }),
        whyRows: fields.array(
          fields.object({
            line: fields.text({ label: 'The person', multiline: true }),
            venture: fields.text({ label: 'Venture' }),
            link: fields.text({ label: 'Link (e.g. /work/bev-digital)' }),
          }),
          { label: 'Why rows', itemLabel: (p) => p.fields.venture.value },
        ),
        metrics: fields.array(
          fields.object({
            value: fields.number({ label: 'Number', validation: { isRequired: true } }),
            prefix: fields.text({ label: 'Before the number (e.g. $)' }),
            suffix: fields.text({ label: 'After the number (e.g. M, B, %)' }),
            decimals: fields.integer({ label: 'Decimal places (0, 1 or 2)', defaultValue: 0 }),
            plus: fields.checkbox({ label: 'Add a + after it' }),
            label: fields.text({ label: 'Label', multiline: true }),
          }),
          { label: 'Impact numbers', itemLabel: (p) => p.fields.label.value.slice(0, 50) },
        ),
        metricsNote: fields.text({ label: 'Note under the impact numbers (what they are, sources)', multiline: true }),
        credentials: fields.array(fields.text({ label: 'Credential', multiline: true }), { label: 'Credentials', itemLabel: (p) => p.value.slice(0, 40) }),
        footerLine: fields.text({ label: 'Footer line' }),
      },
    }),
  },

  collections: {
    caseStudies: collection({
      label: 'Case studies and decks',
      slugField: 'title',
      path: 'content/case-studies/*',
      format: 'json',
      schema: {
        title: fields.slug({ name: { label: 'Project name' } }),
        order: fields.integer({ label: 'Order on the page (1 = first)', defaultValue: 10 }),
        featured: fields.checkbox({ label: 'Show on the home page', defaultValue: true }),
        sector: fields.text({ label: 'Sector (used for the filter buttons)' }),
        geography: fields.text({ label: 'Geography' }),
        method: fields.text({ label: 'Method (how I worked)' }),
        oneLine: fields.text({ label: 'One-line summary (card)', multiline: true }),
        outcome: fields.text({ label: 'One-line outcome or lead sentence (case-study page)', multiline: true }),
        status: fields.text({ label: 'Status, stated exactly (e.g. Submitted for ministerial review)' }),
        clientName: fields.text({ label: 'Client or partner shown publicly (optional)' }),
        confidentiality: fields.text({ label: 'Confidentiality note (optional)' }),
        role: fields.text({ label: 'My role' }),
        cover: fields.image({ label: 'Deck cover image (first slide, 16 by 9)', ...img('covers') }),
        deckStyle: fields.select({
          label: 'Deck style (label on the cover frame)',
          options: [
            { label: 'Editorial research', value: 'editorial' },
            { label: 'Dark green technical', value: 'green' },
            { label: 'Navy and gold', value: 'navy' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'editorial',
        }),
        deckStyleLabel: fields.text({ label: 'Style label shown (optional, overrides the default)' }),
        deckSlides: fields.integer({ label: 'Number of slides (optional)' }),
        canvaUrl: fields.url({ label: 'Canva share link (if the deck lives in Canva)' }),
        canvaDesignId: fields.text({ label: 'Canva design ID (reference only)' }),
        pdf: fields.file({ label: 'Deck PDF (upload)', directory: 'public/uploads/files', publicPath: '/uploads/files/' }),
        metrics: fields.array(
          fields.object({ value: fields.text({ label: 'Number' }), label: fields.text({ label: 'What it is' }) }),
          { label: 'Three headline numbers', itemLabel: (p) => p.fields.value.value },
        ),
        aha: fields.text({ label: 'The insight (aha)', multiline: true }),
        hypothesis: fields.text({ label: 'Hypothesis', multiline: true }),
        validation: fields.text({ label: 'Validation', multiline: true }),
        concept: fields.text({ label: 'The concept (separate paragraphs with a blank line)', multiline: true }),
        evidence: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            value: fields.text({ label: 'Value' }),
            note: fields.text({ label: 'Note' }),
          }),
          { label: 'Evidence', itemLabel: (p) => p.fields.label.value },
        ),
        lessons: fields.text({ label: 'Lessons', multiline: true }),
        seoDescription: fields.text({ label: 'Search description', multiline: true }),
      },
    }),

    articles: collection({
      label: 'Articles, essays and poems',
      slugField: 'title',
      path: 'content/articles/*',
      format: 'json',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        type: fields.select({
          label: 'Type',
          options: [
            { label: 'Article', value: 'Article' },
            { label: 'Essay', value: 'Essay' },
            { label: 'Poem', value: 'Poem' },
          ],
          defaultValue: 'Essay',
        }),
        series: fields.text({ label: 'Series (optional, e.g. The Rim Years)' }),
        gist: fields.text({ label: 'One-line gist', multiline: true }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (p) => p.value }),
        body: fields.text({ label: 'Text (separate paragraphs with a blank line). Leave empty if you link elsewhere.', multiline: true }),
        externalUrl: fields.url({ label: 'Link to read it elsewhere (optional)' }),
        show: fields.checkbox({ label: 'Show on the site', defaultValue: true }),
      },
    }),

    logos: collection({
      label: 'Logos',
      slugField: 'organisation',
      path: 'content/logos/*',
      format: 'json',
      schema: {
        organisation: fields.slug({ name: { label: 'Organisation' } }),
        file: fields.image({ label: 'Logo file', ...img('logos') }),
        relationship: fields.text({ label: 'Relationship (e.g. Employer, Programme)' }),
        show: fields.checkbox({ label: 'Show on the site', defaultValue: true }),
        order: fields.integer({ label: 'Order', defaultValue: 10 }),
      },
    }),

    testimonials: collection({
      label: 'Testimonials',
      slugField: 'name',
      path: 'content/testimonials/*',
      format: 'json',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        quote: fields.text({ label: 'Quote', multiline: true }),
        role: fields.text({ label: 'Role' }),
        organisation: fields.text({ label: 'Organisation' }),
        show: fields.checkbox({ label: 'Show on the site', defaultValue: true }),
      },
    }),

    offers: collection({
      label: 'Offers',
      slugField: 'name',
      path: 'content/offers/*',
      format: 'json',
      schema: {
        name: fields.slug({ name: { label: 'Offer name' } }),
        order: fields.integer({ label: 'Order (1 = first)', defaultValue: 10 }),
        who: fields.text({ label: 'Who it is for' }),
        problem: fields.text({ label: 'The problem', multiline: true }),
        get: fields.text({ label: 'What they get', multiline: true }),
        timeframe: fields.text({ label: 'Timeframe' }),
      },
    }),
  },
});
