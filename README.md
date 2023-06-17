# Coderitter API adopted Remote Method Call

An adoption of the [remote-method-call](https://github.com/c0deritter/remote-method-call) package for the Coderitter API architecture.

This packages aims to provide a simpler alternative to REST styled HTTP APIs.

A remote method call calls a method of an object remotely. Thus mimicking the usage of an remote object as if it was locally present. It brings the object-oriented paradigm to an API which then can be envisioned as a set of service objects on another computer.

One advantage is that you do not need to use HTTP method names (PUT, POST, DELETE, PATCH, GET) which are not extensible and do not fit in the standard CRUD (create, read, update, delete) naming scheme. You can use as many methods as you need and you can also name them as you like.

Another advantage is that you can put every parameter into the HTTP body instead of distributing them all over the URL path, the URL parameters, the URL entity, the HTTP method, the HTTP headers and the HTTP body.

Furthermore, it is compatible to any other protocol like pure TCP, WebSockets, Kafka and also to other data formats like Google Protocol Buffers. You can add additional support for your API through WebSockets without the need to reimplement the client data.

## Related packages

To send POSTonly styled remote method call HTTP messages from a browser you can use the package [postonly-request](https://github.com/c0deritter/postonly-request).

On the server side you can use [remote-method-api](https://github.com/c0deritter/remote-method-api) which offers a simple mapping from a received remote method call to a function which receives the parameters of that remote method call for further processing.

There is also a [branch](https://github.com/c0deritter/remote-method-call/tree/coderitter-api) of this package which is optimized for the use in the Coderitter API architecture.

## Install

`npm install coderitter-api-remote-method-call`

## Overview

### RemoteMethodCall

There is an interface `RemoteMethodCall` for sending a remote method calls to a server.

```typescript
interface RemoteMethodCall {
  apiVersion?: number
  apiKey?: string
  token?: string
  method: string
  parameters?: any
}
```

The property `apiVersion` is a number starting from 1 and with every new version is incremented by 1. Every increase indicates incompatibilities to the version before. In contrast, adding new features to an API does not increase its version number.

The properties `apiKey` and `token` are for authentication/authorization purposes. An API key is used for autenthicating other computer programs and a token to authenticate human users.

The properties `method` and `parameters` represent the name of the remote method and the parameters one likes to pass to it. A parameter can really be anything from simple values to objects. The latter are more common and the recommended style.

### Result

There is a class `Result` for sending a result to a client. A result can either be of type `value`, in which case everything went as expected, it can be of type `misfits`, in which case there were misfits in the parameter of the remote method call, or it can be of type `error` in which case there was an error on the remote side.

```typescript
class Result<T> {

  type: string // value, misfits, error
  misfits!: Misfit[] // the misfits
  error!: string // the error

  // 'misfits' and 'error' are asserted as non-null by the exclamation mark '!'
  // because otherwise TypeScript would want you to check for it which can be annoying

  constructor(type?: string, result?: T|Misfit|Misfit[]|string) { ...
```

The class `Misfit` describes misfits that occured while validating the given parameters. It is part of the package [knight-validation](https://github.com/c0deritter/knight-validation).

The following static methods can be used to constructing misfit and remote error results.

```typescript
Result.misfits(misfits)
Result.error('There was an error in our application. We will fix this soon.')
```

#### Creating your own result class

To use the result in your application you need to derive a new one for every use case. This is good for the documentation.

```typescript
class UserCreateResult extends Result {
  createdUser: User

  constructor(createdUser: User) {
    super()
    this.createdUser = createdUser
  }
}
```

## Sending a Remote Method Call via an HTTP request

For sending a remote mathod call via HTTP we suggest POSTonly as the HTTP usage style. It uses the `POST` HTTP method only and the remote method call data object is put as a JSON string into the body of the HTTP message. No other places for parameters needed.
