# Hosting Your Resume on GitHub Using Pelican

## Purpose

This README describes how to format a resume using a lightweight markup language, such as Markdown, and publish it as a static website on a forge called GitHub using a static site generator called Pelican. It is written for anyone who is comfortable with a lightweight markup language and understands the command line, but has little to no prior experience with Git, static site generators, or forges.

This documentation follows the four core principles Andrew Etter outlines in [*Modern Technical Writing*](https://www.amazon.ca/Modern-Technical-Writing-Introduction-Documentation-ebook/dp/B01A2QL9SS): write content in a lightweight markup language, track it with a distributed version control system, build it with a static site generator, and host it on a forge. Together, these practices produce documentation that is easy to maintain, easy to share, and always up to date.

---

## Prerequisites

> _"It's dangerous to go alone! Take this." — Old Man, The Legend of Zelda_

Before you begin, make sure you have the following:

- A resume written in a lightweight markup language, such as Markdown (`.md` file)
- [Python 3](https://www.python.org/downloads/) installed on your computer
- [Git](https://git-scm.com/downloads) installed on your computer
- A [GitHub](https://github.com) account

---

## Instructions

> _"If you wish to make an apple pie from scratch, you must first invent the universe." — Carl Sagan_

### Step 1: Format your resume in a lightweight markup language like Markdown

Etter recommends using a **lightweight markup language** for all documentation. Markdown keeps content readable as plain text and works seamlessly with version control tools. GitHub renders Markdown natively, making it an ideal choice for this use case.

1. Open your resume in any text editor.
2. Use Markdown syntax to structure your content: `##` for section headings, `-` for bullet points, `**bold**` for emphasis, and `---` for horizontal bars between sections.
3. Save the file with a `.md` extension (e.g., `myCV.md`).

### Step 2: Install Pelican and ghp-import

Etter recommends using a **static site generator**, which transforms Markdown files into a polished, publishable website automatically. Pelican is a Python-based static site generator that reads your `.md` files and configuration file and produces a complete set of HTML pages without having to manually create them.

1. Open your terminal.
2. Install Pelican with Markdown support by running:
```
python -m pip install "pelican[markdown]"
```
3. Install ghp-import, a tool that will publish your generated site to GitHub:
```
python -m pip install ghp-import
```

### Step 3: Create a GitHub repository

Etter recommends using a **distributed version control system (DVCS)** to store and maintain all documentation alongside its corresponding source. A DVCS like Git keeps a full history of every change, letting you roll back mistakes while making your files accessible from anywhere. GitHub is an example of a **forge**, which is a web-based platform that hosts Git repositories and can also display your generated website to the public.

1. Log in to [GitHub](https://github.com).
2. Click **New** to create a new repository.
3. Name the repository `YourUsername.github.io`, replacing `YourUsername` with your exact GitHub username. This specific naming convention tells GitHub to treat the repository as a GitHub Pages site.
4. Set the repository to **Public** and click **Create repository**.

### Step 4: Clone the repository to your computer

1. Open your terminal.
2. Navigate to the directory where you want to store your project using the `cd` command.
3. Run the following command, replacing `YourUsername`:
```
git clone https://github.com/YourUsername/YourUsername.github.io
```
4. Navigate into the new directory, replacing `YourUsername`:
```
cd YourUsername.github.io
```

### Step 5: Set up a Pelican project

1. Run Pelicans setup tool inside your repository folder:
```
pelican-quickstart
```
2. Accept the default answers for all prompts except when asked "Do you want to specify a URL prefix? (Y/n)", answer `Y`, entering `https://YourUsername.github.io`, replacing `YourUsername` with your exact GitHub username. This URL prefix tells Pelican where your site will be hosted, which is necessary for it to generate correct links in the HTML files.
3. Open the generated `pelicanconf.py` file in a text editor and confirm `RELATIVE_URLS = True` is set. This setting tells Pelican to generate relative links, which is necessary for the site to work correctly when hosting locally.

### Step 6: Add your resume to the site

1. Copy your Markdown resume file into the `content/pages/` directory of your Pelican project. You might have to create the `pages` directory within `content` if it does not already exist.
2. Add the following line to the top of your resume file, which allows Pelican to recognize it as a page and generate the appropriate HTML file:
```
Title: My Resume
```
3. Confirm that `DISPLAY_PAGES_ON_MENU = True` is set in `pelicanconf.py`, which tells Pelican to include pages in the site's navigation menu.

### Step 7: Preview the site locally

One of the practical advantages Etter highlights for using a static site generator is the ability to instantly preview your output prior to publishing. This allows you to catch formatting issues and make sure everything looks right before sharing it with the world.

1. In your terminal within the project directory, run the following command to generate the HTML files:
```
pelican content
```
2. Then, run the following command to start a local web server:
```
pelican --listen
```
3. Open your web browser and navigate to `http://127.0.0.1:8000`, where you should see your resume displayed as a web page.
4. Press `Ctrl+C` in the terminal to stop the local web server when you are done previewing.

### Step 8: Publish to GitHub

Etter emphasizes the importance of using a forge to make your documentation accessible and maintainable. Hosting your site on a forge like GitHub allows you to share it with anyone and keep it up to date with your latest changes, all from anywhere with an internet connection.

1. Ensure that all current changes to your project have been built and are ready to be published by running in your terminal:
```
pelican content -s publishconf.py
```
2. Use ghp-import to push the generated site to GitHub:
```
ghp-import output -b main
```
3. Finally, push the changes to GitHub:
```
git push origin main
```
4. After a few moments, your site should be live at `https://YourUsername.github.io`, replacing `YourUsername` with your exact GitHub username.

### Step 9: Commit and push source files to GitHub

It's important to commit and push your source files alongside your generated site to GitHub so that they are backed up and accessible from anywhere.

1. In your terminal, run the following commands to add all changes to Git:
```
git add .
```
2. Commit the changes with a descriptive message:
```
git commit -m "Add Description of Changes"
```
3. Push the changes to GitHub:
```
git push origin main
```

---

## Further Resources

- [Markdown Guide](https://www.markdownguide.org/) - Markdown reference covering syntax
- [Pelican Documentation](https://docs.getpelican.com/en/stable/) - Pelican official documentation
- [Pelican Themes](https://github.com/getpelican/pelican-themes/tree/master) - Pelican themes repository
- [GitHub Pages Documentation](https://docs.github.com/en/pages) - GitHub Pages official documentation

---

## FAQ

**What is a static site generator?**

- A static site generator is a tool that takes content written in a lightweight markup language and generates a complete website as a set of static HTML files. 

Pelican is a static site generator that takes your Markdown files and produces a polished website without requiring you to write any HTML. By using a static site generator, you can focus on writing your content while the tool handles all the presentation and formatting, allowing you to easily maintain and update your resume without needing to worry about the underlying HTML structure.

**What is a forge?**

- A forge is a platform or tool used for creating and managing software projects, often providing features for version control, collaboration, and deployment.

GitHub is an example of a forge that hosts Git repositories and can also serve static websites. By hosting your resume on a forge like GitHub, you can easily share it with others and keep it up to date with your latest changes, which can be especially useful for maintaining and improving your resume over time.

**Why should I use Markdown instead of just writing my resume in HTML?**

Markdown, and other lightweight markup languages, are designed to be readable as plain text without needing to be rendered into HTML. This means you can focus on writing your content rather than worrying about formatting. Etter makes this point directly in *Modern Technical Writing* when he says, "lightweight markup languages let writers concentrate on what they are saying, while the static site generator handles all the presentation."

**How do I see my resume on the live website after editing the Markdown file?**

Editing the `.md` file on your computer does not automatically update the published website. These changes can and should be previewed locally before publishing through running `pelican content` and `pelican --listen`, then visiting `http://127.0.0.1:8000`. 
After making changes to your Markdown file, you need to rebuild and redeploy your site. Run `pelican content -s publishconf.py` to generate the HTML files, and then `ghp-import output -b main` and `git push origin main` to push the changes to GitHub. 

---

## Credits

**Theme:** [Just-Read](https://github.com/getpelican/pelican-themes/tree/master/Just-Read) by Natalia Ventre, [2012 License](https://github.com/getpelican/pelican-themes/blob/master/Just-Read/license.md)

**Static Site Generator:** [Pelican](https://getpelican.com/) by David Megginson, [AGNU Affero General Public License v3.0](https://github.com/getpelican/pelican/blob/main/LICENSE)

**Peer Reviewers:** [Name 1, Name 2]