# Coderitter API Architecture - Remote method call (RMC)

An implementation of the [remote-method-call](https://github.com/coderitter/remote-method-call) for the Coderitter API Architecture. Please refer to its [README.md](https://github.com/coderitter/remote-method-call) to find out more about what a remote method call is and how its implementation philosophy aims to support any protocol.

The RMC implementation of this package addresses the requirements of the Coderitter API Architecture. Thus, it is intended to be used in conjunction with it, though it might be general enough to be also interesting for other applications. If you need your very own implementation, start from this package or from the [remote-method-call](https://github.com/coderitter/remote-method-call) base package.

## Related packages

On the server side, the Coderitter API Architecture uses the [coderitter-rmc-api](https://github.com/coderitter/remote-method-api), which offers a simple mapping from a received remote method call to a function which receives the parameters of that remote method call for further processing.

## Install

`npm install coderitter-api-rmc`

## Overview

### RemoteMethodCall

There is an interface `RemoteMethodCall` which describes the appearance of remote method calls that can be send to a server.

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

The properties `apiKey` and `token` are for authentication/authorization purposes. An API key is used for authenticating other computer programs and a token to authenticate human users.

The properties `method` and `parameters` represent the name of the remote method and the parameters one likes to pass to it. A parameter can be either a simple value or a complete object. The latter is more common and the recommended style.

#### Method naming scheme and standard methods

The Coderitter API's remote method call uses an `Entity.method` naming scheme. For example, an entity might be called `User`. A method regarding a user might be `get`. Thus the resulting method name is `User.get`.

The Coderitter API defines the following standard methods which most of the entities want to implement.

- `get`: Retrieve entities.
- `count`: Count entities.
- `store`: Stores an entity. If the entity was not already stored, it is created, if it was already stored, it is updated.
- `delete`: Delete an entity.

Additional methods can and have to be added as appropriate.

#### Default remote method call interfaces

This package defines a set of default remote method call interfaces.

- `RemoteCriteriaCall`: Uses [knight-criteria](https://github.com/coderitter/knight-criteria) to retrieve individually filtered entities for example through a get method.

### Result

A remote method call yields a result which is sent as a response from the server to the calling client. The result object contains the result values as expected by the API user. Additionally, it can also indicate two types of problems.

1. Misfits: The parameters of the remote method call contained illegitimate values, each problem being called a misfit.
2. Errors: If there was a problem, other than a misfitting parameter value, processing the remote method call on the server. The API user cannot address the problems and needs to consult the API creators.

This package provides the class `Result` which is the base class for every result.

```typescript
class Result {
    misfits?: Misfit[]
    error?: string
}
```

If you want to test if the result contains misfits or an error, just check the corresponding properties.

```typescript
if (result.misfits) {
    console.log('The remote method call parameters contained misfits', result.misfits)
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

#### Default result classes

This package also defines a set of default results.

- `ChangeResult`: A result that contains [knight-change](https://github.com/coderitter/knight-change) `Changes` and can be used when the called method method altered the data inside an entity store like a traditional SQL database.
- `GetResult`: A result that is used for get methods that return entities from the database.
- `CountResult`: A result that is used for count methods that count entities inside a database.

#### Creating your own result class

When defining results in your application you will want to specify the structure of different result types by creating classes for each of them.

```typescript
class UserLoginResult extends Result {
    user: User

    constructor(user: User) {
        super()
        this.user = user
    }
}
```

## Sending a Remote Method Call via an HTTP request

For sending a remote method call via HTTP the [POSTonly](https://github.com/coderitter/knight-criteria#postonly) HTTP usage style is used. It uses the `POST` HTTP method only and the remote method call data object is put as a JSON string into the body of the HTTP message. No other places for parameters needed.
