**[ibridge](../README.md)**

> [Globals](../README.md) / ["Parent"](../modules/_parent_.md) / ParentAPI

# Class: ParentAPI

## Hierarchy

* Emittery

  ↳ **ParentAPI**

## Index

### Classes

* [Typed](_parent_.parentapi.typed.md)

### Interfaces

* [Events](../interfaces/_parent_.parentapi.events.md)
* [ListenerChangedData](../interfaces/_parent_.parentapi.listenerchangeddata.md)

### Type aliases

* [EventNameFromDataMap](_parent_.parentapi.md#eventnamefromdatamap)
* [UnsubscribeFn](_parent_.parentapi.md#unsubscribefn)

### Constructors

* [constructor](_parent_.parentapi.md#constructor)

### Properties

* [child](_parent_.parentapi.md#child)
* [childOrigin](_parent_.parentapi.md#childorigin)
* [container](_parent_.parentapi.md#container)
* [frame](_parent_.parentapi.md#frame)
* [parent](_parent_.parentapi.md#parent)
* [url](_parent_.parentapi.md#url)
* [listenerAdded](_parent_.parentapi.md#listeneradded)
* [listenerRemoved](_parent_.parentapi.md#listenerremoved)
* [maxHandshakeRequests](_parent_.parentapi.md#maxhandshakerequests)

### Methods

* [anyEvent](_parent_.parentapi.md#anyevent)
* [bindMethods](_parent_.parentapi.md#bindmethods)
* [clearListeners](_parent_.parentapi.md#clearlisteners)
* [destroy](_parent_.parentapi.md#destroy)
* [dispatcher](_parent_.parentapi.md#dispatcher)
* [emit](_parent_.parentapi.md#emit)
* [emitSerial](_parent_.parentapi.md#emitserial)
* [emitToChild](_parent_.parentapi.md#emittochild)
* [events](_parent_.parentapi.md#events)
* [get](_parent_.parentapi.md#get)
* [handshake](_parent_.parentapi.md#handshake)
* [listenerCount](_parent_.parentapi.md#listenercount)
* [off](_parent_.parentapi.md#off)
* [offAny](_parent_.parentapi.md#offany)
* [on](_parent_.parentapi.md#on)
* [onAny](_parent_.parentapi.md#onany)
* [once](_parent_.parentapi.md#once)
* [mixin](_parent_.parentapi.md#mixin)

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

\+ **new ParentAPI**(`__namedParameters`: { classList: string[] = []; container: HTMLElement = document.body; name: string = ""; showIframe: boolean = false; url: string  }): [ParentAPI](_parent_.parentapi.md)

*Defined in [src/Parent.ts:36](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L36)*

#### Parameters:

Name | Type |
------ | ------ |
`__namedParameters` | { classList: string[] = []; container: HTMLElement = document.body; name: string = ""; showIframe: boolean = false; url: string  } |

**Returns:** [ParentAPI](_parent_.parentapi.md)

## Properties

### child

• `Readonly` **child**: Window

*Defined in [src/Parent.ts:28](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L28)*

___

### childOrigin

•  **childOrigin**: string

*Defined in [src/Parent.ts:30](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L30)*

___

### container

• `Readonly` **container**: HTMLElement

*Defined in [src/Parent.ts:31](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L31)*

___

### frame

• `Readonly` **frame**: HTMLIFrameElement

*Defined in [src/Parent.ts:29](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L29)*

___

### parent

• `Readonly` **parent**: Window

*Defined in [src/Parent.ts:27](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L27)*

___

### url

• `Readonly` **url**: string

*Defined in [src/Parent.ts:26](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L26)*

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

___

### maxHandshakeRequests

▪ `Static` **maxHandshakeRequests**: number = 5

*Defined in [src/Parent.ts:36](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L36)*

The maximum number of attempts to send a handshake request to the parent

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

### destroy

▸ **destroy**(): void

*Defined in [src/Parent.ts:151](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L151)*

**Returns:** void

___

### dispatcher

▸ `Private`**dispatcher**(`event`: MessageEvent): void

*Defined in [src/Parent.ts:70](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L70)*

#### Parameters:

Name | Type |
------ | ------ |
`event` | MessageEvent |

**Returns:** void

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

### emitToChild

▸ **emitToChild**(`eventName`: string, `data`: unknown): void

*Defined in [src/Parent.ts:88](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L88)*

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

### get

▸ **get**(`property`: string, ...`args`: Array\<any>): Promise\<any>

*Defined in [src/Parent.ts:137](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L137)*

#### Parameters:

Name | Type |
------ | ------ |
`property` | string |
`...args` | Array\<any> |

**Returns:** Promise\<any>

___

### handshake

▸ **handshake**(): Promise\<[ParentAPI](_parent_.parentapi.md)>

*Defined in [src/Parent.ts:94](https://github.com/franleplant/ibridge/blob/046b2f2/src/Parent.ts#L94)*

**Returns:** Promise\<[ParentAPI](_parent_.parentapi.md)>

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
