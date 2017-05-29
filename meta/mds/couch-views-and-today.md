# Couch Views and Today
## Mon May 29 2017

I ran into an interesting issue this past week regarding a Couch View. Here's a synopsis of the problem as well as how it was fixed...

## A (very) brief overview of Couch

Just in case you haven't used Couch before, here is a quick summary.

### NoSQL

Couch is a document based DB. This means it will store raw JSON objects as opposed to relational tables like traditional SQL databases. Think Mongo, but with some philosophical differences.

### Revisions

Couch will keep record of every change you make to a document. It does this by never actually changing the records, but instead replacing them completely with new "revisions" and retaining the previous versions. So if you alter a field on a doc, you will get a new doc with an incremented `_rev` key, while the original doc will still be there, just with the older revision ID.

### Views

Instead of SQL-like indexes, Couch uses Views. These are map/reduce functions defined in the DB that can parse through the documents and `emit` an arbitrary key/value pair. As a basic example:

```js
function (doc) {
  emit(doc.type, doc.name)
}
```

This View function will run on every doc in the database, and emit a key of the doc `type` with a value of the doc `name`. So then you can "query" this view by providing a `key` you are interested in, such as a `"person"`. So this this view would return all of the `name`s of the docs who have a type equal to `"person"`.

As Views are created and documents adjusted, the results of these Views are cached so you will get near instant results.