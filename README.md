# ibridge

# 🌉


<div id="asd" style="font-size: 100px;">
  <g-emoji class="g-emoji" alias="bridge_at_night" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f309.png">🌉</g-emoji>
</div>



A library for awesome iframe communication between parent and child.

TODO
- `localStorage.debug = "ibridge:*"`
- `ibridge.Parent.maxHandshakeRequests = x`

## Examples

Parent setup.

```typescript

import ibridge from 'ibridge'

const iparent = new ibridge.Parent({...})
// a handshake will be performed here
await iparent.handshake()

// Access "model" functions in the child
try {
  // you can only send serializable arguments i.e. no functions
  const modelKey = 'vehicle.getCar'
  const carId = 123
  const car = await iparent.get(modelKey, carId)
} catch (err) {
  // if vehicle.getCar throws in the child
  // then this promise in the iparent will also throw
  console.error('something went wrong in the child')
}

// Send events to the child
iparent.emitToChild("drink", {"ok"})

// listen to events from the child
iparent.on("cheers", msg => console.log(msg))

```

Child setup.

```typescript

import ibridge from './index'

// child defines a "model" which is a set of functions
// that the parent will be able to call via iparent.get
const model = {
  vehicle: {
    getCar(carId: number): Promise<ICar> {
      return api.getCar(carId)
    }
  }
}

// child can define a context that will be accesible
// by all the model functions via `this`
const context = {}

// instantiate the ichild
const ichild = new ibridge.Child(model, context)
// await for the handhsake with the parent
await ichild.handshake()

// send message to parent
ichild.emitToParent("cheers", {with:"beer"})

// hear message from parent
ichild.on("drink", msg => console.log(msg))
```
