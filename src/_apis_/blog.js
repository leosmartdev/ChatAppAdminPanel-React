import { random } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { paramCase } from 'change-case';
// utils
import mock from './mock';
// utils
import mockData from '../utils/mock-data';

// ----------------------------------------------------------------------

// Made with React Quill
const POST_BODY = `

<h1>Heading H1</h1><br/>
<h2>Heading H2</h2><br/>
<h3>Heading H3</h3><br/>
<h4>Heading H4</h4><br/>
<h5>Heading H5</h5><br/>
<h6>Heading H6</h6><br/>

<hr>
<h3>Paragraph</h3><br/>
<p>What is MTAweb Directory?</p><p><br></p><p>So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p><p><br></p><p>With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to MTAweb.com, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>
<br/>
<p><strong>This is strong text.</strong></p>
<p><em>This is italic text</em></p>
${
  /* eslint-disable-next-line */
  `<p><u>This is underline text</u><span class=\"ql-cursor\">﻿</span></p>`
}

<hr>
<h3>Unordered list</h3><br/>
${
  /* eslint-disable */
  `<ul>
	<li>Implements&nbsp;&nbsp;
		<a href=\"#" rel=\"noopener noreferrer\" target=\"_blank\">GitHub Flavored Markdown</a>
	</li>
	<li>Renders actual, \"native\" React DOM elements</li>
	<li>Allows you to escape or skip HTML (try toggling the checkboxes above)</li>
	<li>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</li>
</ul>
`
}

<hr>
<h3>Ordered list</h3><br/>
<ol>
	<li>Analysis</li>
	<li>Design</li>
	<li>Implementation</li>
</ol>

<hr>
<h3>Blockquote</h3><br/>
<blockquote>Life is short, Smile while you still have teeth!&nbsp;</blockquote>

<hr>
<h3>Block Code</h3><br/>
${
  /* eslint-disable-next-line */
  `<pre class=\"ql-syntax\" spellcheck=\"false\">cd project-folder\nnpm install\n</pre>`
}

<br/>
<br/>

${
  /* eslint-disable-next-line */
  `<pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-keyword\">var</span> React = <span class=\"hljs-built_in\">require</span>(<span class=\"hljs-string\">'react'</span>);\n<span class=\"hljs-keyword\">var</span> Markdown = <span class=\"hljs-built_in\">require</span>(<span class=\"hljs-string\">'react-markdown'</span>);\n\nReact.render(\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">Markdown1</span> <span class=\"hljs-attr\">source</span>=<span class=\"hljs-string\">\"# Your markdown here\"</span> /&gt;</span>,\n  <span class=\"hljs-built_in\">document</span>.getElementById(<span class=\"hljs-string\">'content'</span>)\n);\n</pre>`
}

<br/>
<br/>

${
  /* eslint-disable-next-line */
  `<pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">createStyleObject</span>(<span class=\"hljs-params\">classNames, style</span>) </span>{\n  <span class=\"hljs-keyword\">return</span> classNames.reduce(<span class=\"hljs-function\">(<span class=\"hljs-params\">styleObject, className</span>) =&gt;</span> {\n   <span class=\"hljs-keyword\">return</span> {...styleObject, ...style[className]};\n  }, {});\n }\n</pre>`
}

<br/>
<br/>

<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p><br></p><p>Why do we use it?</p><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>

<br/>
<br/>

<p>
<img src='https://res.cloudinary.com/trinhmai/image/upload/c_scale,w_1440/v1611411340/upload_minimal/covers/cover_6.jpg'/>
</p>


<br/>
<br/>

<p>
It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.
</p>

<br/>
<br/>

<p>
<img src='https://res.cloudinary.com/trinhmai/image/upload/c_scale,w_1440/v1611411339/upload_minimal/covers/cover_4.jpg'/>
</p>

