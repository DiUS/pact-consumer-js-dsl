import sbt._
import au.com.dius.pact.sbt.CopyPacts

object ApplicationBuild extends Build {

  val projectSettings = Defaults.defaultSettings ++ CopyPacts.copyPactsSettings ++ Seq(
    CopyPacts.providerPactDir := "test/resources/pacts",
    //provide the repo and the pact file that you want to copy
    CopyPacts.providerRepos := Map(
    )
  )

  val project = Project (
    "project",
    file ("."),
    settings = projectSettings
  )
}