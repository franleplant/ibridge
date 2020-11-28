**[ibridge](../README.md)**

> [Globals](../globals.md) / ["Child"](../modules/_child_.md) / [ChildAPI](../classes/_child_.childapi.md) / ListenerChangedData

# Interface: ListenerChangedData

The data provided as `eventData` when listening for `Emittery.listenerAdded` or `Emittery.listenerRemoved`.

## Hierarchy

* **ListenerChangedData**

## Index

### Properties

* [eventName](_child_.childapi.listenerchangeddata.md#eventname)
* [listener](_child_.childapi.listenerchangeddata.md#listener)

## Properties

### eventName

• `Optional` **eventName**: EventName

*Defined in node_modules/emittery/index.d.ts:369*

The name of the event that was added or removed if `.on()` or `.off()` was used, or `undefined` if `.onAny()` or `.offAny()` was used.

___

### listener

•  **listener**: (eventData?: unknown) => void

*Defined in node_modules/emittery/index.d.ts:364*

The listener that was added or removed.
