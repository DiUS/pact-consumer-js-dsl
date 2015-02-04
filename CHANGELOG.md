# Changelog

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
