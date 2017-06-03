import articles from '../articles';

const opts = {
  title: 'fand/webgl-study',
  description: 'Studies for WebGL, GLSL, Three.js, etc.',
  feedUrl: 'https://fand.github.io/webgl-study/rss.xml',
  siteUrl: 'https://fand.github.io/webgl-study',
  imageUrl: 'https://fand.github.io/webgl-study/images/icon.png',
  author: 'Takayosi Amagi',
  email: 'fand.gmork@gmail.com',
  copyright: '2017 Takayosi Amagi',
  language: 'ja',
  categories: 'article',
  lastBuildDate: new Date().toUTCString(),
};

const items = articles.map(article => {
  return {
    title:  article.title,
    description: article.description,
    url: `http://fand.github.io/webgl-study?id=${article.id}`,
    categories: article.categories,
    date: article.date.toUTCString(),
    enclosure: {
      url: `https://fand.github.io/webgl-study/thumbnails/${article.id}.frag.png`,
      type: 'image/png',
    },
  };
});

// disable-tslint
console.log(`
<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>
      <![CDATA[${opts.title}]]>
    </title>
    <description>
      <![CDATA[${opts.description}]]>
    </description>
    <link>${opts.siteUrl}</link>
    <atom:link href="${opts.feedUrl}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${opts.lastBuildDate}</lastBuildDate>
    <copyright><![CDATA[${opts.copyright}]]></copyright>
    <managingEditor>${opts.email} (${opts.author})</managingEditor>
    <webMaster>${opts.email} (${opts.author})</webMaster>
    ${items.map(item => `
      <item>
        <title><![CDATA[${item.title}]]></title>
        <description><![CDATA[${item.description}]]></description>
        <link>${item.url}</link>
        <guid isPermaLink="true">${item.url}</guid>
        <dc:creator><![CDATA[${opts.author}]]></dc:creator>
        ${item.categories.map(c => `<category>${c}</category>`).join('\n')}
        <pubDate>${item.date}</pubDate>
        <enclosure url="${item.enclosure.url}" length="0" type="${item.enclosure.type}"/>
      </item>
    `).join('')}
  </channel>
</rss>
`);
