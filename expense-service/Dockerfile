FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B
COPY ca.pem .
RUN keytool -import -trustcacerts -alias aiven -file ca.pem -keystore truststore.jks -storepass changeit -noprompt

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/truststore.jks truststore.jks
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]