# Coderitter API RMC

A Coderitter implemention of the [remote-method-call](https://github.com/c0deritter/remote-method-call) aiming to offer an alternative to classic REST HTTP API's.

Selling points:

1. Choose your own method names instead of having to resort to the static set of partially unintuitive methods names like `PUT`, `POST`, `DELETE`, `PATCH` or `GET`
2. Put all parameters into the HTTP message in one place instead of cumbersomely putting them into mutliple ones
3. Extend your API to other transports like WebSockets, Kafka or MQTT without having to adjust your message format

## Related packages

On the server side you can use [coderitter-rmc-api](https://github.com/c0deritter/remote-method-api) which offers a simple mapping from a received remote method call to a function which receives the parameters of that remote method call for further processing.

## Install

`npm install coderitter-rmc`

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

The properties `method` and `parameters` represent the name of the remote method and the parameters one likes to pass to it. A parameter can be either from a simple value to an object. The latter are more common and the recommended style.

#### Method naming scheme and standard methods

The Coderitter API's remote method call uses an `Object.method` naming scheme. For example, an object might be called `User`. A method regarding a user might be `get`. Thus the resulting method name is `User.get`.

The Coderitter API defines the following standard methods which most of the objects want to implement.

- `get`: Retreive arbitrary many objects.
- `count`: Count objects.
- `store`: Stores an object. If the objects was not already stored, it is created, if it was already stored, it is updated.
- `delete`: Delete an object. Most of the time it will be implemented in the way that exactly one object is deleted. There can also be implementations where more than one object is.

Additional methods can and have to be added as appropriate.

### Result

A remote method call yields a result which is sent as a response from the server to the calling client. The result object contains the result values as expected by the API user. Additionally, it can also indicate two types of problems.

1. Misfits: The remote method call parameters contained illegitimate values, each problem being called a misfit. The API user can address these misfits and resend the remote method call.
2. Errors: There was an internal server error while executing the remote method call. The API user cannot address the problems and needs to consult the API creators.

This package provides a class which can be used as a useful base class for any specific result.

```typescript
class Result {
    misfits?: Misfit[]
    error?: string
}
```

If you want to test if the result contains misfits or an error, just check the corresponding properties.

```typescript
if (result.misfits) {
    console.log('The remote method call parameters contained mifits', result.misfits)
}

if (result.error) {
    console.log('The remote method call yielded an error while it was being executed.', result.error)
}
```

It provides a constructor which can be used to assign arbitrary result values to the object.

```typescript
let result = new Result({
    count: 1
})
```

It also provides two methods which will help you to create misfit and error results.

```typescript
Result.misfits(misfits)
Result.error('There was an error in our application. We will fix this soon.')
```

#### Creating your own result class

When defining results in your application you will want to specify the structure of different result types by creating classes for each of them.

```typescript
class UserCreateResult extends Result {
    createdUser: User

    constructor(createdUser: User) {
        super()
        this.createdUser = createdUser
    }
}
```

### Misfit

A misfit describes the reason why a value or a set of values is illegitimate. Examples for misfits are missing values, strings that do not have a desired length or numbers that are not in a specific range.

Every time one field of a remote method call is illegitimate, a misifts result will be returned. A misfits result contains a list of misfit objects.

A misfit contains the following information.

```typescript
export interface Misfit {
    type: string
    property?: string
    properties?: string[]
    constraints?: any
}
```

The `type` describes the type of the misfit. The `property` contains the name of the property which yielded the misfit. In the case the misfits relates to multiple properties, the `properties` property holds an array of property names. The `constaints` property is an object containing the constraints the property or properties must adhere to to be legitimate.

## Sending a Remote Method Call via an HTTP request

For sending a remote mathod call via HTTP we suggest POSTonly as the HTTP usage style. It uses the `POST` HTTP method only and the remote method call data object is put as a JSON string into the body of the HTTP message. No other places for parameters needed. You can use the package [postonly-request](https://github.com/c0deritter/postonly-request) to do so.
