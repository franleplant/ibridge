TODO

```typescript

import {ParentAPI } from './index'

// a handshake will be performed here
const parent = await ParentAPI.init({...})

try {
  const result = await parent.get('deep.getSomethingInTheChildren', "arguments", "are", true)
} catch (err) {
  // if getSomethingInTheChildren returns a promise in the children
  // then that promise can throw without a problem
}

// Send events to the child
parent.emitToChild("drink", {"ok"})

// listen to events from the child
parent.on("cheers", msg => console.log(msg))



```

```typescript

import {ChildAPI } from './index'

const model = {
  deep: {
    getSomethingInTheChildren(...args: Array<any>): void {
      console.log(args)
    }
  }

}

const child = await ChildAPI.init(model, context)

// send message to parent
child.emitToParent("cheers", {with:"beer"})

// hear message from parent
child.on("drink", msg => console.log(msg))


```
