import java.io.ByteArrayOutputStream

plugins {
    java
    jacoco
    checkstyle
    id("org.sonarqube") version "3.0"
}

group = "thecoronials"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("junit:junit:4.12")
    testImplementation("org.mockito:mockito-inline:3.6.28")

    implementation("com.amazon.alexa:ask-sdk:2.20.2")
    implementation("com.amazonaws:aws-lambda-java-log4j2:1.1.0")
    implementation("com.aventrix.jnanoid:jnanoid:2.0.0")

    implementation("com.google.code.gson:gson:2.8.5")
    implementation("org.apache.commons:commons-lang3:3.11")
    implementation("com.amazonaws:aws-lambda-java-core:1.2.1")
    implementation("com.amazonaws:aws-lambda-java-events:3.7.0")
    implementation("com.amazonaws:aws-java-sdk-stepfunctions:1.11.908")
}

/* JUNIT */
tasks.named<Test>("test") {
    reports.junitXml.destination = file("$buildDir/reports/xml/junit/")
    reports.html.destination = file("$buildDir/reports/html/junit/")
}

/* JACOCO */
tasks.jacocoTestReport {
    reports {
        xml.isEnabled = true
        html.destination = file("${buildDir}/reports/html/jacoco/")
        xml.destination = file("${buildDir}/reports/xml/jacoco/jacoco.xml")
    }
}

tasks.create("jacoco") {
    description = "Runs Tests and generates jacoco report."
    group = "verification"

    dependsOn("test", "jacocoTestReport")
}

/* CHECKSTYLE */
tasks.withType<Checkstyle>().configureEach {
    group = "codestyle"
    ignoreFailures = true
    reports {
        html.isEnabled = true
        xml.isEnabled = true
        html.destination = file("${buildDir}/reports/html/checkstyle/checkstyle.html")
        xml.destination = file("${buildDir}/reports/xml/checkstyle/checkstyle.xml")
    }
}

/* UBER JAR */
tasks.create<Jar>("uber-jar") {
    description = "Create jar for upload"
    group = "build"

    /* Get current branch an commit */
    val branch = System.getenv("GIT_BRANCH") ?: ByteArrayOutputStream().use { stream ->
        exec {
            workingDir("$projectDir")
            executable = "git"
            args = listOf("rev-parse", "--abbrev-ref", "HEAD")
            standardOutput = stream
        }
        stream.toString()
    }.trim()

    val commit = ByteArrayOutputStream().use { stream ->
        exec {
            workingDir("$projectDir")
            executable = "git"
            args = listOf("rev-parse", "--verify", "HEAD")
            standardOutput = stream
        }
        stream.toString().substring(0, 8)
    }.trim()

    archiveBaseName.set("uber-$branch-$commit")
    from(sourceSets.main.get().output)
    dependsOn(configurations.runtimeClasspath)
    from({
        configurations.runtimeClasspath.get().filter { it.name.endsWith("jar") }.map { zipTree(it) }
    })
}

/* Sonar */
sonarqube {
    properties {
        property("sonar.exclusions", "src/main/java/com/xavidop/alexa/**/*")
        property("sonar.coverage.exclusions", "src/main/java/com/xavidop/alexa/**/*")
    }
}