// npm install express body-parser markdown-pdf remarkable-classy

var markdownpdf = require("markdown-pdf"),
    fs = require("fs"),
    concat = require('concat-stream'),
    getRawBody = require('raw-body')

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var options = {
    remarkable: {
        html: true,
        breaks: true,
        plugins: [ require('remarkable-classy') ],
        syntax: [ 'footnote', 'sup', 'sub' ]
    }
}

// First, checks if it isn't implemented yet.
if (!String.prototype.fmt) {
    String.prototype.fmt = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
            ;
        });
    };
}


// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/md' }))

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/plain' }))

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.post('/md2pdf/v1/api', function(req, res) {
    res.set('Content-Type', 'application/pdf');

    // your Markdown
//    console.log("Markdown: ({0}) [{1}]".fmt(req.body.length, req.body));

    markdownpdf(options)
        .from.string(req.body)
        .to.buffer(null, function (er, pdfdata) {
            if(er) {
                console.error("Error [{0}]".format(er));
            }else if(null == pdfdata) {
                console.error("Null PDF file");
            }else{
                console.log("Created pdf: length[{0}]".fmt(pdfdata.length))
                res.type('application/pdf');
                res.end(pdfdata, 'binary');
            }
        })

});

app.listen(process.env.npm_package_config_port);
