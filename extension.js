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

    var ar = text.replace(/>\s{0,}</g,"><")
                    .replace(/</g,"~::~<")
                    .replace(/\s*xmlns\:/g,"~::~xmlns:")
                    .replace(/\s*xmlns\=/g,"~::~xmlns=")
                    .split('~::~'),
        len = ar.length,
        inComment = false,
        deep = 0,
        str = '',
        ix = 0,
        shift = step ? createShiftArr(step) : this.shift;

        for(ix=0;ix<len;ix++) {
            // start comment or <![CDATA[...]]> or <!DOCTYPE //
            if(ar[ix].search(/<!/) > -1) { 
                str += shift[deep]+ar[ix];
                inComment = true; 
                // end comment  or <![CDATA[...]]> //
                if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) { 
                    inComment = false; 
                }
            } else 
            // end comment  or <![CDATA[...]]> //
            if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) { 
                str += ar[ix];
                inComment = false; 
            } else 
            // <elm></elm> //
            if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
                /^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) { 
                str += ar[ix];
                if(!inComment) deep--;
            } else
                // <elm> //
            if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
                str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
            } else 
                // <elm>...</elm> //
            if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
                str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
            } else 
            // </elm> //
            if(ar[ix].search(/<\//) > -1) { 
                str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
            } else 
            // <elm/> //
            if(ar[ix].search(/\/>/) > -1 ) { 
                str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
            } else 
            // <? xml ... ?> //
            if(ar[ix].search(/<\?/) > -1) { 
                str += shift[deep]+ar[ix];
            } else 
            // xmlns //
            if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) { 
                str += shift[deep]+ar[ix];
            } 
            
            else {
                str += ar[ix];
            }
        }
        
    return  (str[0] == '\n') ? str.slice(1) : str;
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
