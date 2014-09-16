name := "pact-script"

version := "1.0"

TaskKey[Unit]("pact") := {
	val serverPort = sys.props.getOrElse("server.port", "29999")
	au.com.dius.pact.server.Server.main(Array(serverPort))
	val buildSuccess = s"/bin/sh build.sh $serverPort".!
    if(buildSuccess != 0) {
        throw new RuntimeException("Build script terminated with a non-zero exit code.  Failing the build.")
    }
}