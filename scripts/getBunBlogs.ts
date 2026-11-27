const blogPage = await fetch("https://bun.com/blog");
const blogText = await blogPage.text();
const blogRefs = blogText.matchAll(/href="\/blog\/(bun-v1\.\d+(?:\.\d+)?)"/gu);
const blogs = Array.from(blogRefs).map((match) => {
  return {
    link: `https://bun.com/blog/${match[1]}.md`,
    name: match[1],
  };
});

const promises = [];
for (const blog of blogs) {
  promises.push(
    fetch(blog.link)
      .then((result) => {
        if (!result.ok) {
          throw new Error(`Failed to fetch blog: ${blog.link}`);
        }
        return result.text();
      })
      .then((text) => {
        return Bun.file(`bun-blogs/${blog.name}.md`).write(text);
      })
      .catch((error) => {
        console.error(error);
      }),
  );
}
await Promise.allSettled(promises);
