
 ![Node.js CI](https://github.com/franleplant/ibridge/workflows/Node.js%20CI/badge.svg)

<h1 align="center">
  <img src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f309.svg" alt="ibridge logo" width="300"/>
  </br>
  </br>
  ibridge
</h1>


<p align="center">
  A tiny, promise based, type safe library for easy, bidirectional and secure window communication, with out of the box support for iframes and web workers.
</p>


![how ibridge works](./assets/ibridge.svg)

## Quick Start: iframes

For this library to work you need to use it both from the parent document and from the child document.

### In the child page


```typescript
// [optional] Define a context that will
// be available to all model functions
const context = {
  vehicles: {
    getCar(carId) {
      return Promise.resolve({ fake: true, carId });
    },
  },
};

// define a model which contains all the functions
// that the parent can remotely call and get their results
const model = {
  vehicles: {
    getCar(carId) {
      const context = this;
      return context.vehicles.getCar(carId);
    },
  },
  // fake model to show how ibridge handles model that throw
  getError() {
    return Promise.reject("fake error");
  },
};

// Instantiate the child from the window object
const ichild = ibridge.Child.fromWindow(model, context);
// await for ibridge handshake with the parent
await ichild.handshake();

```


### In the parent page

```typescript
// instantiate the Parent and also create an iframe,
// if you need to create the iframe yourself that's alos accepted
const iparent = await ibridge.Parent.createIframe({
  url: "http://localhost:8080/examples/child.html",
});

// await for ibridge handshake with the child
await iparent.handshake();

// Done! we are ready to call model functions
const value = await iparent.get("vehicles.getCar", 123);
// => {fake: true, cardId: 123}

try {
  // models can throw in the child and the error will be
  // propagated to the parent
  const value = await iparent.get("getError");
} catch (err) {
  console.log("getError throwed and error in the child")
  console.log(err)
  // => "fake error"
}
```

### Create your own iframe


```typescript

const iframe = document.createElement("iframe");
// this helper function waits for the iframe to "load"
// and returns a reference to the iframe's window
const remoteWindowPromise = ibridge.getRemoteWindow(iframe);
iframe.src = url;
container.appendChild(iframe);
const remoteWindow = await remoteWindowPromise;
const channel = new WindowChannel({
  localWindow: window,
  remoteWindow,
  // use helper or you can calculate yourself
  // or force it to "*"
  remoteOrigin: ibridge.getOrigin(url),
});

const iparent = new ibrige.Parent({channel})
```

### Use an existing iframe

```typescript
// ensure your iframe has triggered the "load" event,
// either by onload or by checking document.readyState === "complete"
const remoteWindow = document.querySelector('#my-iframe').contentWindow


const channel = new WindowChannel({
  localWindow: window,
  remoteWindow,
  // use helper or you can calculate yourself
  // or force it to "*"
  remoteOrigin: ibridge.getOrigin(url),
});
const iparent = new ibrige.Parent({channel})
```

## Guide: any other window like object

This library can work with any window like object such
as native popups/modals and webworkers.

The way you hook everything up is by creating 
a class or an object that `implement ibridge.IChannel`,
check the `WindowChannel` and the `WorkerChannel` for examples.

Latter you will create `Bridge` instances on each _side_ of the communication
bridge and be done with it. `Parent` and `Child` are typically used for iframes
and they include a handshake out of the box, you can also use that with webworkers and
modals or you can even roll up your own thanks to the high level interface that `ibridge`
provides.


## Guide: WebWorkers

TODO


## 🐛 Debugging

`ibridge` is written with full [debug](https://www.npmjs.com/package/debug) integration, to enable
verbose output in the browser do the following in both child and parent

```typescript
localStorage.debug = "ibridge:*"
```

## 🔌 Model

`model` is a great way of modeling a remote function call from parent to child
i.e. the parent calls a function that lives inside the child and the child
communicates back the return value of that function or throws an error.

`model` functions can return any serializable value or a promise to a serializable value
and they can throw or `Promise.reject` and the parent will treat them as regular function
calls.

Parent can also pass any serializable arguments to the model inside the child.

## 🗄️ Context

`context` is a really nice way of structuring more complex `models` in the child,
it allows you to share apis, state, socketio connections, configs, across all the model functions.


## ✉️  Free form communication

There might be times where you want more control over the parent child communication,
don't worry, you don't need to devolve back to the lower level api of `postMessage`;
`ibridge` has you covered:

```typescript
// Send events to the remote such as an iframe
bridge.emitToRemote("ping", {value: "i am father"})

// listen to events from the remote such as an iframe
bridge.on("pong", msg => console.log(msg))
```

```typescript
// listen to events from the remote (i.e. the parent window)
bridge.on("ping", msg => {
  // send message to the remote
  bridge.emitToRemote("pong", {value: "i am child"})
})
```

**IMPORTANT** `Bridge` is the base class, `Parent` and `Child` extend it.



Besides the special `emitToRemote`, `Bridge` and therefore `Parent` and `Child`
are event emitters that extend the [Emittery](https://www.npmjs.com/package/emittery),
which means you have much more versatility while building complex
event flows between parent and children i.e. `once`, `off`, `onAny`, etc.
are all supported, check `Emittery` docs for more information.

## 🎛️ Api docs

The library is fully typed, check the code to see all configurations
or even let your IDE guide the way.


### Max handshake requests

By default `ibridge` will try 5 times to stablish
connection with the child, you can alter this behavior by changing
the static attribute:

```typescript
ibridge.Parent.maxHandshakeRequests = x
```


## Security

Although this library has a **handshake** mechanism to establish
the communication "channel" there is nothing preventing an attacker
from using the library or simply simulating the message formats.

The right way of doing this is by working with web standards to define
what domains can be parent iframes of our child, this **allows you to define
an allowlist of secure domains that can use your site inside an iframe**.

Please check the [mdn documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors).

TLDR: you can define an allowlist of domains that can use your page inside an iframe:

Your page should set the following HTTP header:

```
Content-Security-Policy: frame-ancestors 'self' www.parent.com *.otherparent.com http://localhost:* ;
```

If you want to allow any domain then don't set this header.

If your page won't be hosted inside an iframe you want to set this up to `'none'` for extra protection.

## Logo license

The log is part of [twitter emoji](https://twemoji.twitter.com/).

## License: MIT

This is based on [postmate](https://github.com/dollarshaveclub/postmate),
original implementation to the postmate contributors credit.
