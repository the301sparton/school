# School

A cloud based school management system by vaicomp.com

## Getting Started

School is an full fleaged school management system developed by vaicomp.com It includes functionalities like student data mmanagement, accounting, Online tests, Attendence and statistical analysis.

## Deployment

Go to myPhpAdmin and import the database.sql file from stable release

##### Changes to apis/db.php

```
$servername = "localhost";

$username = "u353330278_bes";

$password = "";  //Insert Password Here

$dbname = "u353330278_bes";
```

##### Changes to js/config.js
```
var baseUrl = "";

var logOutUrl = "https://besgondia.org";
```


## Deploy to Hostinger 

```
git checkout production
git merge master
git commit -production
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/the301sparton/school/tags). 

## Authors

* **Chaitanya Deshpande** - [the301sparton](https://github.com/the301sparton)

See also the list of [contributors](https://github.com/the301sparton/school/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Bootstrap Made
* jsgrid
* FirebaseUi
