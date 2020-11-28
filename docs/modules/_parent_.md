**[ibridge](../README.md)**

> [Globals](../globals.md) / "Parent"

# Module: "Parent"

## Index

### Classes

* [ParentAPI](../classes/_parent_.parentapi.md)

### Interfaces

* [IConstructorArgs](../interfaces/_parent_.iconstructorargs.md)

### Variables

* [debug](_parent_.md#debug)

### Functions

* [resolveOrigin](_parent_.md#resolveorigin)
* [timeout](_parent_.md#timeout)

## Variables

### debug

• `Const` **debug**: Debugger = debugFactory("ibridge:parent")

*Defined in [src/Parent.ts:15](https://github.com/franleplant/ibridge/blob/f2182af/src/Parent.ts#L15)*

## Functions

### resolveOrigin

▸ **resolveOrigin**(`url`: string): string

*Defined in [src/Parent.ts:162](https://github.com/franleplant/ibridge/blob/f2182af/src/Parent.ts#L162)*

Takes a URL and returns the origin
TODO how about using URL? what is expected of this?

#### Parameters:

Name | Type |
------ | ------ |
`url` | string |

**Returns:** string

___

### timeout

▸ **timeout**(`ms`: number): Promise\<never>

*Defined in [src/Parent.ts:175](https://github.com/franleplant/ibridge/blob/f2182af/src/Parent.ts#L175)*

#### Parameters:

Name | Type |
------ | ------ |
`ms` | number |

**Returns:** Promise\<never>
