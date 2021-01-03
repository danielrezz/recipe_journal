# How can we save data to our app?

## Description
  * One way can do this is save it to a file. This code is a proof of concept of how we can save data to a file and read data.


# Make request to read data
```
  Request GET => http://localhost:3000/note

  Response: 200
  [
    {
        "title": "Christmas List",
        "text": "PS5",
        "id": "e0178edc-f46f-4b8d-a386-4b422f4fb390"
    }
  ]
```

# Make post request to save:
```
  Request POST => http://localhost:3000/note
  {
      "title": "Christmas List",
      "text": "PS5"
  }

  Response: 200
  {
    "title": "Christmas List",
    "text": "PS5",
    "id": "e0178edc-f46f-4b8d-a386-4b422f4fb390"
  }
```