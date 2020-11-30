**[ibridge](../README.md)**

> [Globals](../README.md) / ["Child"](../modules/_child_.md) / [ChildAPI](_child_.childapi.md) / Typed

# Class: Typed\<EventDataMap, EmptyEvents>

Async event emitter.

You must list supported events and the data type they emit, if any.

**`example`** 
```
import Emittery = require('emittery');

const emitter = new Emittery.Typed<{value: string}, 'open' | 'close'>();

emitter.emit('open');
emitter.emit('value', 'foo\n');
emitter.emit('value', 1); // TS compilation error
emitter.emit('end'); // TS compilation error
```

## Type parameters

Name | Type | Default |
------ | ------ | ------ |
`EventDataMap` | [Events](../interfaces/_child_.childapi.events.md) | - |
`EmptyEvents` | EventName | never |

## Hierarchy

* **Typed**

## Index

### Methods

* [anyEvent](_child_.childapi.typed.md#anyevent)
* [emit](_child_.childapi.typed.md#emit)
* [emitSerial](_child_.childapi.typed.md#emitserial)
* [events](_child_.childapi.typed.md#events)
* [off](_child_.childapi.typed.md#off)
* [offAny](_child_.childapi.typed.md#offany)
* [on](_child_.childapi.typed.md#on)
* [onAny](_child_.childapi.typed.md#onany)
* [once](_child_.childapi.typed.md#once)

## Methods

### anyEvent

▸ **anyEvent**(): AsyncIterableIterator\<[[EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap>, EventDataMap[EventNameFromDataMap\<EventDataMap>]]>

*Defined in node_modules/emittery/index.d.ts:402*

**Returns:** AsyncIterableIterator\<[[EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap>, EventDataMap[EventNameFromDataMap\<EventDataMap>]]>

___

### emit

▸ **emit**\<Name>(`eventName`: Name, `eventData`: EventDataMap[Name]): Promise\<void>

*Defined in node_modules/emittery/index.d.ts:406*

#### Type parameters:

Name | Type |
------ | ------ |
`Name` | [EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap> |

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | Name |
`eventData` | EventDataMap[Name] |

**Returns:** Promise\<void>

▸ **emit**\<Name>(`eventName`: Name): Promise\<void>

*Defined in node_modules/emittery/index.d.ts:407*

#### Type parameters:

Name | Type |
------ | ------ |
`Name` | EmptyEvents |

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | Name |

**Returns:** Promise\<void>

___

### emitSerial

▸ **emitSerial**\<Name>(`eventName`: Name, `eventData`: EventDataMap[Name]): Promise\<void>

*Defined in node_modules/emittery/index.d.ts:409*

#### Type parameters:

Name | Type |
------ | ------ |
`Name` | [EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap> |

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | Name |
`eventData` | EventDataMap[Name] |

**Returns:** Promise\<void>

▸ **emitSerial**\<Name>(`eventName`: Name): Promise\<void>

*Defined in node_modules/emittery/index.d.ts:410*

#### Type parameters:

Name | Type |
------ | ------ |
`Name` | EmptyEvents |

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | Name |

**Returns:** Promise\<void>

___

### events

▸ **events**\<Name>(`eventName`: Name): AsyncIterableIterator\<EventDataMap[Name]>

*Defined in node_modules/emittery/index.d.ts:393*

#### Type parameters:

Name | Type |
------ | ------ |
`Name` | [EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap> |

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | Name |

**Returns:** AsyncIterableIterator\<EventDataMap[Name]>

___

### off

▸ **off**\<Name>(`eventName`: Name, `listener`: (eventData: EventDataMap[Name]) => void): void

*Defined in node_modules/emittery/index.d.ts:398*

#### Type parameters:

Name | Type |
------ | ------ |
`Name` | [EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap> |

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | Name |
`listener` | (eventData: EventDataMap[Name]) => void |

**Returns:** void

▸ **off**\<Name>(`eventName`: Name, `listener`: () => void): void

*Defined in node_modules/emittery/index.d.ts:399*

#### Type parameters:

Name | Type |
------ | ------ |
`Name` | EmptyEvents |

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | Name |
`listener` | () => void |

**Returns:** void

___

### offAny

▸ **offAny**(`listener`: (eventName: [EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap> \| EmptyEvents, eventData?: EventDataMap[EventNameFromDataMap\<EventDataMap>]) => void): void

*Defined in node_modules/emittery/index.d.ts:404*

#### Parameters:

Name | Type |
------ | ------ |
`listener` | (eventName: [EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap> \| EmptyEvents, eventData?: EventDataMap[EventNameFromDataMap\<EventDataMap>]) => void |

**Returns:** void

___

### on

▸ **on**\<Name>(`eventName`: Name, `listener`: (eventData: EventDataMap[Name]) => void): Emittery.UnsubscribeFn

*Defined in node_modules/emittery/index.d.ts:390*

#### Type parameters:

Name | Type |
------ | ------ |
`Name` | [EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap> |

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | Name |
`listener` | (eventData: EventDataMap[Name]) => void |

**Returns:** Emittery.UnsubscribeFn

▸ **on**\<Name>(`eventName`: Name, `listener`: () => void): Emittery.UnsubscribeFn

*Defined in node_modules/emittery/index.d.ts:391*

#### Type parameters:

Name | Type |
------ | ------ |
`Name` | EmptyEvents |

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | Name |
`listener` | () => void |

**Returns:** Emittery.UnsubscribeFn

___

### onAny

▸ **onAny**(`listener`: (eventName: [EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap> \| EmptyEvents, eventData?: EventDataMap[EventNameFromDataMap\<EventDataMap>]) => void): Emittery.UnsubscribeFn

*Defined in node_modules/emittery/index.d.ts:401*

#### Parameters:

Name | Type |
------ | ------ |
`listener` | (eventName: [EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap> \| EmptyEvents, eventData?: EventDataMap[EventNameFromDataMap\<EventDataMap>]) => void |

**Returns:** Emittery.UnsubscribeFn

___

### once

▸ **once**\<Name>(`eventName`: Name): Promise\<EventDataMap[Name]>

*Defined in node_modules/emittery/index.d.ts:395*

#### Type parameters:

Name | Type |
------ | ------ |
`Name` | [EventNameFromDataMap](_child_.childapi.md#eventnamefromdatamap)\<EventDataMap> |

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | Name |

**Returns:** Promise\<EventDataMap[Name]>

▸ **once**\<Name>(`eventName`: Name): Promise\<void>

*Defined in node_modules/emittery/index.d.ts:396*

#### Type parameters:

Name | Type |
------ | ------ |
`Name` | EmptyEvents |

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | Name |

**Returns:** Promise\<void>
