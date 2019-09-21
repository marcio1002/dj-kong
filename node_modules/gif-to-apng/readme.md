# 🖼 gif-to-apng

Convert a gif to apng

This module is a simple wrapper around [gif2apng](https://sourceforge.net/projects/gif2apng/) since i coudln't find any other modules for creating apng in node.
## Install

```sh
yarn add gif-to-apng
```

## Use

```js
const toApng = require('gif-to-apng')

toApng('path/to/image.gif')
  .then(() => console.log('Done 🎉'))
  .catch(error => console.log('Something went wrong 💀', error))
```

## API

### toApng(source, [output])

Convert a .gif to apng

#### source

Type: `string`

Path to the gif you want to convert

#### output

Type: `string`

Optional path to output file, defaults to source with .png extension


### Credits

[gif2apng](https://sourceforge.net/projects/gif2apng/) made by [Max Stepin](maxst@users.sourceforge.net)