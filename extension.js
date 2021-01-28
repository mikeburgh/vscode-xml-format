const vscode = require('vscode');

var vkbeautify;

///Following is based on https://github.com/vkiryukhin/vkBeautify
//Extracted the xml format method only.

/**
* vkBeautify - javascript plugin to pretty-print or minify text in XML, JSON, CSS and SQL formats.
*  
* Version - 0.99.00.beta 
* Copyright (c) 2012 Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/vkbeautify/
* 
* MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*/
function createShiftArr(step) {

    var space = '    ';
    
    if ( isNaN(parseInt(step)) ) {  // argument is string
        space = step;
    } else { // argument is integer
        switch(step) {
            case 1: space = ' '; break;
            case 2: space = '  '; break;
            case 3: space = '   '; break;
            case 4: space = '    '; break;
            case 5: space = '     '; break;
            case 6: space = '      '; break;
            case 7: space = '       '; break;
            case 8: space = '        '; break;
            case 9: space = '         '; break;
            case 10: space = '          '; break;
            case 11: space = '           '; break;
            case 12: space = '            '; break;
        }
    }

    var shift = ['\n']; // array of shifts
    for(ix=0;ix<100;ix++){
        shift.push(shift[ix]+space); 
    }
    return shift;
}

function VKBeautify(){
    var settings = vscode.workspace.getConfiguration();
    this.step = settings.editor.insertSpaces ? settings.editor.tabSize : '\t';
    this.shift = createShiftArr( this.step );
};

VKBeautify.prototype.xml = function(text,step) {

    var ar = text.trim()
                    .replace(/</g,"~::~<")
                    //.replace(/(\s)(xmlns[:=])/g,"$1~::~$2")
                    .split('~::~'),
        len = ar.length,
        inComment = false,
        inCDATA = false,
        deep_real = 0,
        deep = 0,
        str = '',
        ix = 0,
        shift = step ? createShiftArr(step) : this.shift;

        for(ix=0;ix<len;ix++) {
            // in comment //
            if(inComment) {
                str += ar[ix];
                // end comment //
                if(ar[ix].search(/-->/) > -1) {
                    inComment = false;
                }
            }
            // in <![CDATA[...]]> //
            else if(inCDATA) {
                str += ar[ix];
                // end <![CDATA[...]]> //
                if(ar[ix].search(/\]\]>/) > -1) {
                    inCDATA = false;
                }
            }
            // start comment //
            else if(ar[ix].search(/<!--/) > -1) {
                str = str.trim()+shift[deep]+ar[ix];
                inComment = true;
                // end comment //
                if(ar[ix].search(/-->/) > -1) {
                    inComment = false;
                }
            }
            // end comment //
            else if(ar[ix].search(/-->/) > -1) {
                str += ar[ix];
                inComment = false;
            }
            // start <![CDATA[...]]> //
            else if(ar[ix].search(/<!\[CDATA\[/) > -1) {
                str = str.trim()+shift[deep]+ar[ix];
                inCDATA = true;
                // end <![CDATA[...]]> //
                if(ar[ix].search(/\]\]>/) > -1) {
                    inCDATA = false;
                }
            }
            // end <![CDATA[...]]> //
            else if(ar[ix].search(/\]\]>/) > -1) {
                str += ar[ix];
                inCDATA = false;
            }
            // <!DOCTYPE //
            else if(ar[ix].search(/<!/) > -1) {
                str = str.trim()+shift[deep]+ar[ix];
            }
            // <?xml //
            else if(ar[ix].search(/<\?/) > -1) {
                str = str.trim()+shift[deep]+ar[ix];
            }
            // <elm></elm> //
            else if( ix > 0 &&
                /^<\/[^<>!?\/\s]/.exec(ar[ix]) && /^<[^<>!?\/\s]/.exec(ar[ix-1]) &&
                /^<\/[^<>!?\/\s]+/.exec(ar[ix])[0].replace('/','') == /^<[^<>!?\/\s]+/.exec(ar[ix-1])[0] ) {
                if(deep_real > 0) deep_real--;
                if(deep_real <= 100) deep = deep_real;
                str += ar[ix];
            }
            // </elm> //
            else if(ar[ix].search(/<\//) > -1) {
                if(deep_real > 0) deep_real--;
                if(deep_real <= 100) deep = deep_real;
                str = str.trim()+shift[deep]+ar[ix];
            }
            // <elm> or <elm/> //
            else if(ar[ix].search(/<[^<>!?\/\s]/) > -1) {
                str = str.trim()+shift[deep]+ar[ix];
                deep_real++;
                // <elm/> //
                if(ar[ix].search(/\/>/) > -1) {
                    deep_real--;
                }
                if(deep_real <= 100) deep = deep_real;
            }
            // xmlns //
            //else if(ar[ix].search(/xmlns[:=]/) > -1) {
            //    str = str.trim()+shift[deep]+ar[ix];
            //}

            else {
                str += ar[ix];
            }
        }

    return str.trim();
}

function updateVKBeautify()
{
    vkbeautify = new VKBeautify();
}

updateVKBeautify();

 //Build a range of the entire document!
function getRange(document) { 

    return new vscode.Range(
        // line 0, char 0:
        0, 0,
        // last line:
        document.lineCount - 1,
        // last character:
        document.lineAt( document.lineCount - 1 ).range.end.character
    )
}

// this method is called when your extension is activated
function activate( context )
{

    var disposableXML = vscode.languages.registerDocumentFormattingEditProvider( { language: 'xml' }, {
        provideDocumentFormattingEdits: function( document )
        {
            return [ vscode.TextEdit.replace( getRange(document), vkbeautify.xml( document.getText() ) ) ]
        }
    } );
    vscode.workspace.onDidChangeConfiguration( updateVKBeautify, this, context.subscriptions );
    context.subscriptions.push( disposableXML );

    var disposableXSL = vscode.languages.registerDocumentFormattingEditProvider( { language: 'xsl' }, {
        provideDocumentFormattingEdits: function( document )
        {
            return [ vscode.TextEdit.replace( getRange(document), vkbeautify.xml( document.getText() ) ) ]
        }
    } );
    vscode.workspace.onDidChangeConfiguration( updateVKBeautify, this, context.subscriptions );
    context.subscriptions.push( disposableXSL );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate()
{
}
exports.deactivate = deactivate;
