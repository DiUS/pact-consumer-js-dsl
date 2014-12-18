Pact JS Roadmap
---

We would like to remove the dependency on Ruby by using Phusion's [Travelling Ruby](https://github.com/phusion/traveling-ruby) to package the pact-mock_service gem as a standalone executable. This is preferred over writing a native javascript mock server, as duplicating all the matching logic and maintaining it long term will be a burden. If you are interested in assisting with the packaging (the Pact authors are a little swamped right now!) please hit us up on the [pact-dev](https://groups.google.com/forum/#!forum/pact-dev) google group.

At the moment, the DSL does not support flexible matching as there is no equivalent of Pact::Term or Pact::SomethingLike (though you could hack this in by hand if you really needed to). If you are interested in contributing, again, please contact us.
