# xml-format README

Format XML documents, without changing the content within elements.

## Features

This extension uses [vkBeautify](https://github.com/vkiryukhin/vkBeautify) xml formating.

It is specifically designed to work with XML that contains things like line breaks inside elements, which you want to preserve on formatting.

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

### 0.0.1

Initial release

