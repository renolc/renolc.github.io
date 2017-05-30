# Couch Views and Today
## Mon May 29 2017

I ran into an interesting issue this past week regarding a Couch View and the concept of Today. Here's a synopsis of the problem as well as how it was fixed...

## A (very) brief overview of Couch

Just in case you haven't used Couch before, here is a quick summary.

### NoSQL

Couch is a document based DB. This means it will store raw JSON objects as opposed to relational tables like traditional SQL databases. Think Mongo, but with some philosophical differences.

### Revisions

Couch will keep record of every iteration of a document. It does this by never actually changing the document, but instead replacing them completely with new "revisions" and retaining the previous versions as history. So if you alter a field on a doc, you will get a new one with an incremented `_rev` key, while the original will still be there, just with the older revision ID.

### Views

Instead of SQL-like indexes, Couch uses Views. These are map/reduce functions defined in the DB that can parse through the documents and `emit` an arbitrary key/value pair. As a basic example:

```js
function (doc) {
  emit(doc.type, doc.name)
}
```

This View function will run on every doc in the database, and emit a key of the `type` with a value of the `name`. So then you can "query" this view by providing a `key` you are interested in, such as a `"person"`. So this this view would return all of the `name`s of the docs who have a type equal to `"person"`.

As Views are created and documents adjusted, the results of these Views are cached so you will get near instant results.

## The problem

There was a database full of records which contained a date field. As a contrived example, lets assume they looked like this:

```json
{
  "_id": "1",
  "_rev": "1",
  "createdOn": "2017-05-29"
}
```

There was a need to obtain every record that was created "today" (meaning on whatever day the query was run). The _obvious_ solution was to have a view like so (again, contrived example):


```js
// getToday
function (doc) {
  var today = new Date().toISOString().substr(0, 10)
  if (doc.createdOn === today) emit()
  // omitting values from emit is valid -- key and value will both be null
  // (_id is always available and the full doc can be obtained with a query param,
  // so no need to emit them directly)
}
```

You could then obtain the results by calling the `getToday` View. This _worked_... but only on the first day it was run. Wut.

## The reveal

So it turns out that Couch will optimize the Views by not double checking results that _previously_ passed, and who haven't updated _since_. This means that if my example doc from above hadn't changed, even if I ran that same View several days later, it would still `emit`. And Couch will _know_ the doc hasn't updated, because it's `_rev` hasn't changed at all. This is actually pretty smart, since it will keep the View performant on subsequent executions.

## The solution

It's rather obvious in hindsight, but the solution is to not have Views care about something like the concept of "today" (which is subjective). Instead, the more "Couch way" would be something like this:

```js
// getByDate
function (doc) {
  emit(doc.createdOn)
  // omitting the value portion of emit will default to `null`
  // which isn't a problem (see comment in above view function)
}
```

Now my view doesn't care what day it happens to be. All it knows is there are docs that have a `createdOn` field, and we want to `emit` all of them as keys. As mentioned above, you can pass in keys that you care about and Couch will filter the View results accordingly. So we move the concept of "today" to the client and can now query the View like so: `getByDate?key="2017-05-29"`. This will return all records with `createdOn` equal to the date passed in. No more worrying about the cached results going out of date, since it's now up to the client to pass in the correct date. Couch will happily chug along.

Again, it seems so obvious in hindsight, but the symptoms weren't immediately obvious, so I thought this might be helpful to someone else out there.