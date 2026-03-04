# Hosting Your Resume on GitHub Using Pelican

## Purpose

This README describes how to format a resume using a lightweight markup language, such as Markdown, and publish it as a static website on forge called GitHub using a static site generator called Pelican. It is written for anyone who is comfortable with a lightweight markup language and has basic understanding of the command line, but has little to no prior experience with Git, static site generators, or forges.

This documentation follows the four core principles Andrew Etter outlines in *Modern Technical Writing*: write content in a lightweight markup language, track it with a distributed version control system, build it with a static site generator, and host it on a forge. Together, these practices produce documentation that is easy to maintain, easy to share, and always up to date.

---

## Prerequisites

_"It's dangerous to go alone! Take this." — Old Man, The Legend of Zelda_

Before you begin, make sure you have the following:

- A resume written in a lightweight markup language, such as Markdown (`.md` file)
- [Python 3](https://www.python.org/downloads/) installed on your computer
- [Git](https://git-scm.com/downloads) installed on your computer
- A [GitHub](https://github.com) account

---

## Instructions



---

## Further Resources

- [Markdown Guide](https://www.markdownguide.org/) - A Markdown reference covering syntax
- [Pelican Documentation](https://docs.getpelican.com/en/stable/) - Official documentation for Pelican static site generator
- [Pelican Themes](https://github.com/getpelican/pelican-themes/tree/master) - GitHub collection of themes for Pelican
- [GitHub Pages Documentation](https://docs.github.com/en/pages) - Official documentation for GitHub Pages hosting

---

## FAQ

**Why should I use Markdown instead of just writing my resume in HTML?**

Markdown, and other lightweight markup languages, are designed to be readable as plain text without needing to be rendered into HTML. This means you can focus on writing your content rather than worrying about formatting. Etter makes this point directly in *Modern Technical Writing* when he says "lightweight markup leanguages let writers concentrate on what they are saying, while the static site generator handles all the presentation."

**How do I see my resume on the live website after editing the Markdown file?**

Editing the `.md` file on your computer does not automatically update the published website. These changes can and should be previewed locally before publishing through running `pelican content` and `pelican --listen`, then visiting `http://127.0.0.1:8000`. 
After making changes to your Markdown file, you need to run rebuild and redploy your site using Pelican and ghp-import. Run `pelican content -s publishconf.py` to generate the HTML files, and then `ghp-import output -b main` and `git push origin main` to push the changes to GitHub. 

---

## Credits

**Theme:** [Just-Read](https://github.com/getpelican/pelican-themes/tree/master/Just-Read) by Natalia Ventre, used under the [2012 License](https://github.com/getpelican/pelican-themes/blob/master/Just-Read/license.md)

**Static Site Generator:** [Pelican](https://getpelican.com/) by David Megginson, used under the [AGNU Affero General Public License v3.0](https://github.com/getpelican/pelican/blob/main/LICENSE)

**Peer Reviewers:** [Name 1, Name 2]

