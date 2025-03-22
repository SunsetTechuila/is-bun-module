const blogPage = await fetch("https://bun.sh/blog");
const blogText = await blogPage.text();
const blogRefs = blogText.matchAll(/href="(\/blog\/(bun-v1\.\d+(?:\.\d+)?))"/g);
const blogs = Array.from(blogRefs).map((match) => {
  return {
    link: `https://bun.sh${match[1]}`,
    name: match[2],
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
        return Bun.file(`bun-blogs/${blog.name}.html`).write(text);
      })
      .catch((error) => {
        console.error(error);
      }),
  );
}
await Promise.allSettled(promises);
