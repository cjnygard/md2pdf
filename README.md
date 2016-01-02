# md2pdf

Markdown to PDF conversion server on node.js, POST *.md, retrieve
*.pdf results.

This server is meant to provide services during an automated build
process in order to transform arbitrary Markdown files into equivalent
PDF output.

## Dockerfile

This is a simple Dockerfile which uses the standard Node -onbuild
image to automatically load and run the server.js file.  The server
listens on port 3001 (specified in the package.json file and
modifiable via standard process.env.npm_package_config_port)

## Usage

The server expects the Markdown file to be send to the URL as a POST
command.  The resulting PDF output will be provided as **'Content-Type:
application/pdf'**.

    % curl -v -H "Content-Type: application/md" --data-binary \
    "@README.md" -X POST http://docker:3001/md2pdf/v1/api > README.pdf


## Maven integration

See http://github.com/cjnygard/rest-maven-plugin for an example of a
Maven plugin which performs the REST POST request with Markdown
documentation to transform the output into PDF automatically.
