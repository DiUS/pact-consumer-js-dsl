scalaVersion := "2.10.3"

resolvers += "rea-releases" at "http://nexus.gandalf.gandalf.realestate.com.au:8081/nexus/content/repositories/releases/"

resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

resolvers += "sonatype-releases" at "https://oss.sonatype.org/content/repositories/releases/"

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.2.1")

addSbtPlugin("au.com.dius" %% "pact-jvm-consumer-sbt" % "1.9")

libraryDependencies += "au.com.dius" %% "pact-jvm-consumer" % "1.9"

libraryDependencies += "au.com.dius" %% "pact-jvm-server" % "1.9"

resolvers += "Sonatype snapshots" at "http://oss.sonatype.org/content/repositories/snapshots/"

libraryDependencies += "com.github.detro.ghostdriver" % "phantomjsdriver" % "1.0.4" % "test"

libraryDependencies += "com.google.guava" % "guava" % "14.0"
