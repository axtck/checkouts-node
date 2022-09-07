# GQL

***Using GraphQL with Node.js and Express***

---

## Queries

Getting a list of checkouts and querying some data like score and the name of the user that belongs to the checkout

```javascript
query {
  checkouts {
    id
    score
    user {
      name
    }
  } 
}
```

Output

```javascript
{
  "data": {
    "checkouts": [
      {
        "id": 1,
        "score": 40,
        "user": {
          "name": "Alexander"
        }
      },
      {
        "id": 2,
        "score": 40,
        "user": {
          "name": "Alexander"
        }
      },
      {
        "id": 3,
        "score": 40,
        "user": {
          "name": "Stephaan"
        }
      },
      {
        "id": 4,
        "score": 40,
        "user": {
          "name": "Hendrik"
        }
      },
      {
        "id": 5,
        "score": 40,
        "user": {
          "name": "Stephaan"
        }
      }
    ]
  }
}
```

Passing arguments to get data by id

```javascript
query {
  checkout(id: 2) {
    user {
      name
      age
    }
  }
}
```

Output

```javascript
{
  "data": {
    "checkout": {
      "user": {
        "name": "Alexander",
        "age": 22
      }
    }
  }
}
```

---

## Mutations 

Mutating data by arguments

```javascript
mutation {
  addUser(name: "Bob", age:20) {
    id
    name
  }
}
```

Output

```javascript
{
  "data": {
    "addUser": {
      "id": 4,
      "name": "Bob"
    }
  }
}
```

