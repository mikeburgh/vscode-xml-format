# XML Format

Format XML documents, without changing the content within elements.

## Features

This extension uses [vkBeautify](https://github.com/vkiryukhin/vkBeautify) for xml formating.

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

## Extension Settings

None

## Release Notes
### 0.0.3

Copy changes

### 0.0.1

Initial release

