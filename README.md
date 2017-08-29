# splits.js
split layout written in js

### Example
This example is available at [codepen](https://codepen.io/wvffle/pen/brdqwg)
```js
const elem = document.createElement('div');
elem.innerHTML = 'You can add elements!';

const layout = new Splits.Layout(document.body, {
  direction: 'horizontal',
  children: [
    {
      direction: 'vertical',
      children: [
        { // container with only 1 children
          children: [ 'You can create containers to set size' ],
          size: {
            min: 100,
            max: 200,
          },
        },
        elem,
        'You can add strings'
      ]
    },
    ':3',
  ]
});

```
