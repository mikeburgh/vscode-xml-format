# XML Format

Format XML documents, without changing the content within elements.

## Features

This extension uses a modified version of [vkBeautify](https://github.com/vkiryukhin/vkBeautify) for xml formating.

vkBeautify does not change the formatting of content within elements (eg line breaks, tabs etc) when formatting the document.

Before:

```xml
<a><b>content
more content
    some more content</b></a>
```

After:

```xml
<a>
	<b>content
more content
    some more content</b>
</a>
```

A more complex example, before:

```xml
<тест>test</тест>
<body><![CDATA[<x><!-- comment -->   </y></x>]]></body>
<body><!--     <x><[CDATA[cdata]]>   </y></x> --></body>
</unbalanced>
```

After:

```xml
<тест>test</тест>
<body>
	<![CDATA[<x><!-- comment -->   </y></x>]]>
</body>
<body>
	<!--     <x><[CDATA[cdata]]>   </y></x> -->
</body>
</unbalanced>
```

## Extension Settings

None

## Release Notes

### 1.1.1

Thanks to https://github.com/MasterNobody :

-   Support for non-latin tag names.
-   Support for nesting comments in CDATA and vice versa.
-   Support for unbalanced end-tags.
-   Do not remove whitespaces and new lines inside comments and CDATA.
-   Disable splitting of namespace declarations on new lines.

### 1.0.2

Fixing use of new

### 1.0.1

Added support for XSL files

### 1.0.0

Added a logo!

### 0.0.4

Obey vscode indent settings (thanks to @Gruntfuggly)

### 0.0.3

Copy changes

### 0.0.1

Initial release
