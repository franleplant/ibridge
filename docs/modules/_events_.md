**[ibridge](../README.md)**

> [Globals](../README.md) / "events"

# Module: "events"

## Index

### Interfaces

* [IChildEmit](../interfaces/_events_.ichildemit.md)
* [IGetRequest](../interfaces/_events_.igetrequest.md)
* [IGetResponse](../interfaces/_events_.igetresponse.md)
* [IParentEmit](../interfaces/_events_.iparentemit.md)

### Functions

* [createChildEmit](_events_.md#createchildemit)
* [createParentEmit](_events_.md#createparentemit)
* [getResponse](_events_.md#getresponse)

## Functions

### createChildEmit

▸ **createChildEmit**(`eventName`: string, `data`: unknown): [IChildEmit](../interfaces/_events_.ichildemit.md)

*Defined in [src/events.ts:39](https://github.com/franleplant/ibridge/blob/046b2f2/src/events.ts#L39)*

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | string |
`data` | unknown |

**Returns:** [IChildEmit](../interfaces/_events_.ichildemit.md)

___

### createParentEmit

▸ **createParentEmit**(`eventName`: string, `data`: unknown): [IParentEmit](../interfaces/_events_.iparentemit.md)

*Defined in [src/events.ts:48](https://github.com/franleplant/ibridge/blob/046b2f2/src/events.ts#L48)*

#### Parameters:

Name | Type |
------ | ------ |
`eventName` | string |
`data` | unknown |

**Returns:** [IParentEmit](../interfaces/_events_.iparentemit.md)

___

### getResponse

▸ **getResponse**(`id`: string): string

*Defined in [src/events.ts:8](https://github.com/franleplant/ibridge/blob/046b2f2/src/events.ts#L8)*

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |

**Returns:** string
