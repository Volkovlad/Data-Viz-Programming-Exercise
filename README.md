Charts app

First of all, you need to install Meteor

$ curl https://install.meteor.com/ | sh

Than:

$ sudo apt-get install mongodb-clients

After that, move to folder, where application is located. Run app:

$ meteor

By default, app is running on 3000 port and MongoDB is running on 3001.

On this step, you should have data in DB. If not, you can execute import_data.sh, if you are running on 3000 port.
In other case use this command:

mongoimport -h localhost:3001 --db meteor --collection builds --type csv --file session_history.csv --headerline

-h = the host (or server) name.
--port = specifies the port on the host that the MongoDB database is listening on. By default, Meteor uses port 3000 so we use 3001 for the Mongo db.
--db	= the name of your database, in this case, meteor.
-collection	= the name of the collection to import the CSV file into. You can also use --c for short.
In the above, my collection is called ‘builds’.
--type The format of the file to be imported. In our case, it’s a csv but it can also be a json, or a tsv (and potentially some other format too. I haven’t checked).
--file The physical location of the file. Since we placed it in the main directory, we didn’t have to include any pathnames. If you have it somewhere else, like in a subdirectory, or in your documents folder, or even on your Desktop, just type the correct filepath and you’re good to go.
--fields What columns of your csv file you’d like to use.
--headerline This simply tells MongoDB to disregard the first line of the CSV file.


Abnormal number of failing builds.

In my opinion, it is a good idea to give control to user. So, user set 'Acceptable Percent Of Failing Builds'. 