# ================================
# Stage 1: BUILD
# ================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper & pom.xml first (for dependency caching)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Fix permission for mvnw (common issue when cloned from Windows)
RUN chmod +x mvnw

# Download dependencies (cached if pom.xml unchanged)
RUN ./mvnw dependency:go-offline -B

# Copy source code & build the JAR (skip tests for speed)
COPY src ./src
RUN ./mvnw package -DskipTests -B

# ================================
# Stage 2: RUN
# ================================
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Copy only the final JAR from the builder stage
COPY --from=builder /app/target/SpringEventDrivent-0.0.1-SNAPSHOT.jar app.jar

# Expose the port Spring Boot runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
