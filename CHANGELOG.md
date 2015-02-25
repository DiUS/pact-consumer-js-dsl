# Changelog

Do this to generate your change history

  git log --pretty=format:'  * %h - %s (%an, %ad)'

### 0.1.3 (25 Feb 2015)

* 0debea5 - Fixing examples. (Beth Skurrie, Wed Feb 25 14:02:46 2015 +1100)
* db5bd4e - removing custom UMD template, adding scoped XMLHttpRequest within Pact.Http, fixing tests accordingly (Michel Boudreau, Tue Feb 24 10:44:14 2015 +1100)
* eadd791 - adding run-sequence to package.json (Michel Boudreau, Tue Feb 24 09:11:49 2015 +1100)
* b1c5324 - fixing tests to be more agnostic, changing gulpfile to work better sequencially (Michel Boudreau, Mon Feb 23 17:27:53 2015 +1100)
* cfd60c2 - fixing gulp and synchronous tasks so there's no conflict in pact, added some code at top of tests to run in both web and node mode (Michel Boudreau, Mon Feb 23 16:57:59 2015 +1100)
* 525c762 - Merging in @mboudreau's changes to the MockService and adding unit tests. (Beth Skurrie, Thu Feb 19 12:57:27 2015 +1100)
* 5690bed - Merging in packaging and gulp build changes from @mboudreau (Beth Skurrie, Wed Feb 18 08:48:19 2015 +1100)
* 6c372c4 - Fixing typos and improving laying in README. Putting bundle exec back in. (Beth Skurrie, Wed Feb 18 08:47:31 2015 +1100)
* afbee20 - Merging documentation changes from @mboudreau (Beth Skurrie, Wed Feb 18 08:46:36 2015 +1100)

### 0.1.2 (25 Feb 2015)

* feec9cc - Updated CONTRIBUTING.md with npm publish instructions (Beth, Wed Feb 25 08:50:21 2015 +1100)
* c46ed6e - DRY up mock service response handling code. Raise error if 'done' option not provided. (Beth, Tue Feb 3 20:59:42 2015 +1100)
* e71bc02 - Accept fail test callback via constructor for mock service to allow it to be set in a beforeEach (Ben Sayers, Mon Feb 2 19:30:57 2015 +1100)
* 414e101 - Add an initial wait for the pact server to spin up so the tests don't execute too soon. (Ben Sayers, Thu Jan 22 13:03:32 2015 +1100)
* 5376021 - Add done callback to mockService to allow errors to be communicated back to the tests in a async friendly way (Ben Sayers, Thu Jan 15 22:39:15 2015 +1100)
* 019bb15 - Update run-tests task to return non-0 status code when the pact server fails to start (Ben Sayers, Tue Jan 13 23:08:11 2015 +1100)
* ecf8750 - Fix tests to fail when pact verification fails (Ben Sayers, Tue Jan 13 23:04:08 2015 +1100)
* 0be652d - Update package.json to point to correct main file and update docs with latest details on how to run the project (Ben Sayers, Tue Jan 13 23:02:31 2015 +1100)
* 96cacaf - Fixed #15 - Add nodejs support (Ben Sayers, Tue Jan 6 22:38:06 2015 +1100)
* 66a501c - Update mockService to make asynchronous http requests (Ben Sayers, Tue Dec 23 23:21:40 2014 +1100)
* b4a47d7 - Moved pact dir config to mock service command line (Beth Skurrie, Wed Jan 28 17:23:02 2015 +1100)
* bca90f8 - Update README.md (Beth Skurrie, Wed Jan 21 09:31:04 2015 +1100)
* dfb06fe - Fixed https://github.com/bethesque/pact-mock_service/issues/9 It should actually be upper case, but we need to fix https://github.com/bethesque/pact-support/issues/3 first (Beth, Fri Jan 16 18:11:46 2015 +1100)
* 91b1049 - Updated package.json (Beth, Fri Jan 9 11:15:59 2015 +1100)

### 0.1.0 (3 Feb 2015)

* e71bc02 - Accept fail test callback via constructor for mock service to allow it to be set in a beforeEach (Ben Sayers, Mon Feb 2 19:30:57 2015 +1100)
* 414e101 - Add an initial wait for the pact server to spin up so the tests don't execute too soon. (Ben Sayers, Thu Jan 22 13:03:32 2015 +1100)
* 5376021 - Add done callback to mockService to allow errors to be communicated back to the tests in a async friendly way (Ben Sayers, Thu Jan 15 22:39:15 2015 +1100)
* 019bb15 - Update run-tests task to return non-0 status code when the pact server fails to start (Ben Sayers, Tue Jan 13 23:08:11 2015 +1100)
* ecf8750 - Fix tests to fail when pact verification fails (Ben Sayers, Tue Jan 13 23:04:08 2015 +1100)
* 0be652d - Update package.json to point to correct main file and update docs with latest details on how to run the project (Ben Sayers, Tue Jan 13 23:02:31 2015 +1100)
* 96cacaf - Fixed #15 - Add nodejs support (Ben Sayers, Tue Jan 6 22:38:06 2015 +1100)
* 66a501c - Update mockService to make asynchronous http requests (Ben Sayers, Tue Dec 23 23:21:40 2014 +1100)
* b4a47d7 - Moved pact dir config to mock service command line (Beth Skurrie, Wed Jan 28 17:23:02 2015 +1100)
* dfb06fe - Fixed https://github.com/bethesque/pact-mock_service/issues/9 It should actually be upper case, but we need to fix https://github.com/bethesque/pact-support/issues/3 first (Beth, Fri Jan 16 18:11:46 2015 +1100)

### 0.0.4 (5 Jan 2015)

* b168996 - Set providerState to null when not specified (Beth Skurrie, Mon Jan 5 16:14:24 2015 +1100)
