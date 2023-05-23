export default `
mark-applier - compile markdown to HTML
usage: mark-applier [options]
options:
  -h / --help: Show this text

  -i / --input: Input file path (when omitted, reads from STDIN)
  -o / --output: Output file path (when omitted, prints to STDOUT)

  --title: Set page title. Alternatively, use yml frontmatter 'title' key
  --origin: Set page origin (scheme and domain, eg 'https://example.com'). Alternatively, use yml frontmatter 'origin' key

  --raw: Output raw HTML document fragment instead of entire document
  --css: Output CSS stylesheet instead of HTML (input is ignored)

examples:
  # Create README.html page from README.md
  mark-applier -i README.md -o README.html

  # Same as above, but using stdio instead of filenames
  cat README.md | mark-applier > README.html

  # Output a raw HTML document fragment, which you can put into your own page. NOTE: to use mark-applier's CSS styles, put raw fragments in an element with "markdown-body" class.
  mark-applier --raw -i README.md -o README.html

  # Output CSS suitable for styling raw HTML document fragments created by mark-applier, so you can add put it into your own page
  mark-applier --css > styles.css

For more info, check the GitHub repo: https://github.com/suchipi/mark-applier
`.trim();