`;

export const users = [...Array(12)].map((_, index) => {
  return {
    id: mockData.id(index),
    name: mockData.name.fullName(index),
    avatarUrl: mockData.image.avatar(index)
  };
});

const POST_COMMENTS = [
  {
    id: uuidv4(),
    name: users[0].name,
    avatarUrl: users[0].avatarUrl,
    message: mockData.text.sentence(1),
    postedAt: mockData.time(1),
    users: [users[0], users[1], users[2]],
    replyComment: [
      {
        id: uuidv4(),
        userId: users[1].id,
        message: mockData.text.sentence(2),
        postedAt: mockData.time(2)
      },
      {
        id: uuidv4(),
        userId: users[0].id,
        message: mockData.text.sentence(3),
        tagUser: users[1].name,
        postedAt: mockData.time(3)
      },
      {
        id: uuidv4(),
        userId: users[2].id,
        message: mockData.text.sentence(4),
        postedAt: mockData.time(4)
      }
    ]
  },
  {
    id: uuidv4(),
    name: users[4].name,
    avatarUrl: users[4].avatarUrl,
    message: mockData.text.sentence(5),
    postedAt: mockData.time(5),
    users: [users[5], users[6], users[7]],
    replyComment: [
      {
        id: uuidv4(),
        userId: users[5].id,
        message: mockData.text.sentence(6),
        postedAt: mockData.time(6)
      },
      {
        id: uuidv4(),
        userId: users[6].id,
        message: mockData.text.sentence(7),
        postedAt: mockData.time(7)
      },
      {
        id: uuidv4(),
        userId: users[7].id,
        message: mockData.text.sentence(8),
        postedAt: mockData.time(8)
      }
    ]
  },
  {
    id: uuidv4(),
    name: users[8].name,
    avatarUrl: users[8].avatarUrl,
    message: mockData.text.sentence(9),
    postedAt: mockData.time(9),
    users: [],
    replyComment: []
  },
  {
    id: uuidv4(),
    name: users[9].name,
    avatarUrl: users[9].avatarUrl,
    message: mockData.text.sentence(10),
    postedAt: mockData.time(10),
    users: [],
    replyComment: []
  }
];

export const posts = [...Array(23)].map((_, index) => {
  return {
    id: mockData.id(index),
    cover: mockData.image.cover(index),
    title: mockData.text.title(index),
    description: mockData.text.sentence(index),
    createdAt: mockData.time(index),
    view: random(9999),
    comment: random(9999),
    share: random(9999),
    favorite: random(9999),
    author: {
      name: mockData.name.fullName(index),
      avatarUrl: mockData.image.avatar(index)
    },
    tags: ['Lamp', 'A man', 'Human', 'Lantern', 'Festival'],
    body: POST_BODY,
    favoritePerson: [...Array(40)].map((_, index) => {
      return {
        name: mockData.name.fullName(index),
        avatarUrl: mockData.image.avatar(index)
      };
    }),
    comments: POST_COMMENTS
  };
});

// ----------------------------------------------------------------------

mock.onGet('/api/blog/posts/all').reply(200, { posts });

// ----------------------------------------------------------------------

mock.onGet('/api/blog/posts').reply((config) => {
  try {
    const { index, step } = config.params;
    const maxLength = posts.length;
    const loadMore = index + step;

    const sortPosts = [...posts].sort((a, b) => {
      return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
    });

    const results = sortPosts.slice(0, loadMore);

    return [200, { results, maxLength }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});

// ----------------------------------------------------------------------

mock.onGet('/api/blog/post').reply((config) => {
  try {
    const { title } = config.params;
    const post = posts.find((_post) => paramCase(_post.title) === title);

    if (!post) {
      return [404, { message: 'Post not found' }];
    }

    return [200, { post }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});

// ----------------------------------------------------------------------

mock.onGet('/api/blog/posts/recent').reply((config) => {
  try {
    const { title } = config.params;

    const recentPosts = posts.filter((_post) => paramCase(_post.title) !== title).slice(posts.length - 5, posts.length);

    if (!recentPosts) {
      return [404, { message: 'Post not found' }];
    }

    return [200, { recentPosts }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});

// ----------------------------------------------------------------------

mock.onGet('/api/blog/posts/search').reply((config) => {
  try {
    const { query } = config.params;
    const cleanQuery = query.toLowerCase().trim();
    const results = [];

    posts.forEach((post) => {
      if (!query) {
        return results.push(post);
      }

      if (post.title.toLowerCase().includes(cleanQuery)) {
        return results.push(post);
      }
    });

    return [200, { results }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});
