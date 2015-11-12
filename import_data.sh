#!/bin/sh

mongoimport -h localhost:3001 --db meteor --collection builds --type csv --file session_history.csv --headerline

mongo localhost:3001/meteor --eval "db.builds.find().forEach(function(doc){doc.created_at = new ISODate(doc.created_at);db.builds.save(doc)});"