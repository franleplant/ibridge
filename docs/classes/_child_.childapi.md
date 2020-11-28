**[ibridge](../README.md)**

> [Globals](../globals.md) / ["Child"](../modules/_child_.md) / ChildAPI

# Class: ChildAPI\<TModel, TContext>

## Type parameters

Name | Default |
------ | ------ |
`TModel` | - |
`TContext` | any |

## Hierarchy

* Emittery

  ↳ **ChildAPI**

## Index

### Classes

* [Typed](_child_.childapi.typed.md)

### Interfaces

* [Events](../interfaces/_child_.childapi.events.md)
* [ListenerChangedData](../interfaces/_child_.childapi.listenerchangeddata.md)

### Type aliases

* [EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)
* [UnsubscribeFn](_child_.childapi.md#unsubscribefn)

### Constructors

* [constructor](_child_.childapi.md#constructor)

### Properties

* [child](_child_.childapi.md#child)
* [context](_child_.childapi.md#context)
* [model](_child_.childapi.md#model)
* [parent](_child_.childapi.md#parent)
* [parentOrigin](_child_.childapi.md#parentorigin)
* [listenerAdded](_child_.childapi.md#listeneradded)
* [listenerRemoved](_child_.childapi.md#listenerremoved)

### Methods

* [anyEvent](_child_.childapi.md#anyevent)
* [bindMethods](_child_.childapi.md#bindmethods)
* [clearListeners](_child_.childapi.md#clearlisteners)
* [dispatcher](_child_.childapi.md#dispatcher)
* [emit](_child_.childapi.md#emit)
* [emitSerial](_child_.childapi.md#emitserial)
* [emitToParent](_child_.childapi.md#emittoparent)
* [events](_child_.childapi.md#events)
* [handleGet](_child_.childapi.md#handleget)
* [handshake](_child_.childapi.md#handshake)
* [listenerCount](_child_.childapi.md#listenercount)
* [off](_child_.childapi.md#off)
* [offAny](_child_.childapi.md#offany)
* [on](_child_.childapi.md#on)
* [onAny](_child_.childapi.md#onany)
* [once](_child_.childapi.md#once)
* [setListeners](_child_.childapi.md#setlisteners)
* [mixin](_child_.childapi.md#mixin)

## Type aliases

### EventNameFromDataMap

Ƭ `Static` **EventNameFromDataMap**\<EventDataMap>: Extract\<keyof EventDataMap, EventName>

*Defined in node_modules/emittery/index.d.ts:347*

#### Type parameters:

Name |
------ |
`EventDataMap` |

___

### UnsubscribeFn

Ƭ `Static` **UnsubscribeFn**: () => void

*Defined in node_modules/emittery/index.d.ts:346*

Removes an event subscription.

## Constructors

### constructor

\+ **new ChildAPI**(`model`: TModel, `context?`: TContext): [ChildAPI](_child_.childapi.md)

*Defined in [src/Child.ts:28](https://github.com/franleplant/ibridge/blob/f2182af/src/Child.ts#L28)*

#### Parameters:

Name | Type |
------ | ------ |
`model` | TModel |
`context?` | TContext |

**Returns:** [ChildAPI](_child_.childapi.md)

## Properties

### child

• `Readonly` **child**: Window

*Defined in [src/Child.ts:26](https://github.com/franleplant/ibridge/blob/f2182af/src/Child.ts#L26)*

___

### context

• `Optional` **context**: TContext

*Defined in [src/Child.ts:28](https://github.com/franleplant/ibridge/blob/f2182af/src/Child.ts#L28)*

___

### model

• `Private` **model**: TModel

*Defined in [src/Child.ts:24](https://github.com/franleplant/ibridge/blob/f2182af/src/Child.ts#L24)*

___

### parent

• `Readonly` **parent**: Window

*Defined in [src/Child.ts:25](https://github.com/franleplant/ibridge/blob/f2182af/src/Child.ts#L25)*

___

### parentOrigin

• `Optional` **parentOrigin**: undefined \| string

*Defined in [src/Child.ts:27](https://github.com/franleplant/ibridge/blob/f2182af/src/Child.ts#L27)*

___

### listenerAdded

▪ `Static` `Readonly` **listenerAdded**: unique symbol

*Inherited from [ChildAPI](_child_.childapi.md).[listenerAdded](_child_.childapi.md#listeneradded)*

*Defined in node_modules/emittery/index.d.ts:55*

Fires when an event listener was added.

An object with `listener` and `eventName` (if `on` or `off` was used) is provided as event data.

**`example`** 
```
import Emittery = require('emittery');

const emitter = new Emittery();

emitter.on(Emittery.listenerAdded, ({listener, eventName}) => {
console.log(listener);
//=> data => {}

console.log(eventName);
//=> '🦄'
});

emitter.on('🦄', data => {
// Handle data
});
```

___

### listenerRemoved

▪ `Static` `Readonly` **listenerRemoved**: unique symbol

*Inherited from [ChildAPI](_child_.childapi.md).[listenerRemoved](_child_.childapi.md#listenerremoved)*

*Defined in node_modules/emittery/index.d.ts:83*

Fires when an event listener was removed.

An object with `listener` and `eventName` (if `on` or `off` was used) is provided as event data.

**`example`** 
```
import Emittery = require('emittery');

const emitter = new Emittery();

const off = emitter.on('🦄', data => {
// Handle data
});

emitter.on(Emittery.listenerRemoved, ({listener, eventName}) => {
console.log(listener);
//=> data => {}

console.log(eventName);
//=> '🦄'
});

off();
```

## Methods

### anyEvent

▸ **anyEvent**(): AsyncIterableIterator\<unknown>

*Inherited from [ChildAPI](_child_.childapi.md).[anyEvent](_child_.childapi.md#anyevent)*

*Defined in node_modules/emittery/index.d.ts:306*

Get an async iterator which buffers a tuple of an event name and data each time an event is emitted.

Call `return()` on the iterator to remove the subscription.

In the same way as for `events`, you can subscribe by using the `for await` statement.

**`example`** 
```
import Emittery = require('emittery');

const emitter = new Emittery();
const iterator = emitter.anyEvent();

emitter.emit('🦄', '🌈1'); // Buffered
emitter.emit('🌟', '🌈2'); // Buffered

iterator.next()
.then(({value, done}) => {
// done is false
// value is ['🦄', '🌈1']
return iterator.next();
})
.then(({value, done}) => {
// done is false
// value is ['🌟', '🌈2']
// revoke subscription
return iterator.return();
})
.then(({done}) => {
// done is true
});
```

**Returns:** AsyncIterableIterator\<unknown>

___

### bindMethods

▸ **bindMethods**(`target`: object, `methodNames?`: readonly string[]): void

*Inherited from [ChildAPI](_child_.childapi.md).[bindMethods](_child_.childapi.md#bindmethods)*

*Defined in node_modules/emittery/index.d.ts:339*

Bind the given `methodNames`, or all `Emittery` methods if `methodNames` is not defined, into the `target` object.

**`example`** 
```
import Emittery = require('emittery');

const object = {};

new Emittery().bindMethods(object);

object.emit('event');
```

#### Parameters:

Name | Type |
------ | ------ |
`target` | object |
`methodNames?` | readonly string[] |

**Returns:** void

___

### clearListeners

▸ **clearListeners**(`eventName?`: EventNames): void

*Inherited from [ChildAPI](_child_.childapi.md).[clearListeners](_child_.childapi.md#clearlisteners)*

*Defined in node_modules/emittery/index.d.ts:318*

Clear all event listeners on the instance.

If `eventName` is given, only the listeners for that event are cleared.

#### Parameters:

Name | Type |
------ | ------ |
`eventName?` | EventNames |

**Returns:** void

___

### dispatcher

▸ `Private`**dispatcher**(`event`: MessageEvent): Promise\<void>

*Defined in [src/Child.ts:46](https://github.com/franleplant/ibridge/blob/f2182af/src/Child.ts#L46)*

#### Parameters:

Name | Type |
------ | ------ |
`event` | MessageEvent |

**Returns:** Promise\<void>

___

### emit

▸ **emit**(`eventName`: EventName, `eventData?`: unknown): Promise\<void>

*Inherited from [ChildAPI](_child_.childapi.md).[emit](_child_.childapi.md#emit)*

*Defined in node_modules/emittery/index.d.ts:254*

Trigger an event asynchronously, optionally with some data. Listeners are called in the order they were added, but executed concurrently.

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | EventName |
`eventData?` | unknown |

**Returns:** Promise\<void>

A promise that resolves when all the event listeners are done. *Done* meaning executed if synchronous or resolved when an async/promise-returning function. You usually wouldn't want to wait for this, but you could for example catch possible errors. If any of the listeners throw/reject, the returned promise will be rejected with the error, but the other listeners will not be affected.

___

### emitSerial

▸ **emitSerial**(`eventName`: EventName, `eventData?`: unknown): Promise\<void>

*Inherited from [ChildAPI](_child_.childapi.md).[emitSerial](_child_.childapi.md#emitserial)*

*Defined in node_modules/emittery/index.d.ts:263*

Same as `emit()`, but it waits for each listener to resolve before triggering the next one. This can be useful if your events depend on each other. Although ideally they should not. Prefer `emit()` whenever possible.

If any of the listeners throw/reject, the returned promise will be rejected with the error and the remaining listeners will *not* be called.

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | EventName |
`eventData?` | unknown |

**Returns:** Promise\<void>

A promise that resolves when all the event listeners are done.

___

### emitToParent

▸ **emitToParent**(`eventName`: string, `data`: unknown): void

*Defined in [src/Child.ts:83](https://github.com/franleplant/ibridge/blob/f2182af/src/Child.ts#L83)*

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | string |
`data` | unknown |

**Returns:** void

___

### events

▸ **events**(`eventName`: EventNames): AsyncIterableIterator\<unknown>

*Inherited from [ChildAPI](_child_.childapi.md).[events](_child_.childapi.md#events)*

*Defined in node_modules/emittery/index.d.ts:195*

Get an async iterator which buffers data each time an event is emitted.

Call `return()` on the iterator to remove the subscription.

**`example`** 
```
import Emittery = require('emittery');

const emitter = new Emittery();
const iterator = emitter.events('🦄');

emitter.emit('🦄', '🌈1'); // Buffered
emitter.emit('🦄', '🌈2'); // Buffered

iterator
.next()
.then(({value, done}) => {
// done === false
// value === '🌈1'
return iterator.next();
})
.then(({value, done}) => {
// done === false
// value === '🌈2'
// Revoke subscription
return iterator.return();
})
.then(({done}) => {
// done === true
});
```

In practice you would usually consume the events using the [for await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) statement. In that case, to revoke the subscription simply break the loop.

**`example`** 
```
import Emittery = require('emittery');

const emitter = new Emittery();
const iterator = emitter.events('🦄');

emitter.emit('🦄', '🌈1'); // Buffered
emitter.emit('🦄', '🌈2'); // Buffered

// In an async context.
for await (const data of iterator) {
if (data === '🌈2') {
break; // Revoke the subscription when we see the value `🌈2`.
}
}
```

It accepts multiple event names.

**`example`** 
```
import Emittery = require('emittery');

const emitter = new Emittery();
const iterator = emitter.events(['🦄', '🦊']);

emitter.emit('🦄', '🌈1'); // Buffered
emitter.emit('🦊', '🌈2'); // Buffered

iterator
.next()
.then(({value, done}) => {
// done === false
// value === '🌈1'
return iterator.next();
})
.then(({value, done}) => {
// done === false
// value === '🌈2'
// Revoke subscription
return iterator.return();
})
.then(({done}) => {
// done === true
});
```

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | EventNames |

**Returns:** AsyncIterableIterator\<unknown>

___

### handleGet

▸ **handleGet**(`__namedParameters`: { args: any[] ; id: string ; property: string  }): Promise\<void>

*Defined in [src/Child.ts:101](https://github.com/franleplant/ibridge/blob/f2182af/src/Child.ts#L101)*

#### Parameters:

Name | Type |
------ | ------ |
`__namedParameters` | { args: any[] ; id: string ; property: string  } |

**Returns:** Promise\<void>

___

### handshake

▸ **handshake**(): Promise\<[ChildAPI](_child_.childapi.md)\<TModel, TContext>>

*Defined in [src/Child.ts:92](https://github.com/franleplant/ibridge/blob/f2182af/src/Child.ts#L92)*

**Returns:** Promise\<[ChildAPI](_child_.childapi.md)\<TModel, TContext>>

___

### listenerCount

▸ **listenerCount**(`eventName?`: EventNames): number

*Inherited from [ChildAPI](_child_.childapi.md).[listenerCount](_child_.childapi.md#listenercount)*

*Defined in node_modules/emittery/index.d.ts:323*

The number of listeners for the `eventName` or all events if not specified.

#### Parameters:

Name | Type |
------ | ------ |
`eventName?` | EventNames |

**Returns:** number

___

### off

▸ **off**(`eventName`: EventNames, `listener`: (eventData?: unknown) => void): void

*Inherited from [ChildAPI](_child_.childapi.md).[off](_child_.childapi.md#off)*

*Defined in node_modules/emittery/index.d.ts:220*

Remove one or more event subscriptions.

**`example`** 
```
import Emittery = require('emittery');

const emitter = new Emittery();

const listener = data => console.log(data);
(async () => {
emitter.on(['🦄', '🐶', '🦊'], listener);
await emitter.emit('🦄', 'a');
await emitter.emit('🐶', 'b');
await emitter.emit('🦊', 'c');
emitter.off('🦄', listener);
emitter.off(['🐶', '🦊'], listener);
await emitter.emit('🦄', 'a'); // nothing happens
await emitter.emit('🐶', 'b'); // nothing happens
await emitter.emit('🦊', 'c'); // nothing happens
})();
```

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | EventNames |
`listener` | (eventData?: unknown) => void |

**Returns:** void

___

### offAny

▸ **offAny**(`listener`: (eventName: EventName, eventData?: unknown) => void): void

*Inherited from [ChildAPI](_child_.childapi.md).[offAny](_child_.childapi.md#offany)*

*Defined in node_modules/emittery/index.d.ts:311*

Remove an `onAny` subscription.

#### Parameters:

Name | Type |
------ | ------ |
`listener` | (eventName: EventName, eventData?: unknown) => void |

**Returns:** void

___

### on

▸ **on**(`eventName`: *typeof* [listenerAdded](_child_.childapi.md#listeneradded) \| *typeof* [listenerRemoved](_child_.childapi.md#listenerremoved), `listener`: (eventData: [ListenerChangedData](../interfaces/_child_.childapi.listenerchangeddata.md)) => void): Emittery.UnsubscribeFn

*Inherited from [ChildAPI](_child_.childapi.md).[on](_child_.childapi.md#on)*

*Defined in node_modules/emittery/index.d.ts:109*

Subscribe to one or more events.

Using the same listener multiple times for the same event will result in only one method call per emitted event.

**`example`** 
```
import Emittery = require('emittery');

const emitter = new Emittery();

emitter.on('🦄', data => {
console.log(data);
});
emitter.on(['🦄', '🐶'], data => {
console.log(data);
});

emitter.emit('🦄', '🌈'); // log => '🌈' x2
emitter.emit('🐶', '🍖'); // log => '🍖'
```

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | *typeof* [listenerAdded](_child_.childapi.md#listeneradded) \| *typeof* [listenerRemoved](_child_.childapi.md#listenerremoved) |
`listener` | (eventData: [ListenerChangedData](../interfaces/_child_.childapi.listenerchangeddata.md)) => void |

**Returns:** Emittery.UnsubscribeFn

An unsubscribe method.

▸ **on**(`eventName`: EventNames, `listener`: (eventData?: unknown) => void): Emittery.UnsubscribeFn

*Inherited from [ChildAPI](_child_.childapi.md).[on](_child_.childapi.md#on)*

*Defined in node_modules/emittery/index.d.ts:110*

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | EventNames |
`listener` | (eventData?: unknown) => void |

**Returns:** Emittery.UnsubscribeFn

___

### onAny

▸ **onAny**(`listener`: (eventName: EventName, eventData?: unknown) => unknown): Emittery.UnsubscribeFn

*Inherited from [ChildAPI](_child_.childapi.md).[onAny](_child_.childapi.md#onany)*

*Defined in node_modules/emittery/index.d.ts:270*

Subscribe to be notified about any event.

#### Parameters:

Name | Type |
------ | ------ |
`listener` | (eventName: EventName, eventData?: unknown) => unknown |

**Returns:** Emittery.UnsubscribeFn

A method to unsubscribe.

___

### once

▸ **once**(`eventName`: *typeof* [listenerAdded](_child_.childapi.md#listeneradded) \| *typeof* [listenerRemoved](_child_.childapi.md#listenerremoved)): Promise\<[ListenerChangedData](../interfaces/_child_.childapi.listenerchangeddata.md)>

*Inherited from [ChildAPI](_child_.childapi.md).[once](_child_.childapi.md#once)*

*Defined in node_modules/emittery/index.d.ts:246*

Subscribe to one or more events only once. It will be unsubscribed after the first
event.

**`example`** 
```
import Emittery = require('emittery');

const emitter = new Emittery();

emitter.once('🦄').then(data => {
console.log(data);
//=> '🌈'
});
emitter.once(['🦄', '🐶']).then(data => {
console.log(data);
});

emitter.emit('🦄', '🌈'); // Logs `🌈` twice
emitter.emit('🐶', '🍖'); // Nothing happens
```

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | *typeof* [listenerAdded](_child_.childapi.md#listeneradded) \| *typeof* [listenerRemoved](_child_.childapi.md#listenerremoved) |

**Returns:** Promise\<[ListenerChangedData](../interfaces/_child_.childapi.listenerchangeddata.md)>

The event data when `eventName` is emitted.

▸ **once**(`eventName`: EventNames): Promise\<unknown>

*Inherited from [ChildAPI](_child_.childapi.md).[once](_child_.childapi.md#once)*

*Defined in node_modules/emittery/index.d.ts:247*

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | EventNames |

**Returns:** Promise\<unknown>

___

### setListeners

▸ `Private`**setListeners**(): void

*Defined in [src/Child.ts:40](https://github.com/franleplant/ibridge/blob/f2182af/src/Child.ts#L40)*

**Returns:** void

___

### mixin

▸ `Static`**mixin**(`emitteryPropertyName`: string \| symbol, `methodNames?`: readonly string[]): Function

*Inherited from [ChildAPI](_child_.childapi.md).[mixin](_child_.childapi.md#mixin)*

*Defined in node_modules/emittery/index.d.ts:29*

In TypeScript, it returns a decorator which mixins `Emittery` as property `emitteryPropertyName` and `methodNames`, or all `Emittery` methods if `methodNames` is not defined, into the target class.

**`example`** 
```
import Emittery = require('emittery');

@Emittery.mixin('emittery')
class MyClass {}

const instance = new MyClass();

instance.emit('event');
```

#### Parameters:

Name | Type |
------ | ------ |
`emitteryPropertyName` | string \| symbol |
`methodNames?` | readonly string[] |

**Returns:** Function
